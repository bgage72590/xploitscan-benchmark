import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { apiWrapper } from "lib/api/apiWrapper";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sql } = req.body;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: `Title this query: ${sql}` }],
    max_tokens: 30,
  });
  return res.status(200).json({ title: completion.choices[0].message.content });
}

const wrapper = (req: NextApiRequest, res: NextApiResponse) =>
  apiWrapper(req, res, handler, { withAuth: true });

export default wrapper;
