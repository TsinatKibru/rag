import ChatInterface from "@/components/ChatInterface";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full h-[calc(100vh-theme(spacing.24))] md:h-[calc(100vh-theme(spacing.12))]">
            <section className="w-full flex-1 bg-card rounded-[32px] border border-border/40 shadow-premium overflow-hidden flex flex-col p-2 md:p-6 lg:p-8">
                <div className="flex-1 overflow-hidden rounded-[24px] bg-background/20">
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
