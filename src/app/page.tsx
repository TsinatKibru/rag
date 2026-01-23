import Link from "next/link";
import { MessageSquare, Shield, Zap, type LucideIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Navigation Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-sm tracking-tight">AI</span>
          </div>
          <span className="font-bold text-xl tracking-tight">AI Knowledge</span>
        </div>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/documents" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            Features
          </Link>
          <ThemeToggle />
          <Link href="/chat" className="text-sm font-bold bg-muted hover:bg-accent px-5 py-2.5 rounded-xl transition-all border border-border">
            Launch App
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 pb-32 pt-20">
        <div className="max-w-4xl space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-widest animate-fade-in">
            <Zap size={14} /> Powered by Llama 3 & Gemini
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-foreground">
            Chat with your <br />
            <span className="text-primary italic">Documents.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            The intelligent knowledge base that understands your PDF, Markdown, and Text files.
            Ask questions and get instant, context-aware answers.
          </p>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              href="/chat"
              className="w-full md:w-auto inline-flex items-center justify-center px-10 py-5 text-base font-bold text-primary-foreground bg-primary rounded-2xl hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary/25"
            >
              Get Started Free
            </Link>
            <Link
              href="/documents"
              className="w-full md:w-auto inline-flex items-center justify-center px-10 py-5 text-base font-bold text-foreground bg-card border border-border rounded-2xl hover:bg-muted transition-all"
            >
              Managed Files
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full text-left px-4">
          <FeatureCard
            icon={Zap}
            title="Instant Retrieval"
            description="Our RAG engine delivers precise answers from your documents in sub-seconds."
          />
          <FeatureCard
            icon={MessageSquare}
            title="Smarter Context"
            description="Using advanced semantic chunking to ensure the AI always has the right data."
          />
          <FeatureCard
            icon={Shield}
            title="Your Data, Secured"
            description="Robust vector encryption and secure storage for all your private knowledge."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-border bg-card/30">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale">
          <div className="w-6 h-6 rounded bg-foreground/10" />
          <div className="w-6 h-6 rounded bg-foreground/10" />
          <div className="w-6 h-6 rounded bg-foreground/10" />
        </div>
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
          © 2026 AI Knowledge Base Infrastructure
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: LucideIcon, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-card border border-border hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all group">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-6 text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-colors border border-border group-hover:border-primary/10">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-sm font-medium leading-relaxed">{description}</p>
    </div>
  )
}
