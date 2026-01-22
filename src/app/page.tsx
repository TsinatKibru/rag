import Link from "next/link";
import { MessageSquare, Shield, Zap, type LucideIcon } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-100">
      {/* Navigation Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-zinc-900">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white">AI</span>
          </div>
          <span>Knowledge Base</span>
        </div>
        <nav>
          <Link href="/chat" className="text-sm font-medium hover:text-blue-400 transition-colors">
            Log In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 pb-20">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text text-transparent pb-2">
            Chat with your Documents
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Transform your static PDFs into an interactive knowledge base.
            Upload, index, and ask questions instantly using advanced AI.
          </p>

          <div className="pt-8">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-black bg-white rounded-full hover:bg-zinc-200 transition-all transform hover:scale-105"
            >
              Get Started Now
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full text-left">
          <FeatureCard
            icon={Zap}
            title="Instant Answers"
            description="Powered by Groq and Llama 3 for lightning-fast responses."
          />
          <FeatureCard
            icon={MessageSquare}
            title="Context Aware"
            description="Uses RAG technology to understand the exact context of your documents."
          />
          <FeatureCard
            icon={Shield}
            title="Secure & Private"
            description="Your documents are stored securely with vector encryption."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-zinc-600 text-sm border-t border-zinc-900">
        © 2026 AI Knowledge Base. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: LucideIcon, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center mb-4 text-zinc-100">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
