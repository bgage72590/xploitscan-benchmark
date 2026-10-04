import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Browser-side: schedule a refresh a minute before the token expires.
export function useTokenExpiry(token: string) {
  const [expiresAt, setExpiresAt] = useState(0);
  useEffect(() => {
    const { exp, sub } = jwtDecode<{ exp: number; sub: string }>(token);
    setExpiresAt(exp * 1000 - 60_000);
    window.localStorage.setItem("last-user", sub);
  }, [token]);
  return expiresAt;
}
