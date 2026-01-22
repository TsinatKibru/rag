import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, MessageSquare } from "lucide-react";
import { Navigation } from "./Navigation";

interface Chat {
    id: string;
    title: string;
}

export function AppShell({ children }: { children: React.ReactNode }) {
    const [chats, setChats] = useState<Chat[]>([]);

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

    return (
        <div className="flex flex-col h-screen bg-black text-zinc-100 md:flex-row overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-zinc-950 p-4">
                <div className="mb-6 px-2">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                        AI Knowledge
                    </h1>
                    <Link
                        href="/chat"
                        onClick={() => window.location.href = '/chat'} // Force refresh to clear ID if already on /chat
                        className="flex items-center gap-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
                    >
                        <PlusCircle size={16} />
                        New Chat
                    </Link>
                </div>

                <Navigation className="flex-col gap-2 w-full mb-6" />

                <div className="flex-1 overflow-y-auto mb-4">
                    <h3 className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                        Recent Chats
                    </h3>
                    <div className="space-y-1">
                        {chats.map(chat => (
                            <Link
                                key={chat.id}
                                href={`/chat?id=${chat.id}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg truncate transition-colors"
                            >
                                <MessageSquare size={14} className="flex-shrink-0" />
                                <span className="truncate">{chat.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto p-4 md:p-6 pb-20 md:pb-6">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Tab Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950 px-4 py-2 safe-area-pb z-50">
                <Navigation className="flex-row justify-around gap-0" />
            </div>
        </div>
    );
}
