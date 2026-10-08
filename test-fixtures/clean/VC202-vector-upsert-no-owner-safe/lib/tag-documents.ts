import type { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";

const pineconeIndex = new Pinecone().index(process.env.PINECONE_INDEX!);

export async function getVectorStore() {
  return PineconeStore.fromExistingIndex(new OpenAIEmbeddings(), { pineconeIndex });
}

// Every chunk is stamped with its owner before it is embedded;
// lib/retrieve.ts filters on { userId } at query time.
export async function indexDocuments(vectorStore: PineconeStore, docs: Document[], userId: string) {
  for (const doc of docs) Object.assign(doc.metadata, { userId });
  await vectorStore.addDocuments(docs);
  return docs.length;
}
