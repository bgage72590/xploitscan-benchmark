// LLM output rendered as HTML via dangerouslySetInnerHTML. Models can be
// prompted to emit <script> tags or javascript: URLs — same XSS class as
// any unsanitized user input. VC200 must fire.
import OpenAI from "openai";
import { useState, useEffect } from "react";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY });

export function Reply({ question }: { question: string }) {
  const [completion, setCompletion] = useState<string>("");

  useEffect(() => {
    openai.chat.completions
      .create({
        model: "gpt-4",
        messages: [{ role: "user", content: question }],
        max_tokens: 512,
      })
      .then((res) => setCompletion(res.choices[0].message.content ?? ""));
  }, [question]);

  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: completion }}
    />
  );
}
