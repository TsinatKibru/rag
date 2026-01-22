import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/lib/ai/vectorstore";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { data: messages, error } = await supabaseClient
            .from("messages")
            .select("*")
            .eq("chat_id", id)
            .order("created_at", { ascending: true });

        if (error) throw error;

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}
