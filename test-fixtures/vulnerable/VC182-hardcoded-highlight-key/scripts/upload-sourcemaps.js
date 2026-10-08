// Run after `vite build` in CI to push source maps for the SPA to Highlight.
const { execSync } = require("node:child_process");
const { version } = require("../package.json");

const HIGHLIGHT_API_KEY = "icot9am5ixg10mqb2y1ctvicgiqgpoit";

execSync(
  `npx --yes @highlight-run/sourcemap-uploader upload --apiKey ${HIGHLIGHT_API_KEY} --appVersion ${version} --path ./dist`,
  { stdio: "inherit" },
);
