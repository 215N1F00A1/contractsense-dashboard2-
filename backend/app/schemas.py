from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any, Dict
from datetime import datetime, date
import uuid

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class ContractResponse(BaseModel):
    doc_id: str
    filename: str
    uploaded_on: datetime
    expiry_date: Optional[date]
    status: str
    risk_score: str
    file_size: Optional[int]
    page_count: Optional[int]
    
    class Config:
        from_attributes = True

class ChunkResponse(BaseModel):
    text: str
    metadata: Dict[str, Any]
    relevance_score: float

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str
    chunks: List[ChunkResponse]
    query: str

class AnalyticsSummary(BaseModel):
    total_contracts: int
    active_contracts: int
    high_risk_contracts: int
    expiring_soon: int