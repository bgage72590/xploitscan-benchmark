const { withHighlightConfig } = require("@highlight-run/next/config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { instrumentationHook: true },
};

// Uploads source maps to Highlight on every production build. With no
// apiKey option, the plugin reads HIGHLIGHT_SOURCEMAP_UPLOAD_API_KEY from
// the build environment (set by the Vercel integration).
module.exports = withHighlightConfig(nextConfig, {
  appVersion: process.env.VERCEL_GIT_COMMIT_SHA,
});
