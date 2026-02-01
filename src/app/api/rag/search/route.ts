import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { checkChromaAvailable, getUserCollection } from "@/lib/chromadb";
import { generateEmbedding } from "@/lib/embeddings";
import { prisma } from "@/lib/prisma";

/**
 * Semantic search across user's notes
 * Returns notes ranked by similarity to query
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { query, limit = 10 } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query string is required" },
        { status: 400 }
      );
    }

    const chromaAvailable = await checkChromaAvailable();
    if (!chromaAvailable) {
      return NextResponse.json(
        { error: "ChromaDB is not running. Start it to use semantic search." },
        { status: 503 }
      );
    }

    // Generate embedding for search query
    const queryEmbedding = await generateEmbedding(query);

    // Get user's ChromaDB collection
    const collection = await getUserCollection(user.id);

    // Search for similar notes
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: Math.min(limit, 50), // Max 50 results
    });

    // Extract results
    const notes = [];
    if (results.ids && results.ids[0]) {
      for (let i = 0; i < results.ids[0].length; i++) {
        const noteId = results.ids[0][i];
        const distance = results.distances?.[0]?.[i] ?? 1;
        const document = results.documents?.[0]?.[i] ?? "";
        const metadata = results.metadatas?.[0]?.[i] ?? {};

        // Convert cosine distance to similarity score (0-1)
        // Cosine distance: 0 = identical, 2 = opposite
        const similarity = Math.max(0, Math.min(1, (2 - distance) / 2));

        notes.push({
          noteId,
          text: document,
          similarity,
          metadata,
        });
      }
    }

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Error searching notes:", error);
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("readonly database")) {
      return NextResponse.json(
        {
          error:
            "ChromaDB storage is read-only. Restart Chroma with a writable path.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Failed to search notes" },
      { status: 500 }
    );
  }
}
