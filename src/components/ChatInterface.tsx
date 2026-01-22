"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Send, Loader2, Bot, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const SUGGESTIONS = [
    "Summarize the uploaded documents",
    "What are the main key points?",
    "Explain the technical concepts",
    "Draft an email based on these docs"
];

export default function ChatInterface() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const chatIdParam = searchParams.get("id");

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (chatIdParam) {
            fetchHistory(chatIdParam);
        } else {
            setMessages([]);
        }
    }, [chatIdParam]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchHistory = async (id: string) => {
        try {
            const res = await fetch(`/api/chats/${id}`);
            const data = await res.json();
            if (data.messages) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error("Failed to load history", error);
            toast.error("Failed to load chat history");
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
        // Optional: auto-submit
        // handleSubmit(new Event('submit') as any, suggestion); -- requires refactor
    };

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
                body: JSON.stringify({
                    question: input,
                    chatId: chatIdParam
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const assistantMessage: Message = {
                    role: "assistant",
                    content: data.answer,
                };
                setMessages((prev) => [...prev, assistantMessage]);

                // If it was a new chat, update URL to preserve context
                if (!chatIdParam && data.chatId) {
                    router.push(`/chat?id=${data.chatId}`);
                }
            } else {
                toast.error("I encountered an error. Please try again.");
                // We don't add error message to chat history UI to keep it clean, just toast it
            }
        } catch {
            toast.error("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Bot className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">AI Assistant</h2>
                            <p className="text-slate-400 text-xs md:text-sm">
                                Ask questions about your documents
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-4">
                            <div className="text-center mb-8">
                                <Bot className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                                <p className="text-slate-400 text-lg font-medium">
                                    Start a conversation
                                </p>
                                <p className="text-slate-500 text-sm mt-2">
                                    Ask me anything about your uploaded documents
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                                {SUGGESTIONS.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="text-left p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all text-sm text-slate-300 hover:text-white flex items-center justify-between group"
                                    >
                                        <span>{suggestion}</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                                    </button>
                                ))}
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
                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Bot className="w-5 h-5 text-purple-400" />
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        "max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm",
                                        message.role === "user"
                                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                                            : "bg-slate-800 text-slate-100 border border-slate-700"
                                    )}
                                >
                                    {message.role === "user" ? (
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                    ) : (
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                                {message.role === "user" && (
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1">
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
                            <div className="bg-slate-800 rounded-2xl px-5 py-4 border border-slate-700 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                                <span className="text-xs text-slate-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 md:p-6 border-t border-slate-700 bg-slate-900/50">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question about your documents..."
                            disabled={loading}
                            className="flex-1 bg-slate-800 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700 transition-all font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className={cn(
                                "px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2",
                                input.trim() && !loading
                                    ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/25 transform hover:scale-105"
                                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
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
