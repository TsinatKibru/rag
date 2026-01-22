import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { embeddings } from "./embeddings";

/**
 * Initialize Supabase Client
 * 
 * This connects to your Supabase database where document embeddings are stored.
 */
const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Initialize Supabase Vector Store
 * 
 * This is the bridge between LangChain and your Supabase database.
 * It handles:
 * - Storing document embeddings
 * - Performing similarity searches
 * - Managing document metadata
 * 
 * @returns SupabaseVectorStore instance
 */
export const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: "documents",
    queryName: "match_documents",
});

export { supabaseClient };
