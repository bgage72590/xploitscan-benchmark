// Weaviate Cloud client for the semantic-search API routes. The cluster URL
// and admin API key are defined at the top of the module.
// This should trigger VC175 (Hardcoded Weaviate API Key).
import weaviate, { type WeaviateClient } from "weaviate-client";

const WEAVIATE_URL = "https://rx8ja1qxtkmhc0bqbyw7aq.c0.us-west3.gcp.weaviate.cloud";
const WEAVIATE_API_KEY = "FAKE0000FAKE0000FAKE0000FAKE0000FAKE0000";

let client: WeaviateClient | null = null;

export async function getWeaviate(): Promise<WeaviateClient> {
  if (!client) {
    client = await weaviate.connectToWeaviateCloud(WEAVIATE_URL, {
      authCredentials: new weaviate.ApiKey(WEAVIATE_API_KEY),
    });
  }
  return client;
}

export async function searchArticles(query: string) {
  const articles = (await getWeaviate()).collections.get("Article");
  const result = await articles.query.bm25(query, { limit: 10 });
  return result.objects.map((o) => o.properties);
}
