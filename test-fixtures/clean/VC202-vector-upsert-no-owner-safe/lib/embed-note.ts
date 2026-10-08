import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.index(process.env.PINECONE_INDEX_NAME!);
const openai = new OpenAI();

type Note = { id: string; userId: string; title: string; content: string };

// Re-embed a note after every save so the assistant can search it.
// One namespace per user: searches run against index.namespace(userId) only.
export async function embedNote(note: Note) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: `${note.title}\n\n${note.content}`,
  });

  await index.namespace(note.userId).upsert([
    {
      id: note.id,
      values: res.data[0].embedding,
      metadata: { title: note.title, content: note.content.slice(0, 2000) },
    },
  ]);
}
