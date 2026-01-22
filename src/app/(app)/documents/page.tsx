"use client";

import { useEffect, useState } from "react";
import { Trash2, FileText, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import DocumentUpload from "@/components/DocumentUpload";
import { toast } from "sonner";

interface Doc {
    source: string;
    chunkCount: number;
    uploadedAt: string;
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Doc[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await fetch("/api/documents");
            const data = await res.json();
            if (data.success) {
                setDocuments(data.documents);
            }
        } catch (error) {
            console.error("Failed to load documents", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ... (existing code omitted)

    const handleDelete = async (source: string) => {
        // Confirmation Toast
        toast("Are you sure?", {
            description: `This will permanently delete "${source}"`,
            action: {
                label: "Delete",
                onClick: async () => {
                    setDeleting(source);
                    try {
                        const res = await fetch(`/api/documents?source=${encodeURIComponent(source)}`, {
                            method: "DELETE",
                        });

                        if (res.ok) {
                            setDocuments((prev) => prev.filter((d) => d.source !== source));
                            toast.success("Document deleted successfully");
                        } else {
                            toast.error("Failed to delete document");
                        }
                    } catch (error) {
                        console.error("Delete error", error);
                        toast.error("Error deleting document");
                    } finally {
                        setDeleting(null);
                    }
                },
            },
            cancel: {
                label: "Cancel",
                onClick: () => { },
            },
        });
    };

    // Callback to refresh list after upload
    // In a real app, DocumentUpload would accept an onUploadSuccess prop
    // For now we will rely on manual refresh or simple state update if we refactor DocumentUpload
    // But better yet, let's wrap logic:

    // NOTE: DocumentUpload in its current state doesn't have a callback.
    // Ideally we update it, but for now user just wants the location change.
    // I will add a text suggesting refresh or we just leave it as is for mvp.
    // Actually, I should update DocumentUpload to accept a callback? 
    // Let's stick to the request: "move the document upload". 

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-20">
            <header className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                    <FileText className="text-blue-500" />
                    Knowledge Base
                </h1>
                <span className="text-zinc-500 text-sm">
                    {documents.length} document{documents.length !== 1 ? "s" : ""}
                </span>
            </header>

            {/* Upload Section */}
            <section className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-xl">
                <h2 className="text-lg font-semibold mb-4 text-zinc-100 flex items-center gap-2">
                    <Upload className="w-5 h-5" /> Upload New Document
                </h2>
                <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                    <DocumentUpload />
                </div>
            </section>

            {/* List Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-zinc-100">Stored Documents</h2>
                    <button
                        onClick={fetchDocuments}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Refresh List
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
                    </div>
                ) : documents.length === 0 ? (
                    <div className="text-center p-12 bg-zinc-900/50 rounded-xl border border-zinc-800 border-dashed">
                        <p className="text-zinc-500">No documents uploaded yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {documents.map((doc) => (
                            <div
                                key={doc.source}
                                className="group flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-zinc-100">{doc.source}</h3>
                                        <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1">
                                            <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{doc.chunkCount} chunks</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(doc.source)}
                                    disabled={deleting === doc.source}
                                    className={cn(
                                        "p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors",
                                        deleting === doc.source && "opacity-50 cursor-not-allowed"
                                    )}
                                    title="Delete document"
                                >
                                    {deleting === doc.source ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
