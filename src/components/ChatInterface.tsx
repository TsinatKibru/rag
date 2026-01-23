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
                {/* Header - High-end Glassmorphism */}
                <div className="px-6 py-6 md:px-8 md:pb-10 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-primary/10 rounded-[18px] flex items-center justify-center border border-primary/20 shadow-premium">
                            <Bot className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground leading-none">Insight AI</h2>
                            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.25em] mt-1.5 opacity-60">
                                Neural Search • Enterprise Context
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages Area - Refined spacing and depth */}
                <div className="flex-1 overflow-y-auto space-y-10 custom-scrollbar px-6 md:px-8 pb-10">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-20">
                            <div className="text-center mb-10">
                                <div className="w-24 h-24 bg-muted/20 rounded-[36px] flex items-center justify-center mx-auto mb-8 border border-border/20 shadow-premium group hover:scale-[1.02] transition-all">
                                    <Bot className="w-12 h-12 text-muted-foreground/20 group-hover:text-primary/40 transition-colors" />
                                </div>
                                <h3 className="text-3xl font-black mb-3 tracking-tighter text-foreground">How can I help?</h3>
                                <p className="text-muted-foreground/50 max-w-sm mx-auto text-sm font-semibold leading-relaxed tracking-tight">
                                    I'm your intelligent knowledge assistant. Ask me anything about your uploaded workspace.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-2">
                                {SUGGESTIONS.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="text-left p-5 rounded-[22px] bg-card/50 hover:bg-muted/30 border border-border/40 hover:border-primary/20 transition-all text-xs font-bold flex items-center justify-between group shadow-soft hover:shadow-premium hover:-translate-y-0.5"
                                    >
                                        <span className="text-muted-foreground/70 group-hover:text-foreground">{suggestion}</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex gap-5",
                                    message.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                {message.role === "assistant" && (
                                    <div className="w-10 h-10 rounded-[16px] bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 border border-primary/20 shadow-soft">
                                        <Bot className="w-5 h-5 text-primary" />
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        "max-w-[85%] md:max-w-[78%] px-5 py-4 shadow-premium",
                                        message.role === "user"
                                            ? "bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground rounded-[24px] rounded-br-[4px] font-medium"
                                            : "bg-card text-foreground border border-border/30 rounded-[24px] rounded-tl-[4px]"
                                    )}
                                >
                                    {message.role === "user" ? (
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap tracking-tight">{message.content}</p>
                                    ) : (
                                        <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-muted/30 prose-pre:border prose-pre:border-border/20 prose-headings:tracking-tighter prose-headings:font-black">
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                                {message.role === "user" && (
                                    <div className="w-10 h-10 rounded-[16px] bg-muted/40 flex items-center justify-center flex-shrink-0 mt-1 border border-border/40 shadow-soft">
                                        <User className="w-5 h-5 text-muted-foreground/30" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {loading && (
                        <div className="flex gap-5">
                            <div className="w-10 h-10 rounded-[16px] bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div className="bg-card rounded-[24px] rounded-tl-[4px] px-6 py-4 border border-border/30 shadow-soft flex items-center gap-4">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-duration:0.8s]" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-duration:0.8s]" style={{ animationDelay: '200ms' }} />
                                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-duration:0.8s]" style={{ animationDelay: '400ms' }} />
                                </div>
                                <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.3em]">Processing</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Floating Premium Action Bar */}
                <div className="pt-4 md:py-8 sticky bottom-0 z-20">
                    <div className="max-w-4xl mx-auto px-6 md:px-8">
                        <form onSubmit={handleSubmit} className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-[28px] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex gap-3 p-2 bg-card/60 backdrop-blur-2xl rounded-[26px] border border-border/40 shadow-premium ring-1 ring-white/5">
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
                                        placeholder="Message AI assistant..."
                                        disabled={loading}
                                        rows={1}
                                        className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/30 rounded-xl px-5 py-3 focus:outline-none transition-all font-bold tracking-tight resize-none min-h-[48px] max-h-40 custom-scrollbar mt-0.5 text-sm"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className={cn(
                                        "h-[48px] w-[48px] rounded-[18px] font-black transition-all flex items-center justify-center flex-shrink-0 self-end mb-0.5 mr-0.5",
                                        input.trim() && !loading
                                            ? "bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground shadow-premium hover:shadow-indigo-500/20 hover:scale-[1.04] active:scale-[0.96]"
                                            : "bg-muted text-muted-foreground/20 cursor-not-allowed border border-border/10"
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
                    <p className="mt-4 text-[9px] text-center text-muted-foreground/25 font-black uppercase tracking-[0.25em]">
                        Neural Intelligence Engine • RAG V2.4
                    </p>
                </div>
            </div>
        </div>
    );
}
