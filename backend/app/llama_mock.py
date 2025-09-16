import random
import json
from typing import List, Dict, Any

def mock_llama_parse(filename: str, content: bytes) -> Dict[str, Any]:
    """
    Mock LlamaCloud parsing response
    Simulates document parsing and returns chunks with embeddings
    """
    
    # Simulate different contract types based on filename
    contract_clauses = {
        "msa": [
            "Either party may terminate this agreement with ninety (90) days written notice to the other party.",
            "In no event shall either party be liable for any indirect, incidental, special, or consequential damages.",
            "Payment shall be made within thirty (30) days of receipt of invoice.",
            "Each party retains ownership of their respective intellectual property rights."
        ],
        "nda": [
            "Confidential information shall not be disclosed to any third party without prior written consent.",
            "The obligations of confidentiality shall survive termination of this agreement for a period of five (5) years.",
            "Receiving party shall use the same degree of care to protect confidential information as with its own confidential information."
        ],
        "license": [
            "Licensor grants licensee a non-exclusive, non-transferable license to use the software.",
            "License fees are due within thirty (30) days of the invoice date.",
            "This license shall terminate automatically upon breach of any terms herein."
        ]
    }
    
    # Determine contract type from filename
    filename_lower = filename.lower()
    if "msa" in filename_lower or "service" in filename_lower:
        clauses = contract_clauses["msa"]
        contract_type = "MSA"
    elif "nda" in filename_lower or "confidential" in filename_lower:
        clauses = contract_clauses["nda"] 
        contract_type = "NDA"
    elif "license" in filename_lower:
        clauses = contract_clauses["license"]
        contract_type = "License"
    else:
        clauses = random.choice(list(contract_clauses.values()))
        contract_type = "Generic"
    
    # Generate mock chunks
    chunks = []
    for i, clause in enumerate(clauses):
        # Generate mock embedding (1536 dimensions for OpenAI)
        embedding = [random.uniform(-1, 1) for _ in range(1536)]
        
        chunk = {
            "chunk_id": f"c{i+1}",
            "text": clause,
            "embedding": embedding,
            "metadata": {
                "page": i + 1,
                "contract_name": filename,
                "contract_type": contract_type,
                "clause_type": get_clause_type(clause),
                "confidence": round(random.uniform(85, 98), 1)
            }
        }
        chunks.append(chunk)
    
    # Add some additional mock chunks for variety
    additional_clauses = [
        "Force majeure events shall excuse performance delays beyond reasonable control.",
        "Any amendments to this agreement must be in writing and signed by both parties.",
        "This agreement shall be governed by the laws of the state of incorporation.",
        "Disputes shall be resolved through binding arbitration in accordance with commercial rules."
    ]
    
    for i, clause in enumerate(additional_clauses[:random.randint(1, 3)]):
        embedding = [random.uniform(-1, 1) for _ in range(1536)]
        chunk = {
            "chunk_id": f"c{len(chunks)+i+1}",
            "text": clause,
            "embedding": embedding,
            "metadata": {
                "page": len(chunks) + i + 2,
                "contract_name": filename,
                "contract_type": contract_type,
                "clause_type": get_clause_type(clause),
                "confidence": round(random.uniform(80, 95), 1)
            }
        }
        chunks.append(chunk)
    
    return {
        "document_id": f"doc_{random.randint(1000, 9999)}",
        "filename": filename,
        "contract_type": contract_type,
        "page_count": len(chunks) + random.randint(1, 3),
        "chunks": chunks,
        "processing_time": round(random.uniform(2.5, 8.5), 2),
        "confidence_score": round(random.uniform(88, 97), 1)
    }

def get_clause_type(clause_text: str) -> str:
    """Determine clause type from text content"""
    clause_lower = clause_text.lower()
    
    if "terminate" in clause_lower or "termination" in clause_lower:
        return "Termination"
    elif "liable" in clause_lower or "liability" in clause_lower:
        return "Liability"
    elif "payment" in clause_lower or "invoice" in clause_lower:
        return "Payment"
    elif "intellectual property" in clause_lower or "ip" in clause_lower:
        return "Intellectual Property"
    elif "confidential" in clause_lower:
        return "Confidentiality" 
    elif "license" in clause_lower:
        return "Licensing"
    elif "force majeure" in clause_lower:
        return "Force Majeure"
    elif "amendment" in clause_lower:
        return "Amendment"
    elif "governing" in clause_lower or "jurisdiction" in clause_lower:
        return "Governing Law"
    elif "dispute" in clause_lower or "arbitration" in clause_lower:
        return "Dispute Resolution"
    else:
        return "General"