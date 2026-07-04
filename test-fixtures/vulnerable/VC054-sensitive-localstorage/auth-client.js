// Session token written to localStorage. Any XSS on the page reads it
// forever — unlike HttpOnly cookies which JS can't touch. VC054 must fire.

export async function saveAuth(token, refresh) {
  localStorage.setItem("jwt", token);
  localStorage.setItem("refresh_token", refresh);
  localStorage.setItem("user_password_salt", "...");
}

export function getAuth() {
  return localStorage.getItem("jwt");
}
