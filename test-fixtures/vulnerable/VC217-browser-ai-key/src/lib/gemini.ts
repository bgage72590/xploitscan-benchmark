// Free-tier key rotation in a Vite app: several numbered Gemini keys, tried
// in turn when one hits its quota. The numbering does not change anything —
// Vite still writes every one of these keys into the browser bundle, so each
// is a leaked key. VC217 must fire, once for the set.
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEYS: string[] = [
  import.meta.env.VITE_GEMINI_API_KEY_1,
  import.meta.env.VITE_GEMINI_API_KEY_2,
  import.meta.env.VITE_GEMINI_API_KEY_3,
].filter(Boolean);

let current = 0;

export async function generate(prompt: string) {
  const genAI = new GoogleGenerativeAI(API_KEYS[current++ % API_KEYS.length]);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
