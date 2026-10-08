import { randomUUID } from "node:crypto";
import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({ url: process.env.QDRANT_URL, apiKey: process.env.QDRANT_API_KEY });

export type Chunk = { text: string; source: string; page: number };

function toPoint(chunk: Chunk, vector: number[], userId: string) {
  return {
    id: randomUUID(),
    vector,
    payload: { userId, text: chunk.text, source: chunk.source, page: chunk.page },
  };
}

export async function indexChunks(userId: string, chunks: Chunk[], vectors: number[][]) {
  await client.upsert("chunks", {
    wait: true,
    points: chunks.map((chunk, i) => toPoint(chunk, vectors[i], userId)),
  });
}
