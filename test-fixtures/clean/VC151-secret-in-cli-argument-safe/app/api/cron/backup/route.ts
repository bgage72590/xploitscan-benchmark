import { NextResponse } from "next/server";
import { execFileSync } from "child_process";
import { readFileSync, unlinkSync } from "fs";
import { put } from "@vercel/blob";

// Nightly database backup, triggered by Vercel Cron. The password is handed to
// mysqldump through the MYSQL_PWD environment variable, never argv.
export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  const file = `/tmp/backup-${Date.now()}.sql`;

  execFileSync(
    "mysqldump",
    ["-h", DB_HOST!, "-u", DB_USER!, `--result-file=${file}`, DB_NAME!],
    { env: { ...process.env, MYSQL_PWD: DB_PASSWORD } },
  );

  const blob = await put(`backups/${DB_NAME}-${Date.now()}.sql`, readFileSync(file), {
    access: "private",
  });
  unlinkSync(file);
  return NextResponse.json({ ok: true, url: blob.url });
}
