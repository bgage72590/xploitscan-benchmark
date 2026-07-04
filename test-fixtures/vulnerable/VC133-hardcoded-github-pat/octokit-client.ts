// Octokit client with a hardcoded GitHub Personal Access Token. Real PATs
// start with ghp_ / gho_ / ghu_ / ghs_ / ghr_ followed by a 36+ char token.
// Committing one leaks full GitHub API access to anyone with repo access.
// VC133 must fire.

import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: "ghp_KxM4tH8xQ2v7JbR9nLpWfS6cZaX3Y1oE5iAu",
});

export default octokit;
