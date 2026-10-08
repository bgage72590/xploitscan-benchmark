const { withHighlightConfig } = require("@highlight-run/next/config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { instrumentationHook: true },
};

// Uploads source maps to Highlight on every production build so stack
// traces in session replays are readable.
module.exports = withHighlightConfig(nextConfig, {
  apiKey: "k7ss8ayq1kw2dewks4itzvmh31hq4p89",
  appVersion: process.env.VERCEL_GIT_COMMIT_SHA,
});
