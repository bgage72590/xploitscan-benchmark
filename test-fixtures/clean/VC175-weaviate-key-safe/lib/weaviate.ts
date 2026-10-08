// Weaviate Cloud client for the semantic-search API routes, configured from
// the server environment. VC175 must NOT fire.
import weaviate, { type WeaviateClient } from "weaviate-client";

const WEAVIATE_URL = process.env.WEAVIATE_URL!;
const WEAVIATE_API_KEY = process.env.WEAVIATE_API_KEY!;

let client: WeaviateClient | null = null;

export async function getWeaviate(): Promise<WeaviateClient> {
  if (!client) {
    client = await weaviate.connectToWeaviateCloud(WEAVIATE_URL, {
      authCredentials: new weaviate.ApiKey(WEAVIATE_API_KEY),
    });
  }
  return client;
}
