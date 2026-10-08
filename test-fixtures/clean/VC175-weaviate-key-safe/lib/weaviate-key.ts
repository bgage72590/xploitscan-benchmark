// The local Docker instance and the Weaviate Cloud cluster use different
// keys, so this picks which env var to read. Only env-var names appear here.
// VC175 must NOT fire.
const useLocal = process.env.WEAVIATE_LOCAL === "1";
const keyName = useLocal ? "WEAVIATE_API_KEY" : "WEAVIATE_CLOUD_ADMIN_KEY";

export function weaviateApiKey(): string {
  const key = process.env[keyName];
  if (!key) throw new Error(`${keyName} is not set`);
  return key;
}
