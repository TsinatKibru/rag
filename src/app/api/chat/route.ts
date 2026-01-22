import { NextRequest, NextResponse } from "next/server";
import { askQuestion } from "@/lib/ai/rag-chain";
import { supabaseClient } from "@/lib/ai/vectorstore";

/**
 * POST /api/chat
 */
export async function POST(request: NextRequest) {
    try {
        const { question, chatId } = await request.json();

        if (!question || typeof question !== "string") {
            return NextResponse.json(
                { error: "Question is required" },
                { status: 400 }
            );
        }

        let currentChatId = chatId;

        // 1. Create a new chat if no chatId provided
        if (!currentChatId) {
            const title = question.substring(0, 50) + (question.length > 50 ? "..." : "");
            const { data: chatData, error: chatError } = await supabaseClient
                .from("chats")
                .insert({ title })
                .select("id")
                .single();

            if (chatError) throw chatError;
            currentChatId = chatData.id;
        }

        // 2. Save User Message
        await supabaseClient.from("messages").insert({
            chat_id: currentChatId,
            role: "user",
            content: question
        });

        // 3. Ask RAG Chain
        const answer = await askQuestion(question);

        // 4. Save Assistant Message
        await supabaseClient.from("messages").insert({
            chat_id: currentChatId,
            role: "assistant",
            content: answer
        });

        return NextResponse.json({
            success: true,
            answer,
            chatId: currentChatId
        });
    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json(
            { error: "Failed to generate answer" },
            { status: 500 }
        );
    }
}
