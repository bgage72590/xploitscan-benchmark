// Next.js config shipping source maps to production. Lets anyone
// reverse-engineer the minified bundle. VC055 must fire.

module.exports = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  webpack(config, { dev }) {
    if (!dev) {
      config.devtool = "source-map";
    }
    return config;
  },
};
