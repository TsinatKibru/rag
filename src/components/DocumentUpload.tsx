"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DocumentUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<{
        type: "idle" | "success" | "error";
        message: string;
    }>({ type: "idle", message: "" });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setStatus({ type: "idle", message: "" });
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setStatus({ type: "idle", message: "" });

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({
                    type: "success",
                    message: data.message || "Document uploaded successfully!",
                });
                setFile(null);
            } else {
                setStatus({
                    type: "error",
                    message: data.error || "Upload failed",
                });
            }
        } catch (error) {
            setStatus({
                type: "error",
                message: "Network error. Please try again.",
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Upload className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Upload Document</h2>
                        <p className="text-slate-400 text-sm">
                            Add PDFs to your knowledge base
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            disabled={uploading}
                        />
                        <label
                            htmlFor="file-upload"
                            className={cn(
                                "flex items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all",
                                file
                                    ? "border-blue-500 bg-blue-500/5"
                                    : "border-slate-600 hover:border-slate-500 bg-slate-800/50",
                                uploading && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <div className="text-center">
                                <Upload className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                                <p className="text-slate-300 font-medium">
                                    {file ? file.name : "Choose a PDF file"}
                                </p>
                                <p className="text-slate-500 text-sm mt-1">
                                    Click to browse or drag and drop
                                </p>
                            </div>
                        </label>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className={cn(
                            "w-full py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                            file && !uploading
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/25"
                                : "bg-slate-700 text-slate-400 cursor-not-allowed"
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
                                Upload to Knowledge Base
                            </>
                        )}
                    </button>

                    {status.type !== "idle" && (
                        <div
                            className={cn(
                                "flex items-center gap-3 p-4 rounded-xl",
                                status.type === "success"
                                    ? "bg-green-500/10 border border-green-500/20"
                                    : "bg-red-500/10 border border-red-500/20"
                            )}
                        >
                            {status.type === "success" ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            )}
                            <p
                                className={cn(
                                    "text-sm font-medium",
                                    status.type === "success" ? "text-green-300" : "text-red-300"
                                )}
                            >
                                {status.message}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
