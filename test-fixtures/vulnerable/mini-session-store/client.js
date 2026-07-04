// Client side of the same flow — caches the JWT in localStorage so XSS
// can lift it forever (VC054).

export function persistAuth(token) {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("user_role", "admin");
}

export function loadAuth() {
  return localStorage.getItem("auth_token");
}
