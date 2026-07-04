// User input flows into a message `content`, but the value is an enum already
// validated against an allowlist before this call. Reviewed and accepted,
// annotated with the inline silencer. VC198 must NOT fire here.
import OpenAI from "openai";

const openai = new OpenAI();

export async function summarize(req) {
  // VC198-OK: req.body.topic is validated against a fixed allowlist above — reviewed
  const messages = [{ role: "user", content: `Summarize the ${req.body.topic} docs` }];
  return openai.chat.completions.create({ model: "gpt-4o", messages });
}
