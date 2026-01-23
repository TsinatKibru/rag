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
                "fixed inset-y-0 left-0 z-50 w-80 bg-muted/20 backdrop-blur-2xl flex flex-col transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform md:relative md:translate-x-0 border-r border-border/30 shadow-premium",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-[1.25rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-premium ring-1 ring-white/10">
                                <span className="text-primary-foreground text-xs font-black">AI</span>
                            </div>
                            <h1 className="text-2xl font-black tracking-tighter text-foreground">Workspace</h1>
                        </div>
                        <button onClick={toggleMobileMenu} className="md:hidden p-2 hover:bg-muted/50 rounded-xl transition-all">
                            <X size={20} className="text-muted-foreground/50" />
                        </button>
                    </div>

                    <Link
                        href="/chat"
                        onClick={() => {
                            window.location.href = '/chat';
                            setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-primary text-primary-foreground rounded-[22px] text-[13px] font-black uppercase tracking-[0.15em] transition-all shadow-premium hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] mb-12"
                    >
                        <PlusCircle size={18} strokeWidth={3} />
                        New Intelligence
                    </Link>

                    <Navigation className="flex-col gap-2 w-full mb-12" onItemClick={() => setIsMobileMenuOpen(false)} />

                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="px-1 mb-6">
                            <h3 className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] mb-5 px-3">
                                Recent Streams
                            </h3>
                            <div className="relative group mx-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search library..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-background/40 border border-border/20 rounded-[18px] pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 font-bold"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-1 space-y-1.5 custom-scrollbar pb-10">
                            {filteredChats.length > 0 ? (
                                filteredChats.map(chat => (
                                    <Link
                                        key={chat.id}
                                        href={`/chat?id=${chat.id}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-4 px-4 py-4 text-sm text-muted-foreground/60 hover:text-foreground hover:bg-background/60 rounded-[20px] group transition-all"
                                    >
                                        <MessageSquare size={18} className="text-muted-foreground/20 group-hover:text-primary transition-colors" />
                                        <span className="truncate font-bold tracking-tight">{chat.title}</span>
                                    </Link>
                                ))
                            ) : (
                                <p className="px-4 py-16 text-xs text-muted-foreground/20 font-black uppercase tracking-widest text-center italic">
                                    {searchQuery ? "No matches" : "Empty stream"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-border/10 mt-auto flex items-center justify-between gap-5 bg-background/20">
                    <p className="text-[9px] text-muted-foreground/20 font-black uppercase tracking-[0.4em]">
                        © 2026 LOGI
                    </p>
                    <ThemeToggle />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative bg-background/30">
                <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto p-6 md:p-14 lg:p-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
