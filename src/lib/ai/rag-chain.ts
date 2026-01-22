import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { vectorStore } from "./vectorstore";
import {
    RunnablePassthrough,
    RunnableSequence,
} from "@langchain/core/runnables";

/**
 * Initialize Groq LLM (Llama 3)
 * 
 * Groq provides ultra-fast inference for Llama 3 models.
 * This is the "brain" that generates answers based on retrieved context.
 */
const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY!,
    model: "llama-3.3-70b-versatile", // Fast and powerful
    temperature: 0.3, // Lower = more focused, higher = more creative
});

/**
 * RAG Prompt Template
 * 
 * This template structures how the AI uses retrieved context to answer questions.
 * It instructs the model to:
 * 1. Use only the provided context
 * 2. Admit when it doesn't know
 * 3. Be concise and accurate
 */
const promptTemplate = ChatPromptTemplate.fromTemplate(`
You are a helpful AI assistant with access to a knowledge base. 
Answer the question based ONLY on the following context. 
If the context doesn't contain relevant information, say "I don't have enough information to answer that question."

Context:
{context}

Question: {question}

Answer:
`);

/**
 * Format retrieved documents into a single context string
 */
const formatDocs = (docs: any[]) => {
    return docs.map((doc) => doc.pageContent).join("\n\n");
};

/**
 * RAG Chain
 * 
 * This is the complete RAG pipeline:
 * 1. Retrieve: Search for relevant documents using vector similarity
 * 2. Augment: Format retrieved docs and combine with user question
 * 3. Generate: Use Groq (Llama 3) to generate an answer
 * 
 * @param question - User's question
 * @returns AI-generated answer based on knowledge base
 */
export const ragChain = RunnableSequence.from([
    {
        context: async (input: { question: string }) => {
            // Retrieve top 4 most relevant documents
            const retriever = vectorStore.asRetriever({
                k: 4, // Number of documents to retrieve
            });
            const docs = await retriever.invoke(input.question);
            return formatDocs(docs);
        },
        question: new RunnablePassthrough(),
    },
    promptTemplate,
    llm,
    new StringOutputParser(),
]);

/**
 * Simple wrapper function for asking questions
 */
export async function askQuestion(question: string): Promise<string> {
    const answer = await ragChain.invoke({ question });
    return answer;
}
