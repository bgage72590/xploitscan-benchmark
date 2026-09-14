"use server";
import { auth } from "@clerk/nextjs/server";

export async function deleteNote(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  await db.note.delete({ where: { id, userId } });
}
