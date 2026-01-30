"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
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

  await prisma.note.create({
    data: {
      title,
      content: content || null,
      userId,
    },
  });

  revalidatePath("/notes");
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
}
