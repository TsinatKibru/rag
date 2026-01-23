"use client";

import { useState } from "react";
import { Upload, Loader2, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { toast } from "sonner";

export default function DocumentUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        // Toast loading state
        const toastId = toast.loading("Processing document...");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Document uploaded successfully!", { id: toastId });
                setFile(null);
            } else {
                toast.error(data.error || "Upload failed", { id: toastId });
            }
        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="py-8 md:py-12">
                <div className="flex items-center gap-5 mb-10">
                    <div className="p-4 bg-primary/10 rounded-[22px] border border-primary/20 shadow-sm">
                        <Upload className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tighter text-foreground">Ingest Knowledge</h2>
                        <p className="text-muted-foreground/60 text-sm font-semibold uppercase tracking-widest mt-0.5">
                            PDF • TXT • MD Support
                        </p>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="relative group">
                        <input
                            type="file"
                            accept=".pdf,.txt,.md"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            disabled={uploading}
                        />
                        <label
                            htmlFor="file-upload"
                            className={cn(
                                "flex items-center justify-center w-full p-16 border-2 border-dashed rounded-[32px] cursor-pointer transition-all",
                                file
                                    ? "border-primary bg-primary/5 shadow-inner"
                                    : "border-border/40 hover:border-primary/20 bg-muted/10 hover:bg-muted/20 shadow-sm",
                                uploading && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <div className="text-center">
                                <div className="w-20 h-20 bg-background rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border/30 group-hover:border-primary/20 transition-all shadow-sm group-hover:scale-105">
                                    <PlusCircle className={cn("w-10 h-10 transition-colors", file ? "text-primary" : "text-muted-foreground/30")} />
                                </div>
                                <p className="text-foreground font-bold text-xl tracking-tight">
                                    {file ? file.name : "Select Document"}
                                </p>
                                <p className="text-muted-foreground/40 text-sm mt-2 font-bold uppercase tracking-widest">
                                    {file ? `${(file.size / 1024).toFixed(1)} KB` : "Drop file anywhere or browse"}
                                </p>
                            </div>
                        </label>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className={cn(
                            "w-full py-5 px-8 rounded-2xl font-black transition-all flex items-center justify-center gap-4 text-xs tracking-[0.2em] uppercase",
                            file && !uploading
                                ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] hover:opacity-95"
                                : "bg-muted text-muted-foreground/30 cursor-not-allowed border border-border/20"
                        )}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Process & Index
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
