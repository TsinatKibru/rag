"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: input }),
            });

            const data = await response.json();

            if (response.ok) {
                const assistantMessage: Message = {
                    role: "assistant",
                    content: data.answer,
                };
                setMessages((prev) => [...prev, assistantMessage]);
            } else {
                const errorMessage: Message = {
                    role: "assistant",
                    content: "Sorry, I encountered an error. Please try again.",
                };
                setMessages((prev) => [...prev, errorMessage]);
            }
        } catch {
            const errorMessage: Message = {
                role: "assistant",
                content: "Network error. Please check your connection.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Bot className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">AI Assistant</h2>
                            <p className="text-slate-400 text-sm">
                                Ask questions about your documents
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <Bot className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                                <p className="text-slate-400 text-lg font-medium">
                                    Start a conversation
                                </p>
                                <p className="text-slate-500 text-sm mt-2">
                                    Ask me anything about your uploaded documents
                                </p>
                            </div>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex gap-3",
                                    message.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                {message.role === "assistant" && (
                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-5 h-5 text-purple-400" />
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-2xl px-4 py-3",
                                        message.role === "user"
                                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                                            : "bg-slate-800 text-slate-100 border border-slate-700"
                                    )}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {message.content}
                                    </p>
                                </div>
                                {message.role === "user" && (
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-blue-400" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {loading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="bg-slate-800 rounded-2xl px-4 py-3 border border-slate-700">
                                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-6 border-t border-slate-700">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            disabled={loading}
                            className="flex-1 bg-slate-800 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className={cn(
                                "px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2",
                                input.trim() && !loading
                                    ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/25"
                                    : "bg-slate-700 text-slate-400 cursor-not-allowed"
                            )}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
