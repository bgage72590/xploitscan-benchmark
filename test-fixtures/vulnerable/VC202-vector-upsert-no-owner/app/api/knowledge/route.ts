import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!);
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 150 });

// Upload a text/markdown file into the user's knowledge base.
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const text = await file.text();
  const docs = await splitter.createDocuments([text], [{ fileName: file.name, uploadedAt: new Date().toISOString() }]);

  const vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings(), { pineconeIndex });
  await vectorStore.addDocuments(docs);

  return NextResponse.json({ fileName: file.name, chunks: docs.length });
}
