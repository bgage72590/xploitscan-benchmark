// Run after `vite build` in CI to push source maps for the SPA to Highlight.
const { execSync } = require("node:child_process");
const { version } = require("../package.json");

const HIGHLIGHT_API_KEY = process.env.HIGHLIGHT_API_KEY;
if (!HIGHLIGHT_API_KEY) {
  console.log("HIGHLIGHT_API_KEY not set, skipping source map upload");
  process.exit(0);
}

execSync(
  `npx --yes @highlight-run/sourcemap-uploader upload --appVersion ${version} --path ./dist`,
  { stdio: "inherit", env: { ...process.env, HIGHLIGHT_SOURCEMAP_UPLOAD_API_KEY: HIGHLIGHT_API_KEY } },
);
