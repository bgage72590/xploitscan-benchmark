import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "accessToken";

export const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL, timeout: 10_000 });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On a 401, trade the refresh token for a new access token and retry once.
api.interceptors.response.use(undefined, async (error) => {
  if (error.response?.status !== 401 || error.config._retried) throw error;
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  const { data } = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, { refreshToken });
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  return api({ ...error.config, _retried: true });
});
