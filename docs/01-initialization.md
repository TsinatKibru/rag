# Step 1: Project Initialization

Successfully initialized the Next.js environment for our RAG application.

## 1.1 Next.js Setup
- Framework: Next.js 14+ (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Directory Structure: `src/` directory used for cleaner code organization.

## 1.2 Core Dependencies Installed
- `langchain`: Orchestration framework for LLMs.
- `@langchain/groq`: Integration for high-speed Llama 3 inference.
- `@langchain/google-genai`: Integration for Gemini vector embeddings.
- `@supabase/supabase-js`: Client for our Vector Database.
- `pdf-parse`: For processing uploaded PDF documents (plus built-in support for TXT and MD).
- `lucide-react`: For modern UI icons.

## 1.3 Environment Configuration
The `.env.local` file has been configured with the following providers:
- **Supabase**: URL and Anon Key for database access.
- **Groq**: API Key for Llama 3 models.
- **Google Gemini**: API Key for generating embeddings.

---
*Next Step: Database Schema Setup in Supabase.*
