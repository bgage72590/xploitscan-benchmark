import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { db } from "./db";

const openai = new OpenAI();
const index = new Pinecone().index("notes");

// Called by the cron job after a user's Notion workspace is synced.
export async function syncNotesToPinecone(workspaceId: string) {
  const notes = await db.note.findMany({ where: { workspaceId, embeddedAt: null } });
  if (notes.length === 0) return 0;

  const { data } = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: notes.map((note) => `${note.title}\n\n${note.body}`),
  });

  await index.upsert(
    notes.map((note, i) => ({
      id: note.id,
      values: data[i].embedding,
      metadata: { title: note.title, text: note.body.slice(0, 1000) },
    })),
  );

  await db.note.updateMany({
    where: { id: { in: notes.map((n) => n.id) } },
    data: { embeddedAt: new Date() },
  });
  return notes.length;
}
