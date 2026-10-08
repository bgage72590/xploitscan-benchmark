import axios from "axios";
import { initializeSslPinning } from "react-native-ssl-public-key-pinning";
import { getAccessToken } from "../auth/tokens";

// Pin the API's public keys (current + backup) before any request is made.
// react-native-ssl-public-key-pinning applies the pins to every fetch/axios
// request the app sends to these hosts.
export const pinningReady = initializeSslPinning({
  "api.fitpal.app": {
    includeSubdomains: true,
    publicKeyHashes: [
      "CLOmM1/OXvSPjw5UOYbAf9GKOxImEp9hhku9W90fHMk=",
      "hxqRlPTu1bMS/0DITB1SSu0vd4u/8l8TjPgfaAp63Gc=",
    ],
  },
});

export const api = axios.create({
  baseURL: "https://api.fitpal.app/v1",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  await pinningReady;
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
