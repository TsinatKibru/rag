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
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header - Simple and Clean */}
                <div className="px-6 py-4 md:px-8 border-b border-border bg-card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                            <Bot className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-foreground">Assistant</h2>
                            <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
                                Powered by RAG Engine
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages Area - Clean and Balanced */}
                <div className="flex-1 overflow-y-auto space-y-8 custom-scrollbar px-6 md:px-8 py-8">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-12">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-border/20">
                                    <Bot className="w-10 h-10 text-muted-foreground/30" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 tracking-tight">Welcome to Chat</h3>
                                <p className="text-muted-foreground/60 max-w-sm mx-auto text-sm font-medium leading-relaxed">
                                    Ask anything about your documents. I'm here to help you retrieve information.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                                {SUGGESTIONS.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="text-left p-4 rounded-xl bg-card hover:bg-muted border border-border/60 transition-all text-sm font-semibold flex items-center justify-between group"
                                    >
                                        <span className="text-muted-foreground group-hover:text-foreground">{suggestion}</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex gap-4",
                                    message.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                {message.role === "assistant" && (
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 border border-primary/20">
                                        <Bot className="w-5 h-5 text-primary" />
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        "max-w-[85%] md:max-w-[75%] px-5 py-4 rounded-2xl",
                                        message.role === "user"
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "bg-muted/50 text-foreground border border-border/30"
                                    )}
                                >
                                    {message.role === "user" ? (
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                    ) : (
                                        <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-muted/30 prose-pre:border prose-pre:border-border/20">
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                                {message.role === "user" && (
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-1 border border-border">
                                        <User className="w-5 h-5 text-muted-foreground/50" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {loading && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div className="bg-muted/50 rounded-2xl px-6 py-4 border border-border/30 flex items-center gap-3">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Assistant is thinking</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Simple and Clean */}
                <div className="p-6 md:p-8 sticky bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSubmit} className="relative shadow-sm focus-within:shadow-md transition-shadow rounded-2xl">
                            <div className="flex gap-3 p-2 bg-card rounded-2xl border border-border focus-within:border-primary/50 transition-colors">
                                <div className="flex-1">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSubmit(e);
                                            }
                                        }}
                                        placeholder="Type your message..."
                                        disabled={loading}
                                        rows={1}
                                        className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/40 rounded-xl px-4 py-3 focus:outline-none transition-all font-medium tracking-tight resize-none min-h-[48px] max-h-40 custom-scrollbar text-sm"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className={cn(
                                        "h-10 w-10 md:h-11 md:w-11 rounded-xl font-bold transition-all flex items-center justify-center flex-shrink-0 self-end mb-1 mr-1",
                                        input.trim() && !loading
                                            ? "bg-primary text-primary-foreground hover:opacity-90"
                                            : "bg-muted text-muted-foreground/20 cursor-not-allowed"
                                    )}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    <p className="mt-4 text-[10px] text-center text-muted-foreground/40 font-medium">
                        Enter to send, Shift + Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
}
