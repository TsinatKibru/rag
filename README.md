# AI-Powered Knowledge Base (RAG)

A modern, high-performance RAG (Retrieval-Augmented Generation) application built with Next.js, LangChain, and cutting-edge AI services.

## 🚀 Features

- **Lightning-Fast Inference**: Powered by Groq's Llama 3 for ultra-fast responses
- **Semantic Search**: Google Gemini embeddings for accurate document retrieval
- **Scalable Storage**: Supabase with pgvector for efficient vector operations
- **Modern UI**: Beautiful, responsive interface with dark mode
- **PDF Support**: Upload and process PDF documents automatically

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **AI Orchestration**: LangChain.js
- **LLM**: Groq (Llama 3.3 70B)
- **Embeddings**: Google Gemini (text-embedding-004)
- **Vector Database**: Supabase (PostgreSQL + pgvector)
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- Groq API key
- Google Gemini API key

## 🔧 Setup

### 1. Clone and Install

```bash
cd ai-rag-knowledge-base
npm install
```

### 2. Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### 3. Database Setup

Run the SQL commands in `docs/02-database-setup.md` in your Supabase SQL Editor to:
- Enable pgvector extension
- Create documents table
- Create similarity search function

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

Detailed step-by-step guides are available in the `docs/` folder:

1. [01-initialization.md](docs/01-initialization.md) - Project setup
2. [02-database-setup.md](docs/02-database-setup.md) - Supabase configuration
3. [03-core-ai-logic.md](docs/03-core-ai-logic.md) - AI implementation
4. [04-api-routes.md](docs/04-api-routes.md) - Backend API
5. [05-frontend-ui.md](docs/05-frontend-ui.md) - UI components
6. [06-testing-and-running.md](docs/06-testing-and-running.md) - Testing guide

## 🎯 How It Works

### RAG Pipeline

1. **Document Upload**
   - User uploads PDF
   - Document is split into chunks
   - Each chunk is converted to embeddings (Gemini)
   - Embeddings stored in Supabase

2. **Query Processing**
   - User asks a question
   - Question is converted to embedding
   - Similar document chunks are retrieved
   - Context + question sent to Groq (Llama 3)
   - AI generates answer based on retrieved context

### Architecture

```
User Question
    ↓
Gemini Embeddings
    ↓
Supabase Vector Search
    ↓
Retrieve Top 4 Chunks
    ↓
Groq (Llama 3) Generation
    ↓
AI Answer
```

## 🧪 Testing

1. Upload a PDF document
2. Wait for processing confirmation
3. Ask questions about the document
4. Receive AI-generated answers

## 🚨 Troubleshooting

See [docs/06-testing-and-running.md](docs/06-testing-and-running.md) for detailed troubleshooting steps.

## 📝 License

MIT

## 🙏 Acknowledgments

- Groq for ultra-fast LLM inference
- Google for Gemini embeddings
- Supabase for vector database
- LangChain for AI orchestration
