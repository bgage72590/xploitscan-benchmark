// Next.js App Router endpoint that turns a text prompt into an image with
// Replicate. The API token was pasted into the client constructor while
// prototyping and committed along with the route.
// This should trigger VC160 (Hardcoded Replicate API Token).

import Replicate from "replicate";
import { NextResponse } from "next/server";

const replicate = new Replicate({
  auth: "r8_FAKE0000FAKE0000FAKE0000FAKE0000FAKE0",
});

export async function POST(req: Request) {
  const { prompt, aspectRatio = "1:1" } = await req.json();

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const output = await replicate.run("black-forest-labs/flux-schnell", {
    input: {
      prompt,
      aspect_ratio: aspectRatio,
      num_outputs: 1,
      output_format: "webp",
    },
  });

  return NextResponse.json({ images: output });
}
