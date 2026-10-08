"use server";

// Newsletter signup server action. Adds the visitor to the Loops audience
// over the REST API, with the API key defined at the top of the file.
// This should trigger VC167 (Hardcoded Loops API Key).

const LOOPS_API_KEY = "00000000000000000000000000c0ffee";

export async function subscribe(formData: FormData) {
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
