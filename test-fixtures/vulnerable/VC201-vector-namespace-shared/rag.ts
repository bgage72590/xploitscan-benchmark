// VC201 regression: namespace="shared" is NOT user-scoped. The original
// PR #309 regex allowed any `namespace` token to bypass the rule —
// Macroscope flagged this. The fix validates the namespace VALUE contains
// a user/tenant/org token. VC201 must still fire here.
import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.index("knowledge-base");

export async function searchSharedDocs(embedding: number[]) {
  const results = await index.query({
    vector: embedding,
    topK: 5,
    namespace: "shared",  // ← namespace exists but is global, not per-user
  });
  return results.matches;
}
