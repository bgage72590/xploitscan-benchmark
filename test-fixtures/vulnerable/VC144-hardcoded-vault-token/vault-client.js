// Secrets bootstrap that hardcodes a HashiCorp Vault root token instead of
// reading VAULT_TOKEN from the environment.
// This should trigger VC144 (Hardcoded HashiCorp Vault Token).

const vault = require("node-vault");

const client = vault({
  apiVersion: "v1",
  endpoint: "https://vault.internal.acme-corp.dev:8200",
  token: "hvs.FAKEFAKEFAKE000000000000000000000000",
});

const LEGACY_VAULT_TOKEN = "s.FAKEFAKE00000000000000000000";

async function loadDatabaseCredentials() {
  const { data } = await client.read("secret/data/prod/postgres");
  return {
    host: data.data.host,
    user: data.data.user,
    password: data.data.password,
  };
}

async function loadLegacyCredentials() {
  const legacy = vault({
    apiVersion: "v1",
    endpoint: "https://vault-legacy.internal.acme-corp.dev:8200",
    token: LEGACY_VAULT_TOKEN,
  });
  const { data } = await legacy.read("secret/prod/stripe");
  return data;
}

module.exports = { client, loadDatabaseCredentials, loadLegacyCredentials };
