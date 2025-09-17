from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
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
from .auth import create_access_token, verify_token, get_password_hash, verify_password
from .llama_mock import mock_llama_parse

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI(
    title="ContractAI API",
    description="AI-Powered Contract Management System",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://contractsense-dashboard2.vercel.app",
    ],
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


# -------------------- AUTH --------------------

@app.post("/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
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

    token = create_access_token(data={"sub": str(user.user_id)})
    return TokenResponse(access_token=token, token_type="bearer")


@app.post("/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": str(user.user_id)})
    return TokenResponse(access_token=token, token_type="bearer")


# -------------------- UPLOAD --------------------

@app.post("/upload")
async def upload_contract(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    allowed_types = [
        "application/pdf",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")

    content = await file.read()
    parsed_result = mock_llama_parse(file.filename, content)

    # Simple AI risk scoring
    risk_prompt = f"Classify this contract '{file.filename}' into risk category (Low, Medium, High) based on termination, liability, penalties."
    risk_completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": risk_prompt}],
    )
    risk_score = risk_completion.choices[0].message.content.strip()
    if risk_score not in ["Low", "Medium", "High"]:
        risk_score = "Low"

    document = Document(
        user_id=current_user.user_id,
        filename=file.filename,
        file_size=len(content),
        page_count=parsed_result.get("page_count", 1),
        status="Active",
        risk_score=risk_score,
    )
    db.add(document)
    db.commit()
    db.refresh(document)

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
    return {"message": "Uploaded successfully", "document_id": str(document.doc_id)}


# -------------------- CONTRACTS --------------------

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
    query = db.query(Document).filter(Document.user_id == current_user.user_id)
    if search:
        query = query.filter(Document.filename.ilike(f"%{search}%"))
    if status:
        query = query.filter(Document.status == status)
    if risk:
        query = query.filter(Document.risk_score == risk)

    contracts = query.offset(skip).limit(limit).all()
    return [ContractResponse.from_orm(c) for c in contracts]


@app.get("/contracts/{contract_id}")
async def get_contract_detail(
    contract_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
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


@app.delete("/contracts/{contract_id}")
async def delete_contract(
    contract_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
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
    return {"message": "Contract deleted"}


# -------------------- AI QUERY --------------------

@app.post("/ask", response_model=QueryResponse)
async def query_contracts(
    query_data: QueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query_embedding = client.embeddings.create(
        input=query_data.query, model="text-embedding-3-small"
    ).data[0].embedding

    chunks = (
        db.query(Chunk).filter(Chunk.user_id == current_user.user_id).limit(5).all()
    )

    ai_answer = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": f"Answer the query: {query_data.query} based on these contracts.",
            }
        ],
    ).choices[0].message.content

    relevant_chunks = [
        {"text": c.text_chunk, "metadata": c.metadata, "relevance_score": 85}
        for c in chunks
    ]

    # TODO: store query in a queries table (add migration)
    return QueryResponse(answer=ai_answer, chunks=relevant_chunks, query=query_data.query)


@app.get("/ask/history")
async def get_query_history(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    # placeholder: implement once queries table exists
    return {"history": []}


# -------------------- ANALYTICS --------------------

@app.get("/analytics/summary")
async def get_analytics_summary(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    total = db.query(Document).filter(Document.user_id == current_user.user_id).count()
    active = (
        db.query(Document)
        .filter(Document.user_id == current_user.user_id, Document.status == "Active")
        .count()
    )
    return {
        "total_contracts": total,
        "active_contracts": active,
        "high_risk_contracts": 2,
        "expiring_soon": 3,
    }


@app.get("/analytics/risks")
async def get_risk_distribution(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    risks = {"Low": 0, "Medium": 0, "High": 0}
    docs = db.query(Document).filter(Document.user_id == current_user.user_id).all()
    for d in docs:
        if d.risk_score in risks:
            risks[d.risk_score] += 1
    return risks


@app.get("/analytics/expiring")
async def get_expiring_contracts(
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cutoff = datetime.utcnow().date() + timedelta(days=days)
    expiring = (
        db.query(Document)
        .filter(Document.user_id == current_user.user_id, Document.expiry_date <= cutoff)
        .all()
    )
    return [ContractResponse.from_orm(c) for c in expiring]


# -------------------- OTHER --------------------

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
