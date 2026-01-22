import ChatInterface from "@/components/ChatInterface";
import DocumentUpload from "@/components/DocumentUpload";

export default function ChatPage() {
    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
            <section className="w-full bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-xl">
                <h2 className="text-xl font-semibold mb-4 text-zinc-100 flex items-center gap-2">
                    <span>📄</span> Upload Documents
                </h2>
                <DocumentUpload />
            </section>

            <section className="w-full h-[600px] bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl overflow-hidden flex flex-col">
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
