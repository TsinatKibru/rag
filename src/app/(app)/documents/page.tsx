"use client";

import { useEffect, useState } from "react";
import { Trash2, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

    const handleDelete = async (source: string) => {
        if (!confirm(`Are you sure you want to delete "${source}"?`)) return;

        setDeleting(source);
        try {
            const res = await fetch(`/api/documents?source=${encodeURIComponent(source)}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setDocuments((prev) => prev.filter((d) => d.source !== source));
            } else {
                alert("Failed to delete document");
            }
        } catch (error) {
            console.error("Delete error", error);
            alert("Error deleting document");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <header className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                    <FileText className="text-blue-500" />
                    Knowledge Base
                </h1>
                <span className="text-zinc-500 text-sm">
                    {documents.length} document{documents.length !== 1 ? "s" : ""}
                </span>
            </header>

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
        </div>
    );
}
