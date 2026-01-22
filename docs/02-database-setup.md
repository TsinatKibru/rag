# Step 2: Database Setup (Supabase)

We are using Supabase with the `pgvector` extension to store and search document embeddings.

## 2.1 Database Schema
We need a table to store our knowledge base documents.

### SQL to run in Supabase SQL Editor:
```sql
-- Enable the pgvector extension to work with embeddings
create extension if not exists vector;

-- Create a table to store your documents
create table documents (
  id bigserial primary key,
  content text, -- corresponds to Document.pageContent
  metadata jsonb, -- corresponds to Document.metadata
  embedding vector(768) -- 768 is the dimension for Gemini embeddings
);

-- Create a function for similarity search
-- Create a function for similarity search
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float default 0.0,
  match_count int default 10,
  filter jsonb default '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  and metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

## 2.2 SQL Explanation

### Extension Setup
- **`create extension if not exists vector`**: Enables PostgreSQL's `pgvector` extension, which allows us to store and search vector embeddings efficiently.

### Documents Table
- **`id bigserial primary key`**: Auto-incrementing unique identifier for each document.
- **`content text`**: The actual text content of the document chunk.
- **`metadata jsonb`**: Flexible JSON field to store additional information (e.g., source file name, page number, timestamp).
- **`embedding vector(768)`**: Stores the 768-dimensional vector representation of the content. This dimension matches Google Gemini's embedding model output.

### Similarity Search Function
The `match_documents` function performs semantic search:

**Parameters:**
- `query_embedding`: The vector representation of the user's question.
- `match_threshold`: Minimum similarity score (0-1) to return results.
- `match_count`: Maximum number of results to return.

**How it works:**
- **`<=>` operator**: Calculates cosine distance between vectors (lower = more similar).
- **`1 - distance`**: Converts distance to similarity score (higher = more similar).
- **Filtering**: Only returns documents above the similarity threshold.
- **Ordering**: Sorts by most similar first.

This function enables fast semantic search across thousands of documents!

---
*Next Step: Implementing the AI Logic (Embeddings & Chains).*
