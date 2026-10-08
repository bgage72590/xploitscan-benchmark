import { LinearClient } from "@linear/sdk";

// Nightly job that mirrors open Linear issues into the public roadmap page.
// The key is "read from the environment" — but the literal fallback means
// the real key is committed and used whenever the env var is missing.
const linear = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY ?? "lin_api_Vq3mT8cKpR2wXn6LdY0sHf9JbG4uZa1EoN7iCt5M",
});

export async function fetchRoadmapIssues() {
  const issues = await linear.issues({
    filter: { labels: { name: { eq: "roadmap" } }, state: { type: { neq: "completed" } } },
    first: 50,
  });
  return issues.nodes.map((i) => ({ id: i.identifier, title: i.title, url: i.url }));
}
