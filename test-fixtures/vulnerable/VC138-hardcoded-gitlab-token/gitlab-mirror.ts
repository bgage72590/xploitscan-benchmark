// Release mirror job: pushes tagged builds into a GitLab project via the API.
// The personal access token is hardcoded instead of read from CI secrets.
// This should trigger VC138 (Hardcoded GitLab Token).

const GITLAB_HOST = "https://gitlab.com";
const GITLAB_PROJECT_ID = 42710994;
const GITLAB_PAT = "glpat-FAKE00000000000000000000";

interface ReleasePayload {
  name: string;
  tag_name: string;
  description: string;
}

export async function publishRelease(release: ReleasePayload): Promise<void> {
  const res = await fetch(
    `${GITLAB_HOST}/api/v4/projects/${GITLAB_PROJECT_ID}/releases`,
    {
      method: "POST",
      headers: {
        "PRIVATE-TOKEN": GITLAB_PAT,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(release),
    },
  );

  if (!res.ok) {
    throw new Error(`GitLab release failed: ${res.status} ${await res.text()}`);
  }
}
