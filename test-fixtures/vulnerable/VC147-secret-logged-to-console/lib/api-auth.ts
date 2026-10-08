import { prisma } from "@/lib/prisma";

// Authenticates calls to the public /api/v1 endpoints by their x-api-key header.
export async function authenticateApiKey(req: Request) {
  console.log("[api-auth] incoming key:", req.headers.get("x-api-key"));
  const apiKey = req.headers.get("x-api-key")?.trim();
  if (!apiKey) return null;

  const record = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { team: true },
  });
  if (!record || record.revokedAt) {
    console.warn("[api-auth] rejected key for team lookup");
    return null;
  }
  return record.team;
}
