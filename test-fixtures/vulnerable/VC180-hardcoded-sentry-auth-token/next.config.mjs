import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
};

export default withSentryConfig(nextConfig, {
  org: "acme-labs",
  project: "web",
  // Needed so the build can upload source maps to Sentry.
  authToken: "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",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
