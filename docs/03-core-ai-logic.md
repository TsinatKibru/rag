# Step 3: Core AI Logic Implementation

This step implements the three core components of our RAG system.

## 3.0 Core Libraries

This project relies on two major libraries to handle the complexity of AI and document processing:

### LangChain (`langchain`)
[LangChain](https://js.langchain.com/) is our orchestration framework. It acts as the "glue" connecting different AI components.
-   **Document Loaders**: We use `PDFLoader` to read binary PDF files.
-   **Text Splitters**: `RecursiveCharacterTextSplitter` intelligently breaks text into semantic chunks.
-   **Vector Stores**: Provides a standard interface for Supabase (and other DBs).
-   **Chains**: Manages the flow of data (User Input → Retrieval → Prompt → LLM → Output).

### PDF Parsing (`pdf-parse`)
While we use LangChain's `PDFLoader`, under the hood it often relies on libraries like `pdf-parse` (or standard Web PDF APIs) to extract raw text from PDF binaries.
-   **Input**: Binary buffer of a `.pdf` file.
-   **Process**: Scans the file structure, handling font maps and content streams.
-   **Output**: Pure text strings (metadata like page numbers are also extracted).
-   *Note: This is critical because LLMs cannot "read" a PDF file directly; they need plain text.*

---

## 3.1 Embeddings (`src/lib/ai/embeddings.ts`)

**What are embeddings?**
Embeddings convert text into numerical vectors (arrays of numbers) that capture semantic meaning. Similar texts have similar vectors.

**Our Implementation:**
- Uses Google Gemini's `text-embedding-004` model
- Generates 768-dimensional vectors
- Free tier: 1,500 requests/day

**Example:**
```
"What is AI?" → [0.23, -0.45, 0.67, ..., 0.12] (768 numbers)
"Explain AI"  → [0.21, -0.43, 0.65, ..., 0.14] (very similar!)
```

---

## 3.2 Vector Store (`src/lib/ai/vectorstore.ts`)

**What is a vector store?**
A specialized database that can:
1. Store embeddings efficiently
2. Find similar vectors quickly (semantic search)

**Our Implementation:**
- Connects to Supabase using the client credentials
- Uses the `documents` table we created
- Calls the `match_documents` function for searches

**How it works:**
When you search for "What is machine learning?":
1. Your question is converted to a vector
2. The database finds documents with similar vectors
3. Returns the most relevant chunks

---

## 3.3 RAG Chain (`src/lib/ai/rag-chain.ts`)

**What is RAG?**
RAG = Retrieval-Augmented Generation. It's a 3-step process:

### Step 1: Retrieval
Search the vector store for relevant documents.
- We retrieve the top 4 most similar chunks
- Uses cosine similarity to measure relevance

### Step 2: Augmentation
Combine retrieved context with the user's question.
- Formats documents into a readable context
- Injects into a prompt template

### Step 3: Generation
Send to Groq (Llama 3) to generate an answer.
- Model: `llama-3.3-70b-versatile`
- Temperature: 0.3 (focused, factual responses)
- Groq provides ultra-fast inference (~500 tokens/second!)

**Complete Flow:**
```
User Question
    ↓
Convert to embedding (Gemini)
    ↓
Search vector store (Supabase)
    ↓
Retrieve top 4 documents
    ↓
Format as context
    ↓
Send to Llama 3 (Groq)
    ↓
Get AI-generated answer
```

---
*Next Step: Building the API Routes for document upload and chat.*
