import ChatInterface from "@/components/ChatInterface";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
    return (
        <div className="flex flex-col gap-8 w-full h-[calc(100vh-theme(spacing.32))] md:h-[calc(100vh-theme(spacing.24))] pb-10">
            <section className="w-full flex-1 bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
                <div className="flex-1 overflow-hidden">
                    <Suspense fallback={
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary/20" />
                        </div>
                    }>
                        <ChatInterface />
                    </Suspense>
                </div>
            </section>
        </div>
    );
}
