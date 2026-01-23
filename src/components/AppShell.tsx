import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, MessageSquare, Menu, X, Search, Settings } from "lucide-react";
import { Navigation } from "./Navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

interface Chat {
    id: string;
    title: string;
}

export function AppShell({ children }: { children: React.ReactNode }) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await fetch("/api/chats");
                const data = await res.json();
                if (data.chats) setChats(data.chats);
            } catch {
                console.log("Failed to load chats");
            }
        };

        fetchChats();
    }, []);

    const filteredChats = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className="flex flex-col h-screen bg-background text-foreground md:flex-row overflow-hidden font-sans">
            {/* Mobile Top Bar */}
            <header className="md:hidden flex items-center justify-between p-4 bg-background/80 backdrop-blur-md z-30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-primary-foreground text-xs font-bold">AI</span>
                    </div>
                    <span className="font-bold tracking-tight">AI Knowledge</span>
                </div>
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 hover:bg-muted rounded-xl transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Backdrop for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-background/40 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar (Drawer on mobile) */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-secondary flex flex-col transition-transform duration-300 md:relative md:translate-x-0 border-r border-border",
                isMobileMenuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
            )}>
                <div className="p-4 flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground text-xs font-bold">AI</span>
                            </div>
                            <h1 className="text-lg font-bold tracking-tight text-foreground">Assistant</h1>
                        </div>
                        <button onClick={toggleMobileMenu} className="md:hidden p-2 hover:bg-muted rounded-lg transition-all">
                            <X size={18} className="text-muted-foreground" />
                        </button>
                    </div>

                    <Link
                        href="/chat"
                        onClick={() => {
                            window.location.href = '/chat';
                            setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold transition-all hover:opacity-90 mb-8 shadow-sm border border-white/10"
                    >
                        <PlusCircle size={18} />
                        New Chat
                    </Link>

                    <Navigation className="flex-col gap-1 w-full mb-8" onItemClick={() => setIsMobileMenuOpen(false)} />

                    <div className="flex-1 flex flex-col min-h-0 px-1">
                        <div className="mb-4">
                            <h3 className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-3 px-2">
                                Recent History
                            </h3>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/40"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                            {filteredChats.length > 0 ? (
                                filteredChats.map(chat => (
                                    <Link
                                        key={chat.id}
                                        href={`/chat?id=${chat.id}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg group transition-all"
                                    >
                                        <MessageSquare size={16} className="text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                        <span className="truncate font-medium">{chat.title}</span>
                                    </Link>
                                ))
                            ) : (
                                <p className="px-3 py-10 text-xs text-muted-foreground/50 text-center italic">
                                    {searchQuery ? "No matches" : "No recent chats"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-border mt-auto flex items-center justify-between gap-4 bg-muted/30">
                    <p className="text-[10px] text-muted-foreground font-medium">
                        © 2026 Assistant
                    </p>
                    <ThemeToggle />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative bg-background">
                <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto pt-6 md:pt-10 px-4 md:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
