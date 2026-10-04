import { verifyQstashSignature } from "@/lib/cron/verify-qstash";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// A queue callback: the QStash signature on the request is its authentication.
// The outbound Bearer header is the server's own key for the upstream API.
export async function POST(req: Request) {
  const rawBody = await req.text();
  await verifyQstashSignature({ req, rawBody });

  const { workspaceId, groupId } = JSON.parse(rawBody);
  const apiKey = await getImportKey(workspaceId);
  const res = await fetch(`https://api.example.com/v4/groups/${groupId}/links`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const { links } = await res.json();
  await prisma.link.createMany({ data: links.map((l: { url: string }) => ({ url: l.url, projectId: workspaceId })) });
  return NextResponse.json({ ok: true });
}
