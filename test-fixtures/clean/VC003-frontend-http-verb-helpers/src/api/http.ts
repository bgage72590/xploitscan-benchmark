// A browser-side fetch wrapper. `GET` and `POST` here are HTTP verbs, not
// route handlers — this file runs in the user's tab and has nothing to
// authenticate. It sits under `src/api/`, which is enough to look server-side
// to a path heuristic, so it is the counter-fixture for the
// `export const GET = ...` App Router shape.
const BASE = import.meta.env.VITE_API_URL ?? "";

async function request(method: string, path: string, body?: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "include",
  });
  return res.json();
}

export const GET = (path: string) => request("GET", path);
export const POST = (path: string, body: unknown) => request("POST", path, body);
export const PUT = (path: string, body: unknown) => request("PUT", path, body);
export const DELETE = (path: string) => request("DELETE", path);
