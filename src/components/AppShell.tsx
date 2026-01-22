import { Navigation } from "./Navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen bg-black text-zinc-100 md:flex-row overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-zinc-950 p-4">
                <div className="mb-8 px-4 py-2">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Full Stack RAG
                    </h1>
                </div>
                <Navigation className="flex-col gap-2 w-full" />
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
