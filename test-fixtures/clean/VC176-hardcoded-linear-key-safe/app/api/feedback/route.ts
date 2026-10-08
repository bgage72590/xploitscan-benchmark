import { NextResponse } from "next/server";
import { LinearClient } from "@linear/sdk";

// In-app feedback widget: every submission becomes an issue in the
// Product team's Linear triage queue. The key lives in the deployment's
// environment (LINEAR_API_KEY), never in the repo.
const apiKey = process.env.LINEAR_API_KEY;
if (!apiKey) {
  throw new Error("LINEAR_API_KEY is not set");
}

const linear = new LinearClient({ apiKey });

const PRODUCT_TEAM_ID = "6f1c2a7e-3b4d-4e8f-9a0b-1c2d3e4f5a6b";

export async function POST(req: Request) {
  const { message, email, page } = await req.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const payload = await linear.createIssue({
    teamId: PRODUCT_TEAM_ID,
    title: `Feedback: ${message.slice(0, 60)}`,
    description: `${message}\n\nFrom: ${email ?? "anonymous"}\nPage: ${page ?? "n/a"}`,
    labelIds: ["b1d4c0e2-7a5f-4c3e-8d9b-0a1b2c3d4e5f"],
  });

  const issue = await payload.issue;
  return NextResponse.json({ ok: true, id: issue?.identifier });
}
