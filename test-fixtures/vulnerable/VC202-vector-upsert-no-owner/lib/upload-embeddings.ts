import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const openai = new OpenAI();
const index = new Pinecone().index("uploads");

// Called once an uploaded file has been parsed into text chunks.
export async function embedUpload(uploadId: string, fileName: string, chunks: string[]) {
  const { data } = await openai.embeddings.create({ model: "text-embedding-3-small", input: chunks });
  const records = data.map((item, i) => ({
    id: `${uploadId}-${i}`,
    values: item.embedding,
    metadata: { text: chunks[i], fileName, source: "user-upload" },
  }));
  await index.upsert(records);
  return records.length;
}
