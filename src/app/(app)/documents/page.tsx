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
        <div className="flex flex-col gap-14 max-w-4xl mx-auto w-full pb-32 pt-6">
            <header className="flex items-center justify-between pb-8">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
                        <FileText className="text-primary w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tighter text-foreground">Managed Library</h1>
                        <p className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                            {documents.length} Items Indexed
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchDocuments}
                    className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-transparent hover:border-primary/10"
                >
                    <Loader2 className={cn("w-5 h-5", isLoading && "animate-spin")} />
                </button>
            </header>

            {/* Upload Section - No more boxed card */}
            <section className="relative">
                <DocumentUpload />
            </section>

            {/* List Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Knowledge Inventory</h2>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary/10" />
                    </div>
                ) : documents.length === 0 ? (
                    <div className="text-center p-24 bg-muted/5 rounded-[40px] border border-border/30 border-dashed">
                        <p className="text-muted-foreground/40 font-bold uppercase tracking-widest text-sm">Library is empty</p>
                        <p className="text-xs text-muted-foreground/20 mt-2 font-bold italic">Upload documents to populate your core</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {documents.map((doc) => (
                            <div
                                key={doc.source}
                                className="group flex items-center justify-between p-5 bg-card hover:bg-muted/10 rounded-[28px] border border-border/30 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.02] transition-all hover:translate-y-[-1px]"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-muted/30 rounded-2xl flex items-center justify-center text-muted-foreground/30 group-hover:text-primary group-hover:bg-primary/5 transition-all border border-border/30 group-hover:border-primary/10 shadow-sm">
                                        <FileText className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors tracking-tight text-lg">{doc.source}</h3>
                                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground/40 mt-1.5 font-black uppercase tracking-widest">
                                            <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 bg-border rounded-full" />
                                            <span className="text-primary/60">{doc.chunkCount} Context Chunks</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(doc.source)}
                                    disabled={deleting === doc.source}
                                    className={cn(
                                        "p-3.5 text-muted-foreground/30 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all border border-transparent hover:border-red-500/10",
                                        deleting === doc.source && "opacity-50 cursor-not-allowed"
                                    )}
                                    title="Eject from library"
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
