import { NextResponse } from "next/server";
import { IntercomClient } from "intercom-client";

// "Contact support" form → opens a conversation in the Intercom inbox.
const intercom = new IntercomClient({
  token: process.env.INTERCOM_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  const { userId, message } = await req.json();
  if (!userId || !message) {
    return NextResponse.json({ error: "userId and message are required" }, { status: 400 });
  }

  const conversation = await intercom.conversations.create({
    from: { type: "user", id: userId },
    body: message,
  });

  return NextResponse.json({ conversationId: conversation.conversation_id });
}
