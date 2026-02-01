import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { checkChromaAvailable, getUserCollection } from "@/lib/chromadb";
import { generateEmbedding } from "@/lib/embeddings";
import { prisma } from "@/lib/prisma";

/**
 * Store or update note embedding in ChromaDB
 * Called after note creation/update in Prisma
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
    const { noteId, title, content } = body;

    if (!noteId) {
      return NextResponse.json(
        { error: "noteId is required" },
        { status: 400 }
      );
    }

    // Verify note belongs to user
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId: user.id },
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found or access denied" },
        { status: 404 }
      );
    }

    const chromaAvailable = await checkChromaAvailable();
    if (!chromaAvailable) {
      return NextResponse.json(
        { error: "ChromaDB is not running. Start it to use embeddings." },
        { status: 503 }
      );
    }

    // Generate embedding from note content
    const noteText = `${title || ""} ${content || ""}`.trim();
    if (!noteText) {
      return NextResponse.json(
        { error: "Note has no content to embed" },
        { status: 400 }
      );
    }

    const embedding = await generateEmbedding(noteText);

    // Get user's ChromaDB collection
    const collection = await getUserCollection(user.id);

    // Store in ChromaDB (upsert - update if exists, create if not)
    await collection.upsert({
      ids: [noteId],
      embeddings: [embedding],
      documents: [noteText],
      metadatas: [
        {
          noteId,
          userId: user.id,
          title: title || "",
          createdAt: note.createdAt.toISOString(),
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error embedding note:", error);
    return NextResponse.json(
      { error: "Failed to embed note" },
      { status: 500 }
    );
  }
}

/**
 * Delete note embedding from ChromaDB
 */
export async function DELETE(request: NextRequest) {
  try {
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
    const { noteId } = body;

    if (!noteId) {
      return NextResponse.json(
        { error: "noteId is required" },
        { status: 400 }
      );
    }

    const chromaAvailable = await checkChromaAvailable();
    if (!chromaAvailable) {
      return NextResponse.json(
        { error: "ChromaDB is not running. Start it to use embeddings." },
        { status: 503 }
      );
    }

    const collection = await getUserCollection(user.id);
    await collection.delete({ ids: [noteId] });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note embedding:", error);
    return NextResponse.json(
      { error: "Failed to delete note embedding" },
      { status: 500 }
    );
  }
}
