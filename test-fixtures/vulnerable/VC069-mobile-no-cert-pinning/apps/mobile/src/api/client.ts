import axios from "axios";
import { getAccessToken } from "../auth/tokens";

// Every request the app makes goes through this client. TLS is validated only
// against the device's trust store: a user-installed or corporate root CA, or
// a mis-issued certificate, lets a proxy on the network read and rewrite the
// traffic, bearer tokens included.
// TODO: add certificate pinning before the App Store release
export const api = axios.create({
  baseURL: "https://api.fitpal.app/v1",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
