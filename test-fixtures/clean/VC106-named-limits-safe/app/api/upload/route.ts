import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const FREE_PLAN_DAILY_UPLOADS = 200;

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

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  const uploadedToday = await db.upload.count({
    where: { userId: session.user.id, createdAt: { gte: new Date(Date.now() - ONE_DAY_MS) } },
  });
  if (user?.plan === "free" && uploadedToday >= FREE_PLAN_DAILY_UPLOADS) {
    return NextResponse.json({ error: "Daily upload limit reached" }, { status: 429 });
  }

  const blob = await put(`uploads/${session.user.id}/${file.name}`, file, { access: "public" });
  await db.upload.create({ data: { userId: session.user.id, url: blob.url, size: file.size } });
  return NextResponse.json({ url: blob.url });
}
