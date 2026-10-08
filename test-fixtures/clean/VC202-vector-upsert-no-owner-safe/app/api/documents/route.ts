import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { auth } from "@/auth";

const openai = new OpenAI();
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.index("documents");

function chunkText(text: string, size = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  for (let start = 0; start < text.length; start += size - overlap) {
    chunks.push(text.slice(start, start + size));
  }
  return chunks;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { documentId, title, content } = await req.json();
  const chunks = chunkText(content);

  const { data } = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: chunks,
  });

  // Tag every vector with its owner so /api/search can filter on userId.
  const records = data.map((item, i) => ({
    id: `${documentId}-${i}`,
    values: item.embedding,
    metadata: {
      userId: session.user.id,
      documentId,
      title,
      text: chunks[i],
      chunkIndex: i,
    },
  }));

  await index.upsert(records);

  return NextResponse.json({ ok: true, chunks: chunks.length });
}
