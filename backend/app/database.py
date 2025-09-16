from sqlalchemy import create_engine, Column, String, DateTime, Integer, Text, ARRAY, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import UUID, VECTOR
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/contractai")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Database dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
    
    # Enable pgvector extension (requires superuser privileges)
    try:
        with engine.connect() as conn:
            conn.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            conn.commit()
    except Exception as e:
        print(f"Warning: Could not create vector extension: {e}")
        print("Please run 'CREATE EXTENSION vector;' manually as a superuser")