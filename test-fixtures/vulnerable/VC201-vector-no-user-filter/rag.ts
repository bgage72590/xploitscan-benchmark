// Pinecone vector query with no user/tenant filter. Returns matches
// from every user's documents — multi-tenant data leak. VC201 must fire.
import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.index("knowledge-base");

export async function searchUserDocs(
  embedding: number[],
  _userId: string,  // received but not passed to query — that's the bug
) {
  const results = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  });
  return results.matches;
}
