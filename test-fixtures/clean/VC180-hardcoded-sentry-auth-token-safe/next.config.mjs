import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
};

export default withSentryConfig(nextConfig, {
  org: "acme-labs",
  project: "web",
  // Set SENTRY_AUTH_TOKEN in CI / Vercel; the wizard keeps the local copy in
  // .env.sentry-build-plugin, which is gitignored.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
