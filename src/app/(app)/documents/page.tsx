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
        <div className="flex flex-col gap-10 max-w-4xl mx-auto w-full pb-20 pt-6 px-4 md:px-8">
            <header className="flex items-center justify-between pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <FileText className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Documents</h1>
                        <p className="text-muted-foreground/60 text-xs font-medium mt-0.5">
                            {documents.length} files in your library
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchDocuments}
                    className="p-2.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-all border border-transparent"
                >
                    <Loader2 className={cn("w-5 h-5", isLoading && "animate-spin")} />
                </button>
            </header>

            {/* Upload Section */}
            <section>
                <DocumentUpload />
            </section>

            {/* List Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-sm font-semibold text-muted-foreground/60">All Documents</h2>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-16">
                        <Loader2 className="w-8 h-8 animate-spin text-primary/20" />
                    </div>
                ) : documents.length === 0 ? (
                    <div className="text-center p-16 bg-muted/20 rounded-2xl border border-dashed border-border">
                        <p className="text-muted-foreground/60 font-medium text-sm">No documents found</p>
                        <p className="text-xs text-muted-foreground/40 mt-1">Upload files to start using them in chat</p>
                    </div>
                ) : (
                    <div className="grid gap-2">
                        {documents.map((doc) => (
                            <div
                                key={doc.source}
                                className="group flex items-center justify-between p-4 bg-card hover:bg-muted/50 rounded-xl border border-border transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-muted-foreground/40 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-base">{doc.source}</h3>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground/50 mt-1">
                                            <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 bg-border rounded-full" />
                                            <span>{doc.chunkCount} chunks</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(doc.source)}
                                    disabled={deleting === doc.source}
                                    className={cn(
                                        "p-2 text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all",
                                        deleting === doc.source && "opacity-50 cursor-not-allowed"
                                    )}
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
