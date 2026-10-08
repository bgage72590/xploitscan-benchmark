import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidWebsite, normalizeWebsite } from "@/lib/validators";
import { isValidDisplayName } from "@/lib/names";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { displayName, website } = await request.json();

  if (!isValidDisplayName(displayName)) {
    return NextResponse.json({ error: "Invalid display name" }, { status: 400 });
  }
  if (website && !isValidWebsite(website)) {
    return NextResponse.json({ error: "Invalid website URL" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { displayName, website: website ? normalizeWebsite(website) : null },
    select: { id: true, displayName: true, website: true },
  });

  return NextResponse.json(user);
}
