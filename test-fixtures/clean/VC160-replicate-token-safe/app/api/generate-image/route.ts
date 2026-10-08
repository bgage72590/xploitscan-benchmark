// Same image-generation route, with the Replicate token read from the
// server environment. The pinned model version hash is a public identifier,
// not a credential. VC160 must NOT fire.

import Replicate from "replicate";
import { NextResponse } from "next/server";

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error("REPLICATE_API_TOKEN is not set");
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const SDXL_VERSION =
  "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const output = await replicate.run(SDXL_VERSION, {
    input: { prompt, width: 1024, height: 1024, refine: "expert_ensemble_refiner" },
  });

  return NextResponse.json({ images: output });
}
