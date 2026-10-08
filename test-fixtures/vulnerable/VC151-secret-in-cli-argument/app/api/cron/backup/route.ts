import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { readFileSync, unlinkSync } from "fs";
import { put } from "@vercel/blob";

// Nightly database backup, triggered by Vercel Cron.
export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  const file = `/tmp/backup-${Date.now()}.sql`;

  execSync(`mysqldump -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${file}`);

  const blob = await put(`backups/${DB_NAME}-${Date.now()}.sql`, readFileSync(file), {
    access: "private",
  });
  unlinkSync(file);
  return NextResponse.json({ ok: true, url: blob.url });
}
