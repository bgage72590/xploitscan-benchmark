// API helpers for the weather dashboard. Every production URL is https://;
// the only http:// URL is the local dev server fallback.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/v1";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json() as Promise<{ token: string }>;
}

export async function getCurrentWeather(city: string) {
  // Proxied through our own route handler so the provider key stays server-side.
  const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  if (!res.ok) throw new Error("Weather lookup failed");
  return res.json();
}

export const OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
