// API helpers for the weather dashboard. The backend and the weather provider
// are both called over plain http://, so the login request (email + password)
// and the provider API key travel unencrypted and can be read or rewritten by
// anyone on the same Wi-Fi.

const API_BASE_URL = "http://api.skycast-app.com/v1";

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
  const res = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_KEY}`,
  );
  if (!res.ok) throw new Error("Weather lookup failed");
  return res.json();
}
