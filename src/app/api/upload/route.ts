import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "@/lib/ai/vectorstore";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";

/**
 * POST /api/upload
 * 
 * Handles document upload and ingestion into the knowledge base.
 * 
 * Process:
 * 1. Receive PDF file from client
 * 2. Save temporarily to disk
 * 3. Load and parse PDF
 * 4. Split into chunks
 * 5. Generate embeddings
 * 6. Store in Supabase
 * 7. Clean up temp file
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: "Only PDF files are supported" },
                { status: 400 }
            );
        }

        // Save file temporarily
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const tempPath = join("/tmp", `upload-${Date.now()}.pdf`);
        await writeFile(tempPath, buffer);

        try {
            // Load PDF
            const loader = new PDFLoader(tempPath);
            const docs = await loader.load();

            // Split into chunks
            // Why? Large documents need to be broken into smaller pieces
            // for more precise retrieval and to fit in context windows
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000, // Characters per chunk
                chunkOverlap: 200, // Overlap to maintain context between chunks
            });

            const splitDocs = await textSplitter.splitDocuments(docs);

            // Add metadata
            const docsWithMetadata = splitDocs.map((doc) => ({
                ...doc,
                metadata: {
                    ...doc.metadata,
                    source: file.name,
                    uploadedAt: new Date().toISOString(),
                },
            }));

            // Store in vector database
            // This will:
            // 1. Generate embeddings for each chunk
            // 2. Insert into Supabase
            await vectorStore.addDocuments(docsWithMetadata);

            return NextResponse.json({
                success: true,
                message: `Successfully processed ${splitDocs.length} chunks from ${file.name}`,
                chunks: splitDocs.length,
            });
        } finally {
            // Clean up temp file
            await unlink(tempPath);
        }
    } catch (error) {
        console.error("Upload error:", error);
        console.error("Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : undefined
        });
        return NextResponse.json(
            { error: "Failed to process document" },
            { status: 500 }
        );
    }
}
