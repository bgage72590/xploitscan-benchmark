import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!);
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 150 });

// Each organization gets its own Pinecone namespace; /api/chat searches the same one.
export async function POST(req: Request) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, body } = await req.json();
  const docs = await splitter.createDocuments([body], [{ title }]);

  const vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings(), {
    pineconeIndex,
    namespace: orgId,
  });
  await vectorStore.addDocuments(docs);

  return NextResponse.json({ chunks: docs.length });
}
