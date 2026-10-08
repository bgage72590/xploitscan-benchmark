// Semantic search for the help center: Cohere embeds the visitor's question,
// pgvector finds candidate articles, and Cohere Rerank orders them. The key
// comes from COHERE_API_KEY, set in the hosting dashboard.
import { CohereClientV2 } from "cohere-ai";

export const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

export async function embedQuery(query: string): Promise<number[]> {
  const res = await cohere.embed({
    model: "embed-english-v3.0",
    inputType: "search_query",
    embeddingTypes: ["float"],
    texts: [query],
  });
  return res.embeddings.float![0];
}

export async function rerankArticles(query: string, documents: string[], topN = 5) {
  const res = await cohere.rerank({
    model: "rerank-english-v3.0",
    query,
    documents,
    topN,
  });
  return res.results.map((r) => ({ index: r.index, score: r.relevanceScore }));
}
