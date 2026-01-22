# Step 6: Testing & Running the Application

## 6.1 Prerequisites Checklist

Before running the application, ensure you have:

- [x] Next.js project initialized
- [x] All dependencies installed
- [x] `.env.local` file created with API keys
- [ ] Supabase database configured (run the SQL from Step 2)

---

## 6.2 Running the SQL Setup

**IMPORTANT:** You must run the SQL commands in Supabase before the app will work!

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Copy the SQL from `docs/02-database-setup.md`
5. Paste and click **Run**
6. Verify the `documents` table was created

---

## 6.3 Starting the Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

---

## 6.4 Testing the RAG Flow

### Test 1: Upload a Document
1. Prepare a PDF file (any document with text)
2. Click or drag the PDF into the upload area
3. Click "Upload to Knowledge Base"
4. Wait for success message showing number of chunks processed

**Expected Result:** 
- Success message appears
- You see "Successfully processed X chunks from [filename]"

---

### Test 2: Ask Questions
1. Scroll to the chat interface
2. Type a question related to your uploaded document
3. Press Enter or click Send
4. Wait for AI response

**Example Questions:**
- "What is this document about?"
- "Summarize the main points"
- "What does it say about [specific topic]?"

**Expected Result:**
- AI responds with information from your document
- If the document doesn't contain relevant info, AI says "I don't have enough information"

---

### Test 3: Multiple Documents
1. Upload 2-3 different PDFs
2. Ask questions that span multiple documents
3. Verify AI can pull information from all sources

---

## 6.5 Troubleshooting

### Error: "Failed to process document"
- **Check:** Is the SQL schema set up in Supabase?
- **Check:** Are your Supabase credentials correct in `.env.local`?
- **Check:** Is the file a valid PDF?

### Error: "Failed to generate answer"
- **Check:** Is your Groq API key valid?
- **Check:** Have you uploaded any documents yet?
- **Check:** Browser console for detailed errors (F12)

### Error: Embedding/Vector Store Issues
- **Check:** Is your Google Gemini API key valid?
- **Check:** Did you enable the `vector` extension in Supabase?
- **Check:** Does the `match_documents` function exist?

---

## 6.6 Verifying the Database

To check if documents were stored:

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select `documents` table
4. You should see rows with:
   - `content`: Text chunks
   - `metadata`: File info
   - `embedding`: Vector arrays

---

## 6.7 Performance Notes

**Expected Performance:**
- **Upload:** 5-10 seconds for a 10-page PDF
- **Query Response:** 1-3 seconds (thanks to Groq!)
- **Embedding Generation:** ~100ms per chunk (Gemini)

**Why is it fast?**
- Groq provides ultra-fast LLM inference
- Supabase pgvector has optimized vector search
- Parallel processing for embeddings

---
*Congratulations! Your AI-Powered Knowledge Base is ready! 🎉*
