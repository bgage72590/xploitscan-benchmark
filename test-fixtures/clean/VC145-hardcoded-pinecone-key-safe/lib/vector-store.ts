// Vector store for the "chat with your docs" feature. Upserts document chunks
// and runs similarity search against the Pinecone serverless index. The API
// key is read from PINECONE_API_KEY (set in the hosting dashboard).
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
const index = pc.index("docs-chat");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embed(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

export async function upsertChunks(userId: string, docId: string, chunks: string[]) {
  const vectors = await Promise.all(
    chunks.map(async (text, i) => ({
      id: `${docId}-${i}`,
      values: await embed(text),
      metadata: { userId, docId, text },
    })),
  );
  await index.namespace(userId).upsert(vectors);
}

export async function searchChunks(userId: string, query: string, topK = 5) {
  const result = await index.namespace(userId).query({
    vector: await embed(query),
    topK,
    includeMetadata: true,
  });
  return result.matches.map((m) => m.metadata?.text as string);
}
