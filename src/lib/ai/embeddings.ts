import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

/**
 * Initialize Google Gemini Embeddings
 * 
 * This creates embeddings (vector representations) of text using Google's Gemini model.
 * Embeddings are 768-dimensional vectors that capture semantic meaning.
 * 
 * @returns GoogleGenerativeAIEmbeddings instance
 */
export const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_GENAI_API_KEY!,
    modelName: "text-embedding-004", // Latest Gemini embedding model
});
