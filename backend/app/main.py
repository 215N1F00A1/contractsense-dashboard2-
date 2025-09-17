from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv
from openai import OpenAI

from .database import get_db, init_db
from .models import User, Document, Chunk
from .schemas import (
    UserCreate,
    UserLogin,
    TokenResponse,
    ContractResponse,
    QueryRequest,
    QueryResponse,
)
from .auth import (
    create_access_token,
    verify_token,
    get_password_hash,
    verify_password,
)
from .llama_mock import mock_llama_parse

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

# Initialize FastAPI app
app = FastAPI(
    title="ContractAI API",
    description="AI-Powered Contract Management System",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://contractsense-dashboard2.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


@app.on_event("startup")
async def startup_event():
    init_db()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """Get current authenticated user"""
    try:
        payload = verify_token(credentials.credentials)
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = db.query(User).filter(User.user_id == user_id).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------------- AUTH ----------------

@app.post("/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """User registration"""
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = get_password_hash(user_data.password)
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": str(user.user_id)})

    return TokenResponse(access_token=access_token, token_type="bearer")


@app.post("/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """User authentication"""
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": str(user.user_id)})

    return TokenResponse(access_token=access_token, token_type="bearer")


# ---------------- UPLOAD ----------------

@app.post("/upload")
async def upload_contract(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload and process contract document"""

    allowed_types = [
        "application/pdf",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")

    content = await file.read()

    # Mock parsing with llama
    parsed_result = mock_llama_parse(file.filename, content)

    # Save document
    document = Document(
        user_id=current_user.user_id,
        filename=file.filename,
        file_size=len(content),
        page_count=parsed_result.get("page_count", 1),
        status="Active",
        risk_score="Low",
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    # Generate embeddings for each chunk
    for chunk_data in parsed_result["chunks"]:
        embedding_response = client.embeddings.create(
            input=chunk_data["text"], model="text-embedding-3-small"
        )
        embedding = embedding_response.data[0].embedding

        chunk = Chunk(
            doc_id=document.doc_id,
            user_id=current_user.user_id,
            text_chunk=chunk_data["text"],
            embedding=embedding,
            metadata=chunk_data["metadata"],
        )
        db.add(chunk)

    db.commit()

    return {
        "message": "Contract uploaded and processed successfully",
        "document_id": str(document.doc_id),
    }


# ---------------- CONTRACTS ----------------

@app.get("/contracts", response_model=List[ContractResponse])
async def get_contracts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    risk: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's contracts with filtering and pagination"""
    query = db.query(Document).filter(Document.user_id == current_user.user_id)

    if search:
        query = query.filter(Document.filename.ilike(f"%{search}%"))
    if status:
        query = query.filter(Document.status == status)
    if risk:
        query = query.filter(Document.risk_score == risk)

    contracts = query.offset(skip).limit(limit).all()

    return [ContractResponse.from_orm(contract) for contract in contracts]


@app.get("/contracts/{contract_id}")
async def get_contract_detail(
    contract_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get detailed contract information"""
    contract = (
        db.query(Document)
        .filter(Document.doc_id == contract_id, Document.user_id == current_user.user_id)
        .first()
    )

    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    chunks = (
        db.query(Chunk)
        .filter(Chunk.doc_id == contract_id, Chunk.user_id == current_user.user_id)
        .all()
    )

    return {
        "contract": ContractResponse.from_orm(contract),
        "chunks": [{"text": c.text_chunk, "metadata": c.metadata} for c in chunks],
    }


# ---------------- ASK / RAG ----------------

@app.post("/ask", response_model=QueryResponse)
async def query_contracts(
    query_data: QueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Natural language query interface with OpenAI + pgvector"""

    # Generate query embedding
    query_embedding = client.embeddings.create(
        input=query_data.query, model="text-embedding-3-small"
    ).data[0].embedding

    # Perform similarity search using PostgreSQL + pgvector
    results = db.execute(
        """
        SELECT chunk_id, text_chunk, metadata,
               1 - (embedding <=> :embedding) AS similarity
        FROM chunks
        WHERE user_id = :user_id
        ORDER BY embedding <=> :embedding
        LIMIT 5
        """,
        {"embedding": query_embedding, "user_id": str(current_user.user_id)},
    ).fetchall()

    # Call OpenAI Chat for contextual answer
    context = "\n\n".join([row.text_chunk for row in results])
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a legal contract assistant."},
            {
                "role": "user",
                "content": f"Question: {query_data.query}\n\nRelevant context:\n{context}",
            },
        ],
    )

    answer = completion.choices[0].message.content

    return QueryResponse(
        answer=answer,
        query=query_data.query,
        chunks=[
            {
                "text": row.text_chunk,
                "metadata": row.metadata,
                "relevance_score": float(row.similarity) * 100,
            }
            for row in results
        ],
    )


# ---------------- ANALYTICS ----------------

@app.get("/analytics/summary")
async def get_analytics_summary(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Portfolio summary analytics"""
    total_contracts = (
        db.query(Document).filter(Document.user_id == current_user.user_id).count()
    )
    active_contracts = (
        db.query(Document)
        .filter(Document.user_id == current_user.user_id, Document.status == "Active")
        .count()
    )

    return {
        "total_contracts": total_contracts,
        "active_contracts": active_contracts,
        "high_risk_contracts": 2,  # Mock
        "expiring_soon": 3,  # Mock
    }


# ---------------- DELETE ----------------

@app.delete("/contracts/{contract_id}")
async def delete_contract(
    contract_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete contract + its chunks"""
    contract = (
        db.query(Document)
        .filter(Document.doc_id == contract_id, Document.user_id == current_user.user_id)
        .first()
    )

    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    db.query(Chunk).filter(Chunk.doc_id == contract_id).delete()
    db.delete(contract)
    db.commit()

    return {"message": "Contract deleted successfully"}


# ---------------- HEALTH ----------------

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
