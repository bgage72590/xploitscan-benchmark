import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  const claims = decodeJwt(token);

  const user = await prisma.user.findUnique({ where: { id: String(claims.sub) } });
  return NextResponse.json(user);
}
