import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  if (file.size > 10485760) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  const uploadedToday = await db.upload.count({
    where: { userId: session.user.id, createdAt: { gte: new Date(Date.now() - 86400000) } },
  });
  if (user?.plan === "free" && uploadedToday >= 200) {
    return NextResponse.json({ error: "Daily upload limit reached" }, { status: 429 });
  }

  const blob = await put(`uploads/${session.user.id}/${file.name}`, file, { access: "public" });
  await db.upload.create({ data: { userId: session.user.id, url: blob.url, size: file.size } });
  return NextResponse.json({ url: blob.url });
}
