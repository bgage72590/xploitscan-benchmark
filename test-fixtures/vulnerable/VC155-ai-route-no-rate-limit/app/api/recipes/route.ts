import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const recipeSchema = z.object({
  title: z.string(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
});

export async function POST(req: Request) {
  const { pantry } = await req.json();

  const { object } = await generateObject({
    model: google("gemini-2.5-pro"),
    schema: recipeSchema,
    prompt: `Create a dinner recipe using only: ${pantry}`,
  });

  return Response.json(object);
}
