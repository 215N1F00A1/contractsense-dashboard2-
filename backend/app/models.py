from sqlalchemy import Column, String, DateTime, Integer, Text, JSON, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, VECTOR
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from .database import Base

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    documents = relationship("Document", back_populates="user")
    chunks = relationship("Chunk", back_populates="user")

class Document(Base):
    __tablename__ = "documents"
    
    doc_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    filename = Column(String(255), nullable=False)
    uploaded_on = Column(DateTime, default=datetime.utcnow)
    expiry_date = Column(Date)
    status = Column(String(50), default="Active")
    risk_score = Column(String(20), default="Low")
    file_size = Column(Integer)
    page_count = Column(Integer)
    
    # Relationships
    user = relationship("User", back_populates="documents")
    chunks = relationship("Chunk", back_populates="document")

class Chunk(Base):
    __tablename__ = "chunks"
    
    chunk_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doc_id = Column(UUID(as_uuid=True), ForeignKey("documents.doc_id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    text_chunk = Column(Text, nullable=False)
    embedding = Column(VECTOR(1536))  # OpenAI embedding dimensions
    metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    document = relationship("Document", back_populates="chunks")
    user = relationship("User", back_populates="chunks")