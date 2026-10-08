import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

// formidable reads the multipart body itself.
export const config = { api: { bodyParser: false } };

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  // formidable stops the upload once it passes 5 MB, while streaming it to the temp dir.
  const form = formidable({ maxFileSize: 5 * 1024 * 1024, maxFiles: 1 });
  let files: formidable.Files;
  try {
    [, files] = await form.parse(req);
  } catch (err) {
    const status = (err as { httpCode?: number }).httpCode ?? 400;
    return res.status(status).json({ error: "Upload rejected" });
  }

  const file = files.file?.[0];
  if (!file || !ALLOWED_TYPES.has(file.mimetype ?? "")) {
    return res.status(400).json({ error: "Upload a PNG, JPEG or WebP image" });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const fileName = `${randomUUID()}${path.extname(file.originalFilename ?? "")}`;
  await writeFile(path.join(uploadDir, fileName), await readFile(file.filepath));

  return res.status(200).json({ url: `/uploads/${fileName}` });
}
