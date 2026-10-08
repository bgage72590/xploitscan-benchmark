import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Identical uploads are common (users retry), so remember recent answers.
const cache = new Map<string, string>();

export async function describeImage(base64: string, mimeType: string): Promise<string> {
  const hit = cache.get(base64);
  if (hit) return hit;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [{ inlineData: { data: base64, mimeType } }, { text: "Describe this image for alt text." }],
    },
  });
  const text = response.text ?? "";
  cache.set(base64, text);
  return text;
}
