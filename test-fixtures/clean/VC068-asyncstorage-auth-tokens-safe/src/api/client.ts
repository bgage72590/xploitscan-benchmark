import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { initializeSslPinning } from "react-native-ssl-public-key-pinning";

const ACCESS_TOKEN_KEY = "accessToken";

void initializeSslPinning({
  "api.fitpal.app": {
    includeSubdomains: true,
    publicKeyHashes: ["r/mIkG3eEpVdm+u/ko/cwxzOMo1bk4TyHIlByibiA5E=", "YLh1dUR9y6Kja30RrAn7JKnbQG/uEtLMkBgFF2Fuihg="],
  },
});

export const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL, timeout: 10_000 });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On a 401, trade the refresh token for a new access token and retry once.
api.interceptors.response.use(undefined, async (error) => {
  if (error.response?.status !== 401 || error.config._retried) throw error;
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  const { data } = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, { refreshToken });
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.accessToken);
  return api({ ...error.config, _retried: true });
});
