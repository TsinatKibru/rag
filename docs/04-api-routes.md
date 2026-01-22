# Step 4: API Routes

API routes handle communication between the frontend and our AI backend.

## 4.1 Upload Route (`/api/upload`)

**Purpose:** Process and store documents in the knowledge base.

**Flow:**
```
User uploads PDF
    ↓
Save to /tmp temporarily
    ↓
PDFLoader extracts text
    ↓
RecursiveCharacterTextSplitter breaks into chunks
    ↓
Each chunk → Gemini → embedding
    ↓
Store in Supabase
    ↓
Delete temp file
```

**Why split documents?**
1. **Better retrieval**: Smaller chunks = more precise matches
2. **Context limits**: LLMs have token limits
3. **Efficiency**: Only send relevant chunks, not entire documents

**Chunk settings:**
- `chunkSize: 1000`: Each chunk is ~1000 characters
- `chunkOverlap: 200`: 200 characters overlap between chunks to maintain context

**Example:**
A 10-page PDF might become 50 chunks, each stored separately with its own embedding.

---

## 4.2 Chat Route (`/api/chat`)

**Purpose:** Answer user questions using the knowledge base.

**Flow:**
```
User asks question
    ↓
Question → Gemini → embedding
    ↓
Search Supabase for similar embeddings
    ↓
Retrieve top 4 chunks
    ↓
Format as context
    ↓
Send to Groq (Llama 3)
    ↓
Return AI answer
```

**Simple interface:**
- Input: `{ question: "What is...?" }`
- Output: `{ answer: "Based on the documents..." }`

---
---

## 4.3 Document Management Routes

### List Documents (`GET /api/documents`)
**Purpose:** Fetch a list of all unique documents currently stored in the vector database.
- **Output:** JSON array of documents with `source` filename, `chunkCount`, and `uploadedAt`.

### Delete Document (`DELETE /api/documents`)
**Purpose:** Permanently remove a document and all its associated chunks.
- **Input:** Query parameter `?source=filename.pdf`
- **Behavior:** Executes a SQL delete where `metadata->>'source'` matches the filename.

---
*Next Step: Building the Frontend UI.*
