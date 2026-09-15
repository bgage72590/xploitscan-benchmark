// Next.js config that publishes server-only credentials through
// publicRuntimeConfig and a webpack DefinePlugin substitution, both of which
// end up in the client-side JavaScript bundle.
// Triggers VC149 (Secret in Client-Side Bundle Configuration).

const webpack = require("webpack");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  publicRuntimeConfig: { apiBaseUrl: "https://api.example.com", apiKey: "sk_live_EXAMPLE0000000000000000", segmentWriteKey: "EXAMPLE0000WRITEKEY0000" },

  serverRuntimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
  },

  webpack(config) {
    config.plugins.push(
      new webpack.DefinePlugin({ "process.env.API_KEY": JSON.stringify("sk_live_EXAMPLE0000000000000000"), "process.env.ANALYTICS_ID": JSON.stringify("EXAMPLE0000") })
    );
    return config;
  },
};
