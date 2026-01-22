import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/ai/vectorstore";

export async function GET() {
    try {
        const { data: chats, error } = await supabaseClient
            .from("chats")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ chats });
    } catch (error) {
        console.error("Error fetching chats:", error);
        return NextResponse.json(
            { error: "Failed to fetch chat history" },
            { status: 500 }
        );
    }
}
