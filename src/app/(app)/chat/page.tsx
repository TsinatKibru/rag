import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full h-[calc(100vh-theme(spacing.24))] md:h-[calc(100vh-theme(spacing.12))]">
            <section className="w-full flex-1 bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                    <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                        <span>💬</span> Chat with AI
                    </h2>
                </div>
                <div className="flex-1 overflow-hidden">
                    <ChatInterface />
                </div>
            </section>
        </div>
    );
}
