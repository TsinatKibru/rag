import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/lib/ai/vectorstore";

/**
 * GET /api/documents
 * 
 * Lists all unique documents in the knowledge base.
 */
export async function GET() {
    try {
        // Fetch all metadata to find unique sources
        // Note: In a production app with thousands of docs, you'd want a SQL view or RPC function for this
        const { data: documents, error } = await supabaseClient
            .from("documents")
            .select("metadata");

        if (error) throw error;

        // Aggregate unique documents
        const fileStats = new Map<string, { count: number; uploadedAt: string }>();

        documents?.forEach((doc) => {
            const source = doc.metadata?.source;
            const uploadedAt = doc.metadata?.uploadedAt;

            if (source) {
                const existing = fileStats.get(source) || { count: 0, uploadedAt: uploadedAt || "" };
                fileStats.set(source, {
                    count: existing.count + 1,
                    uploadedAt: existing.uploadedAt || uploadedAt || "" // Keep the first timestamp found
                });
            }
        });

        const result = Array.from(fileStats.entries()).map(([source, stats]) => ({
            source,
            chunkCount: stats.count,
            uploadedAt: stats.uploadedAt
        }));

        return NextResponse.json({
            success: true,
            documents: result
        });

    } catch (error) {
        console.error("Fetch documents error:", error);
        return NextResponse.json(
            { error: "Failed to fetch documents" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/documents
 * 
 * Deletes a document (all its chunks) by source filename.
 */
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const source = searchParams.get("source");

        if (!source) {
            return NextResponse.json(
                { error: "Source filename is required" },
                { status: 400 }
            );
        }

        // Delete all chunks with this source
        // Note: This relies on metadata->>source syntax for JSONB filtering in PostgREST
        const { error } = await supabaseClient
            .from("documents")
            .delete()
            .filter("metadata->>source", "eq", source);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: `Deleted document: ${source}`
        });

    } catch (error) {
        console.error("Delete document error:", error);
        return NextResponse.json(
            { error: "Failed to delete document" },
            { status: 500 }
        );
    }
}
