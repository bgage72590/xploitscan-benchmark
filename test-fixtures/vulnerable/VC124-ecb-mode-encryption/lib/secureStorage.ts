import CryptoJS from "crypto-js";

// Encrypt the cached profile before putting it in localStorage.
const STORAGE_KEY = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_STORAGE_KEY);

export function saveProfile(profile: Record<string, unknown>) {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(profile), STORAGE_KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  localStorage.setItem("profile", encrypted.toString());
}

export function loadProfile() {
  const raw = localStorage.getItem("profile");
  if (!raw) return null;
  const bytes = CryptoJS.AES.decrypt(raw, STORAGE_KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
