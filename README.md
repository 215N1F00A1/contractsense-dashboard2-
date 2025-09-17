# ContractAI - Full-Stack SaaS Contract Management Prototype

A comprehensive contract management system with AI-powered analysis, built with React, FastAPI, and PostgreSQL + pgvector. This prototype demonstrates modern SaaS architecture with multi-tenant isolation, natural language querying, and business-ready analytics.

## 🚀 Live Demo

- **Frontend**: [Deployed on vercel](https://contractsense-dashboard2.vercel.app/)
- **Backend**: [Deployed on Render](https://contractsense-dashboard2.onrender.com)

### Demo Credentials
- **Email**: `demo@contract.ai`
- **Password**: `demo123`

## ✨ Features

### Authentication & Multi-Tenancy
- JWT-based authentication with secure password hashing
- Multi-user isolation (all operations scoped by user_id)
- Secure session management with cookie-based tokens

### File Upload & Processing
- Drag-and-drop interface for PDF/TXT/DOCX files
- Mock LlamaCloud integration for document parsing
- Real-time progress tracking with detailed processing steps
- Error handling and retry mechanisms

### Database & Vector Search
- PostgreSQL with pgvector extension for semantic search
- Proper multi-tenant data isolation
- Efficient chunk storage with embeddings and metadata
- ER diagram included (`/docs/ER-diagram.png`)

### Contracts Dashboard
- Professional SaaS-style interface with sidebar navigation
- Advanced filtering by status, risk level, and search
- Pagination with configurable page sizes
- Color-coded status and risk indicators
- Empty states, loading states, and error handling

### Contract Details & Analysis
- Comprehensive contract metadata display
- Tabbed interface for Clauses, AI Insights, and Evidence
- Confidence scoring for extracted clauses
- AI-generated risk assessments and recommendations
- Evidence snippets with relevance scoring

### AI Query Interface (RAG Workflow)
- Natural language query processing
- Vector similarity search with user isolation
- Contextual AI responses with supporting evidence
- Query history and recent queries functionality
- Relevance scoring and source attribution

### Analytics & Reporting
- Interactive charts and visualizations (Recharts)
- Contract portfolio analytics and trends
- Risk distribution analysis
- Expiration tracking and renewal planning
- Export capabilities for data analysis

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation  
- **Heroicons** for consistent iconography
- **Recharts** for data visualization
- **React Dropzone** for file uploads

### Backend (Structure Provided)
- **FastAPI** with Python 3.9+
- **PostgreSQL** with pgvector extension
- **JWT** authentication
- **bcrypt** for password hashing
- **SQLAlchemy** ORM

### Database Schema

```sql
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
    user_id UUID REFERENCES users(user_id),
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
    doc_id UUID REFERENCES documents(doc_id),
    user_id UUID REFERENCES users(user_id),
    text_chunk TEXT NOT NULL,
    embedding vector(1536), -- OpenAI embedding dimensions
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enable vector similarity search
CREATE INDEX ON chunks USING ivfflat (embedding vector_cosine_ops);
```

## 🏗 Project Structure

```
contract-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── contracts/
│   │   ├── database/
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── docs/
│   └── ER-diagram.png
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL with pgvector extension
- Docker (optional)

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://user:pass@localhost:5432/contractai"
export SECRET_KEY="your-secret-key"
export OPENAI_API_KEY="your-openai-key"

# Run migrations
python -m app.database.init_db

# Start server
uvicorn app.main:app --reload
```

### Database Setup

```bash
# Install PostgreSQL and pgvector
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE EXTENSION vector;"

# Create database
createdb contractai

# Run migrations (handled by backend startup)
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `POST /auth/logout` - Session termination

### Contracts
- `GET /contracts` - List user's contracts (paginated, filtered)
- `GET /contracts/{id}` - Get contract details
- `POST /upload` - Upload and process contract
- `DELETE /contracts/{id}` - Delete contract

### AI Query
- `POST /ask` - Natural language contract query
- `GET /ask/history` - Query history for user

### Analytics
- `GET /analytics/summary` - Portfolio summary statistics
- `GET /analytics/risks` - Risk analysis data
- `GET /analytics/expiring` - Upcoming expirations

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Teal (#14B8A6) 
- **Accent**: Orange (#F97316)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Headings**: 120% line height, bold weights
- **Body**: 150% line height, regular weight
- **UI Elements**: Consistent sizing with 8px grid system

### Components
- Responsive design with mobile-first approach
- Consistent hover states and micro-interactions
- Loading states and error handling
- Empty states with clear calls-to-action

## 📊 Mock Data Integration

The system includes comprehensive mock data for demonstration:

### LlamaCloud Response Simulation
```json
{
  "document_id": "doc123",
  "chunks": [
    {
      "chunk_id": "c1", 
      "text": "Termination clause: Either party may terminate with 90 days' notice.",
      "embedding": [0.12, -0.45, 0.91, 0.33],
      "metadata": { "page": 2, "contract_name": "MSA.pdf" }
    }
  ]
}
```

### Contract Portfolio Data
- 24+ sample contracts with realistic metadata
- Risk assessments and status tracking
- Expiration dates and renewal scheduling
- Multi-party contract relationships

## 🔒 Security Features

- JWT token-based authentication
- Secure password hashing with bcrypt
- Multi-tenant data isolation
- CORS configuration
- Input validation and sanitization
- Rate limiting on API endpoints

## 📈 Performance Optimizations

- Vector database indexing for fast similarity search
- Pagination for large datasets  
- Lazy loading of components
- Optimized bundle sizes
- CDN asset delivery
- Database connection pooling

## 🚀 Deployment

### Frontend (Netlify)
```bash
# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Backend (Render/Heroku)
```bash
# Using Docker
docker build -t contract-ai-backend .
docker push your-registry/contract-ai-backend

# Or direct deployment
git push render main
```

### Database (Supabase/Railway)
- Automated migrations on deployment
- Environment variable configuration
- Connection pooling and scaling

## 🧪 Testing

### Frontend Tests
```bash
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
npm run lint        # Code linting
```

### Backend Tests  
```bash
pytest              # API tests
pytest --cov       # Coverage reporting
```

## 📝 Future Enhancements

- Real LlamaCloud integration
- Advanced ML model training
- Webhook integrations
- Mobile application
- Advanced analytics dashboard
- Multi-language support
- Audit logging and compliance features

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for recruiter evaluation and demonstration
- Showcases modern full-stack development practices
- Implements industry-standard SaaS architecture patterns
- Demonstrates AI/ML integration capabilities

---

**Note**: This is a prototype system designed for evaluation purposes. For production use, implement proper security audits, load testing, and monitoring systems.
