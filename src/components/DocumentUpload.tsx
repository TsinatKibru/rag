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
            <div className="py-6 md:py-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                        <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Upload Documents</h2>
                        <p className="text-muted-foreground/60 text-xs font-semibold uppercase tracking-wider mt-0.5">
                            PDF • TXT • MD
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
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
                                "flex items-center justify-center w-full p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all",
                                file
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/30 bg-muted/20 hover:bg-muted/30",
                                uploading && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-background rounded-xl flex items-center justify-center mx-auto mb-4 border border-border group-hover:border-primary/30 transition-all shadow-sm">
                                    <PlusCircle className={cn("w-8 h-8 transition-colors", file ? "text-primary" : "text-muted-foreground/40")} />
                                </div>
                                <p className="text-foreground font-semibold text-lg">
                                    {file ? file.name : "Choose file"}
                                </p>
                                <p className="text-muted-foreground/50 text-xs mt-1 font-medium">
                                    {file ? `${(file.size / 1024).toFixed(1)} KB` : "Drag and drop or click to browse"}
                                </p>
                            </div>
                        </label>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className={cn(
                            "w-full py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-sm",
                            file && !uploading
                                ? "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                                : "bg-muted text-muted-foreground/30 cursor-not-allowed"
                        )}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Upload & Index
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
