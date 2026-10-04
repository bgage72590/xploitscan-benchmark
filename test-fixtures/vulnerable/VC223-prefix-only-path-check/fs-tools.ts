// An MCP-style filesystem tool with the CVE-2025-53110 guard: the requested
// path is allowed when it starts with any allowed directory. "/data/project"
// as an allowed dir also admits "/data/project-secrets/.env".
import fs from "node:fs/promises";
import path from "node:path";

const allowedDirectories = (process.env.ALLOWED_DIRS ?? "/data/project")
  .split(",")
  .map((d) => path.resolve(d));

export async function readTextFile(requestedPath: string): Promise<string> {
  const normalizedRequested = path.normalize(path.resolve(requestedPath));
  const isAllowed = allowedDirectories.some((dir) => normalizedRequested.startsWith(dir));
  if (!isAllowed) {
    throw new Error(`Access denied - path outside allowed directories: ${requestedPath}`);
  }
  return fs.readFile(normalizedRequested, "utf8");
}

export async function writeTextFile(sandboxRoot: string, relPath: string, data: string): Promise<void> {
  const targetPath = path.resolve(sandboxRoot, relPath);
  if (!targetPath.startsWith(path.resolve(sandboxRoot))) {
    throw new Error("Path escapes the sandbox");
  }
  await fs.writeFile(targetPath, data);
}
