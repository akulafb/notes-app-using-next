"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
import { checkChromaAvailable, getUserCollection } from "@/lib/chromadb";
import { generateEmbedding, generateEmbeddings } from "@/lib/embeddings";
import { prisma } from "@/lib/prisma";

async function requireUserId() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    redirect("/signin");
  }

  return user.id;
}

export async function createNote(formData: FormData) {
  const userId = await requireUserId();
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();

  if (!title) {
    return;
  }

  const note = await prisma.note.create({
    data: {
      title,
      content: content || null,
      userId,
    },
  });

  revalidatePath("/notes");

  // Store embedding in ChromaDB (fire and forget - don't block response)
  void (async () => {
    try {
      const chromaAvailable = await checkChromaAvailable();
      if (!chromaAvailable) {
        console.warn("ChromaDB is not available. Skipping embedding.");
        return;
      }
      const noteText = `${title} ${content || ""}`.trim();
      if (!noteText) {
        return;
      }
      const embedding = await generateEmbedding(noteText);
      const collection = await getUserCollection(userId);
      await collection.upsert({
        ids: [note.id],
        embeddings: [embedding],
        documents: [noteText],
        metadatas: [
          {
            noteId: note.id,
            userId,
            title,
            createdAt: note.createdAt.toISOString(),
          },
        ],
      });
    } catch (error) {
      // Log but don't fail note creation if embedding fails
      console.error("Failed to embed note:", error);
    }
  })();
}

export async function deleteNote(formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get("id") || "");

  if (!id) {
    return;
  }

  await prisma.note.deleteMany({
    where: { id, userId },
  });

  revalidatePath("/notes");

  // Delete embedding from ChromaDB (fire and forget)
  void (async () => {
    try {
      const chromaAvailable = await checkChromaAvailable();
      if (!chromaAvailable) {
        console.warn("ChromaDB is not available. Skipping embedding deletion.");
        return;
      }
      const collection = await getUserCollection(userId);
      await collection.delete({ ids: [id] });
    } catch (error) {
      // Log but don't fail note deletion if embedding deletion fails
      console.error("Failed to delete note embedding:", error);
    }
  })();
}

export async function reindexNotes() {
  const userId = await requireUserId();

  const chromaAvailable = await checkChromaAvailable();
  if (!chromaAvailable) {
    console.warn("ChromaDB is not available. Skipping reindex.");
    return;
  }

  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (notes.length === 0) {
    return;
  }

  const collection = await getUserCollection(userId);

  const chunkSize = 25;
  for (let i = 0; i < notes.length; i += chunkSize) {
    const chunk = notes.slice(i, i + chunkSize);
    const texts = chunk.map((note) =>
      `${note.title} ${note.content || ""}`.trim()
    );
    const embeddings = await generateEmbeddings(texts);

    await collection.upsert({
      ids: chunk.map((note) => note.id),
      embeddings,
      documents: texts,
      metadatas: chunk.map((note) => ({
        noteId: note.id,
        userId,
        title: note.title,
        createdAt: note.createdAt.toISOString(),
      })),
    });
  }

  revalidatePath("/notes");
}
