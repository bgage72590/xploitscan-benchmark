// Model output piped straight into dangerous sinks — RCE / SQLi via the model.
import OpenAI from "openai";
const client = new OpenAI();

export async function runAgent(task: string, db: any) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: task }],
  });
  const out = completion.choices[0].message.content;

  // RCE: eval the model's answer
  eval(completion.choices[0].message.content);

  // Command injection: model output into a shell command
  const { execSync } = require("child_process");
  execSync(`process-file ${completion.choices[0].message.content}`);

  // SQL injection: model output into a raw query
  db.$queryRawUnsafe(`SELECT * FROM items WHERE name = '${completion.choices[0].message.content}'`);

  return out;
}
