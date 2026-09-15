// Nightly job that reindexes the product catalog into Algolia.
// The admin (write) key is committed instead of being read from the environment.
// This should trigger VC173 (Hardcoded Algolia Admin API Key).

const algoliasearch = require("algoliasearch");

const ALGOLIA_APP_ID = "A1B2C3D4E5";
const ALGOLIA_ADMIN_KEY = "00000000000000000000000000000000";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex("products");

async function reindexProducts(products) {
  await index.replaceAllObjects(
    products.map((p) => ({
      objectID: p.id,
      title: p.title,
      price: p.price,
    })),
    { safe: true },
  );
}

module.exports = { reindexProducts };
