# AI-Powered Knowledge Base (RAG)

An advanced **Retrieval-Augmented Generation (RAG)** application dealing with your documents. Built with **Next.js**, **Supabase**, and **LangChain**, it allows you to upload documents and ask questions about them in natural language, receiving accurate, context-aware answers.

## 🚀 Why This Project? (Features)

This project bridges the gap between static documents and interactive AI.

-   **🧠 Smart RAG Engine**: Uses Google Gemini embeddings and Groq (Llama 3) for lightning-fast, accurate answers.
-   **💬 Persistent Chat**: Save your conversation history and pick up where you left off.
-   **📂 Document Management**: Easily upload, list, and delete PDF documents from your knowledge base.
-   **📱 PWA Ready**: Installable as a native-like app on mobile and desktop devices.
-   **⚡ High Performance**: Built on Next.js 14 App Router and Supabase pgvector for sub-second retrieval.
-   **🎨 Modern UI**: Features a premium dark mode, glassmorphism effects, and smooth animations.

## 🛠️ Tech Stack

-   **Framework**: Next.js 15 (App Router, React 19)
-   **Language**: TypeScript
-   **Database**: Supabase (PostgreSQL + pgvector)
-   **AI Logic**: LangChain.js
-   **LLM Provider**: Groq (Llama 3.3 70B)
-   **Embeddings**: Google Gemini (text-embedding-004)
-   **Styling**: Tailwind CSS v4, Lucide React, Sonner (Toasts)

## 🏃 How to Get Started

### Prerequisites
-   Node.js 20+
-   Supabase Account
-   Groq API Key
-   Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/ai-rag-knowledge-base.git
    cd ai-rag-knowledge-base
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    npm ci
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    GROQ_API_KEY=your_groq_api_key
    GOOGLE_GENAI_API_KEY=your_gemini_api_key
    ```

4.  **Database Initialization**
    Run the SQL scripts located in `docs/` in your Supabase SQL Editor:
    -   Enable `vector` extension.
    -   Create `documents`, `chats`, and `messages` tables.
    -   Create the `match_documents` function.
    *(Refer to `docs/02-database-setup.md` for the exact queries)*

5.  **Run the App**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 📚 Where to Get Help

We have detailed documentation in the `docs/` folder:

-   [**Project Setup**](docs/01-initialization.md)
-   [**Database Configuration**](docs/02-database-setup.md)
-   [**Core AI Logic**](docs/03-core-ai-logic.md)
-   [**API Reference**](docs/04-api-routes.md)
-   [**UI Documentation**](docs/05-frontend-ui.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 👤 Maintainers

-   **Project Lead**: [Tsinat Kibru](https://github.com/TsinatKibru)

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
