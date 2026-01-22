import ChatInterface from "@/components/ChatInterface";
import DocumentUpload from "@/components/DocumentUpload";
import { Brain, Zap, Database } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                AI Knowledge Base
              </h1>
              <p className="text-slate-400 text-sm">
                Powered by Groq, Gemini & Supabase
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Your Intelligent Document Assistant
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Upload documents and ask questions. Get instant, accurate answers
            powered by cutting-edge AI.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700">
            <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Lightning Fast
            </h3>
            <p className="text-slate-400 text-sm">
              Groq delivers responses at incredible speeds with Llama 3
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700">
            <div className="p-3 bg-purple-500/10 rounded-xl w-fit mb-4">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Smart Embeddings
            </h3>
            <p className="text-slate-400 text-sm">
              Google Gemini creates semantic understanding of your documents
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700">
            <div className="p-3 bg-green-500/10 rounded-xl w-fit mb-4">
              <Database className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Scalable Storage
            </h3>
            <p className="text-slate-400 text-sm">
              Supabase pgvector handles millions of document chunks efficiently
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <DocumentUpload />
        </div>

        {/* Chat Section */}
        <div>
          <ChatInterface />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-slate-500 text-sm">
            Built with Next.js, LangChain, Groq, Gemini & Supabase
          </p>
        </div>
      </footer>
    </main>
  );
}
