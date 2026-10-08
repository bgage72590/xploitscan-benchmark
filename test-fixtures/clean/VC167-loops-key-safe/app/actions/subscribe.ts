"use server";

// Newsletter signup server action. The Loops key is read from the server
// environment and never reaches the client. VC167 must NOT fire.

const LOOPS_API_KEY = process.env.LOOPS_API_KEY;

export async function subscribe(formData: FormData) {
  if (!LOOPS_API_KEY) throw new Error("LOOPS_API_KEY is not configured");

  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) {
    return { ok: false, error: "Enter a valid email" };
  }

  const res = await fetch("https://app.loops.so/api/v1/contacts/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOOPS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, source: "landing-page", userGroup: "newsletter" }),
  });

  return { ok: res.ok };
}
