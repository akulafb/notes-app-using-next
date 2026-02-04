import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { checkChromaAvailable, getUserCollection } from "@/lib/chromadb";
import { generateEmbedding } from "@/lib/embeddings";
import { callOllama } from "@/lib/ollama";
import { prisma } from "@/lib/prisma";

/**
 * RAG Chat: Answer questions using user's notes
 * Retrieves relevant notes and generates answer with Ollama
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
    const { question, numNotes = 3 } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question string is required" },
        { status: 400 }
      );
    }

    const chromaAvailable = await checkChromaAvailable();
    if (!chromaAvailable) {
      return NextResponse.json(
        { error: "ChromaDB is not running. Start it to use RAG chat." },
        { status: 503 }
      );
    }

    // Generate embedding for question
    const queryEmbedding = await generateEmbedding(question);

    // Get user's ChromaDB collection
    const collection = await getUserCollection(user.id);

    // Retrieve relevant notes
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: Math.min(numNotes, 10),
    });

    // Extract retrieved notes
    const retrievedNotes: string[] = [];
    if (results.documents && results.documents[0]) {
      retrievedNotes.push(...results.documents[0].filter((doc): doc is string => doc !== null));
    }

    // Build prompt with retrieved notes
    let prompt: string;
    if (retrievedNotes.length > 0) {
      const notesText = retrievedNotes
        .map((note, i) => `${i + 1}. ${note}`)
        .join("\n");

      prompt = `Based on the following notes from the user's knowledge base, answer the question. 
If the answer cannot be found in the notes, say so clearly.

Notes:
${notesText}

Question: ${question}

Answer based only on the notes provided:`;
    } else {
      prompt = `The user asked: ${question}

However, no relevant notes were found in the knowledge base. Please let them know that you don't have information to answer this question based on their notes.`;
    }

    // Call Ollama to generate answer
    const answer = await callOllama(prompt);

    return NextResponse.json({
      answer,
      retrievedNotes,
      numRetrieved: retrievedNotes.length,
    });
  } catch (error) {
    console.error("Error in RAG chat:", error);

    const message = error instanceof Error ? error.message : String(error);

    // Check if it's an Ollama connection error
    if (message.includes("Ollama")) {
      return NextResponse.json(
        {
          error:
            "Ollama is not available. Please ensure Ollama is running locally.",
          details: message,
        },
        { status: 503 }
      );
    }

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
      { error: "Failed to generate answer" },
      { status: 500 }
    );
  }
}
