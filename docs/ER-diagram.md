# ContractAI Database Schema - ER Diagram

## Entity Relationship Diagram

```
┌─────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│     users       │       │    documents     │       │     chunks       │
├─────────────────┤       ├──────────────────┤       ├──────────────────┤
│ user_id (PK)    │───────│ user_id (FK)     │───────│ user_id (FK)     │
│ username        │   │   │ doc_id (PK)      │   │   │ chunk_id (PK)    │
│ email           │   │   │ filename         │   │   │ doc_id (FK)      │
│ password_hash   │   │   │ uploaded_on      │   │   │ text_chunk       │
│ created_at      │   │   │ expiry_date      │   │   │ embedding        │
└─────────────────┘   │   │ status           │   │   │ metadata         │
                      │   │ risk_score       │   │   │ created_at       │
                      │   │ file_size        │   │   └──────────────────┘
                      │   │ page_count       │   │            
                      │   └──────────────────┘   │            
                      │                          │            
                      └──────────────────────────┘            
```

## Table Descriptions

### users
- **Purpose**: Store user authentication and profile information
- **Primary Key**: user_id (UUID)
- **Unique Constraints**: username, email
- **Relationships**: One-to-many with documents and chunks

### documents  
- **Purpose**: Store contract metadata and file information
- **Primary Key**: doc_id (UUID)
- **Foreign Keys**: user_id references users(user_id)
- **Indexes**: user_id, status, risk_score, expiry_date
- **Relationships**: Many-to-one with users, one-to-many with chunks

### chunks
- **Purpose**: Store document chunks with vector embeddings for semantic search
- **Primary Key**: chunk_id (UUID)  
- **Foreign Keys**: 
  - user_id references users(user_id)
  - doc_id references documents(doc_id)
- **Special Columns**: 
  - embedding (VECTOR type with 1536 dimensions)
  - metadata (JSONB for flexible data storage)
- **Indexes**: 
  - user_id, doc_id (for filtering)
  - embedding (IVFFLAT index for vector similarity search)

## Key Design Decisions

1. **Multi-tenant Isolation**: All tables include user_id to ensure data isolation
2. **Vector Search**: pgvector extension enables efficient semantic similarity search
3. **Flexible Metadata**: JSONB column stores page numbers, confidence scores, etc.
4. **UUID Primary Keys**: Provides security and enables distributed systems
5. **Proper Relationships**: Foreign key constraints maintain data integrity

## SQL Schema

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, 
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
    doc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    uploaded_on TIMESTAMP DEFAULT NOW(),
    expiry_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    risk_score VARCHAR(20) DEFAULT 'Low',
    file_size INTEGER,
    page_count INTEGER
);

-- Chunks table with vector embeddings
CREATE TABLE chunks (
    chunk_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_id UUID REFERENCES documents(doc_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    text_chunk TEXT NOT NULL,
    embedding vector(1536), -- OpenAI embedding dimensions
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_risk_score ON documents(risk_score);
CREATE INDEX idx_documents_expiry_date ON documents(expiry_date);

CREATE INDEX idx_chunks_user_id ON chunks(user_id);
CREATE INDEX idx_chunks_doc_id ON chunks(doc_id);
CREATE INDEX idx_chunks_embedding ON chunks USING ivfflat (embedding vector_cosine_ops);

-- Row Level Security (optional for additional security)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY documents_isolation ON documents
    FOR ALL TO authenticated_users
    USING (user_id = current_setting('app.current_user')::uuid);

CREATE POLICY chunks_isolation ON chunks  
    FOR ALL TO authenticated_users
    USING (user_id = current_setting('app.current_user')::uuid);
```

## Sample Queries

### Vector Similarity Search
```sql
-- Find similar chunks for a query
SELECT c.text_chunk, c.metadata, 
       c.embedding <-> $1 as distance
FROM chunks c 
WHERE c.user_id = $2
ORDER BY c.embedding <-> $1
LIMIT 5;
```

### Contract Analytics
```sql
-- Risk distribution by user
SELECT risk_score, COUNT(*) as count
FROM documents 
WHERE user_id = $1
GROUP BY risk_score;

-- Expiring contracts
SELECT filename, expiry_date
FROM documents
WHERE user_id = $1 
  AND expiry_date BETWEEN NOW() AND NOW() + INTERVAL '90 days'
ORDER BY expiry_date;
```

This schema supports the full requirements including multi-tenant isolation, vector search capabilities, and efficient contract management operations.