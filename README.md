# Notes App (Next.js + Auth + Prisma + RAG)

Snappy: An intelligent notes app with semantic search and AI chat. Sign up, sign in, capture notes, and query them by meaning using RAG (Retrieval Augmented Generation) technology.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Note:** ChromaDB starts automatically on port 8001. For AI chat, ensure [Ollama](https://ollama.ai) is installed and running locally.

## What It Does (Short)

- Sign up with email/password
- Sign in with credentials
- Create and delete notes
- **Semantic search** — find notes by meaning, not keywords
- **AI chat** — ask questions and get answers based on your notes
- Each user sees only their own notes
- Beautiful glassmorphism UI with dark mode support

## What We Learned (Detailed)

### 1) Next.js App Router mental model
- **Folder‑based routing**: each folder under `src/app` becomes a route segment (e.g., `src/app/notes/page.tsx` → `/notes`).
- **Server vs client components**: server components fetch DB data directly; client components handle UI state and browser events.
- **Route handlers**: `src/app/api/.../route.ts` is an API endpoint inside the same app.
- **Server actions**: `"use server"` functions enable form submissions without API routes.

### 2) Prisma + SQLite basics
- **Schema first**: data models live in `prisma/schema.prisma`.
- **Migrations**: `npx prisma migrate dev --name init` creates `dev.db` and syncs schema.
- **Client generation**: `npx prisma generate` generates the Prisma client.

### 3) Auth.js (NextAuth) with Credentials
- **Providers** define how users sign in (we used Credentials).
- **JWT strategy** is required for Credentials in this setup.
- **Adapter** lets Auth.js store users in the DB.

### 4) RAG Implementation (ChromaDB + Ollama)
- **Vector database**: ChromaDB stores embeddings for semantic search.
- **Embeddings**: `@xenova/transformers` generates vectors using `all-MiniLM-L6-v2` model.
- **LLM**: Ollama provides local AI chat (no API keys needed).
- **User scoping**: Each user gets their own ChromaDB collection (`notes_user_{userId}`).
- **Fire-and-forget**: Embeddings generated asynchronously to avoid blocking note creation.

### 5) UI with shadcn/ui
- **Component library**: Pre-built, customizable components (Button, Card, Input, etc.).
- **Glassmorphism**: Backdrop blur effects with transparent backgrounds.
- **Dark mode**: System theme detection with CSS variables.
- **Responsive**: Mobile-first design with Tailwind CSS.

### 6) Real‑world integration gotchas
- Prisma v7 requires:
  - **No `datasource.url` in schema** (it lives in `prisma.config.ts`).
  - **Explicit client output** (we generate to `src/generated/prisma`).
  - **SQLite adapter** when using the `client` engine.
- ChromaDB JavaScript client:
  - **Requires server running** (unlike Python PersistentClient).
  - **Must pass `embeddingFunction: null`** when providing embeddings manually.
  - **Port conflicts**: Default 8000 may conflict; we use 8001.
- Embedding generation:
  - **First run downloads model** (~90MB) — can be slow.
  - **Must be non-blocking** — use fire-and-forget pattern.
- Signup moved to an **API route** (Turbopack + server action glitches), so the form posts to `/api/signup`.

## How We Built It (Detailed)

### Core files
- `prisma/schema.prisma` — DB models: `User`, `Note`, and Auth tables.
- `src/lib/prisma.ts` — shared Prisma client using SQLite adapter.
- `src/lib/auth.ts` — NextAuth config (Credentials provider).
- `src/lib/chromadb.ts` — ChromaDB client with user-scoped collections.
- `src/lib/embeddings.ts` — Embedding generation using `@xenova/transformers`.
- `src/lib/ollama.ts` — Ollama LLM wrapper.
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth API route.
- `src/app/api/signup/route.ts` — signup endpoint (hashes password, creates user).
- `src/app/api/rag/search/route.ts` — semantic search endpoint.
- `src/app/api/rag/chat/route.ts` — RAG chat endpoint.
- `src/app/signin/page.tsx` — login form (calls `signIn`).
- `src/app/signup/page.tsx` — signup form (POSTs to `/api/signup`).
- `src/app/notes/page.tsx` — protected notes UI with search and chat.
- `src/app/notes/actions.ts` — server actions (create/delete notes, reindex).
- `src/components/landing/` — Landing page components (Hero, Features, FAQ, Navbar, Footer).

### Auth flow (high‑level)
1. User signs up → `/api/signup` hashes password and creates user.
2. User signs in → NextAuth Credentials provider verifies password.
3. Session stored as **JWT** cookie.
4. `/notes` checks session with `getServerSession`.

### Notes flow
1. `/notes` fetches notes for the logged‑in user.
2. `createNote` / `deleteNote` server actions mutate DB.
3. **Embeddings generated asynchronously** (fire-and-forget) and stored in ChromaDB.
4. `revalidatePath("/notes")` refreshes the page list.

### RAG flow (semantic search)
1. User enters search query.
2. Query converted to embedding vector.
3. ChromaDB finds similar notes by cosine similarity.
4. Results ranked and displayed with similarity scores.

### RAG flow (AI chat)
1. User asks a question.
2. Question converted to embedding vector.
3. ChromaDB retrieves top 3 most relevant notes.
4. Notes + question sent to Ollama as prompt.
5. Ollama generates answer based on retrieved context.
6. Answer displayed with source notes shown.

## Architecture

### Data Storage
```
Prisma (SQLite)          ChromaDB (Vectors)
├── Users                ├── notes_user_{userId}
├── Notes (metadata)     │   ├── embeddings
└── Auth tables          │   ├── documents
                         │   └── metadatas
```

**Why both?**
- **Prisma**: Source of truth for structured data, relationships, CRUD operations.
- **ChromaDB**: Enables semantic search and RAG by storing vector embeddings.
- **They complement each other** — Prisma stores what, ChromaDB enables how to find it.

### Note Creation Flow
```
User submits form
  ↓
createNote() server action
  ↓
Prisma: Save note to SQLite ✅
  ↓
revalidatePath() → UI updates immediately ✅
  ↓
[Background] generateEmbedding()
  ↓
[Background] ChromaDB upsert() → Vector stored ✅
```

### Semantic Search Flow
```
User enters query
  ↓
POST /api/rag/search
  ↓
generateEmbedding(query)
  ↓
ChromaDB query(queryEmbedding)
  ↓
Return ranked results with similarity scores
```

### RAG Chat Flow
```
User asks question
  ↓
POST /api/rag/chat
  ↓
generateEmbedding(question)
  ↓
ChromaDB query → Retrieve top 3 notes
  ↓
Build prompt: notes + question
  ↓
Ollama generate(prompt)
  ↓
Return answer + source notes
```

## Environment

`.env` must include:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
CHROMA_URL="http://localhost:8001"  # Optional, defaults to 8001
OLLAMA_URL="http://localhost:11434"  # Optional, defaults to this
OLLAMA_MODEL="mistral"  # Optional, defaults to mistral
```

## Setup Requirements

1. **Node.js** — for Next.js app
2. **ChromaDB** — starts automatically via `npm run dev` (runs on port 8001)
3. **Ollama** (optional, for AI chat):
   - Install from [ollama.ai](https://ollama.ai)
   - Pull a model: `ollama pull mistral` (or `llama3`)

## [FB Notes]_ai

We started with a simple notes app, then added **RAG (Retrieval Augmented Generation)** to make it intelligent.

**Phase 1: Foundation**
We needed **A) a web framework**, **B) a database**, and **C) authentication**.  
**A = Next.js (App Router)** so we could ship pages, API routes, and server logic in one place.  
**B = Prisma + SQLite** so we could model data, run migrations, and query notes without wiring a DB by hand.  
**C = Auth.js (NextAuth) Credentials** so users could create accounts, sign in, and have sessions.

**Phase 2: RAG Integration**
We wanted semantic search and AI chat, which required **D) vector storage** and **E) an LLM**.  
**D = ChromaDB** so we could store embeddings and search by meaning.  
**E = Ollama** so we could run AI locally without API keys or cloud costs.

**The Architecture Decision**
We kept **both Prisma and ChromaDB** because they serve different purposes:
- Prisma stores structured data (users, notes metadata) — the source of truth.
- ChromaDB stores vector embeddings — enables semantic search.
- They work together: Prisma has the data, ChromaDB helps find it.

**The Flow**
1. **Note creation**: Save to Prisma (fast), then embed and store in ChromaDB (background).
2. **Search**: Convert query to embedding, find similar notes in ChromaDB, return results.
3. **Chat**: Retrieve relevant notes from ChromaDB, send to Ollama with context, get answer.

**Why This Works**
Each step unlocks the next: without models there is no DB, without the DB there is no auth, without auth you can't safely show user-specific notes, without notes there's nothing to embed, without embeddings there's no semantic search, and without RAG there's no AI chat. This chain is the "why" of the build.

**Key Learnings**
- ChromaDB JS client needs a running server (unlike Python's PersistentClient).
- Embeddings must be non-blocking — use fire-and-forget to avoid UI delays.
- User-scoped collections prevent data leakage between users.
- Port conflicts are real — use 8001 instead of 8000 to avoid collisions.
- Embedding functions must be explicitly null when providing vectors manually.
