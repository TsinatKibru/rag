import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "@langchain/community/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "@/lib/ai/vectorstore";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";

/**
 * POST /api/upload
 * 
 * Handles document upload and ingestion into the knowledge base.
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
        const validTypes = ["application/pdf", "text/plain", "text/markdown"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Only PDF, TXT, and MD files are supported" },
                { status: 400 }
            );
        }

        // Save file temporarily
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Use original extension for loader detection if needed, or generic
        const extension = file.name.split('.').pop();
        const tempPath = join("/tmp", `upload-${Date.now()}.${extension}`);
        await writeFile(tempPath, buffer);

        try {
            // Select Loader based on file type
            let loader;
            if (file.type === "application/pdf") {
                loader = new PDFLoader(tempPath);
            } else {
                // TextLoader handles both .txt and .md well as plain text
                loader = new TextLoader(tempPath);
            }

            const docs = await loader.load();

            // Split into chunks
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
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
        return NextResponse.json(
            { error: "Failed to process document" },
            { status: 500 }
        );
    }
}
