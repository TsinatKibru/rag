import { NextRequest, NextResponse } from "next/server";
import { askQuestion } from "@/lib/ai/rag-chain";

/**
 * POST /api/chat
 * 
 * Handles user questions and returns AI-generated answers.
 * 
 * Process:
 * 1. Receive question from client
 * 2. Search vector store for relevant documents
 * 3. Generate answer using Groq (Llama 3)
 * 4. Return answer to client
 */
export async function POST(request: NextRequest) {
    try {
        const { question } = await request.json();

        if (!question || typeof question !== "string") {
            return NextResponse.json(
                { error: "Question is required" },
                { status: 400 }
            );
        }

        // Ask the RAG chain
        const answer = await askQuestion(question);

        return NextResponse.json({
            success: true,
            answer,
        });
    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json(
            { error: "Failed to generate answer" },
            { status: 500 }
        );
    }
}
