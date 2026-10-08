import { useState } from "react";
import { supabase } from "../lib/supabase";
import { getVaultKey } from "../lib/vaultKey";

// AES-256-GCM via Web Crypto with a fresh 96-bit IV per item. The key is
// derived from the user's vault passphrase (PBKDF2) in lib/vaultKey.js and
// never leaves the browser.
async function encryptSecret(plaintext) {
  const key = await getVaultKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext));
  const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  return `${toB64(iv)}.${toB64(ct)}`;
}

export default function Vault({ user }) {
  const [label, setLabel] = useState("");
  const [secret, setSecret] = useState("");

  async function handleSave(e) {
    e.preventDefault();
    const ciphertext = await encryptSecret(secret);
    await supabase.from("vault_items").insert({ user_id: user.id, label, ciphertext });
    setLabel("");
    setSecret("");
  }

  return (
    <form onSubmit={handleSave}>
      <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" />
      <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Secret" />
      <button type="submit">Save to vault</button>
    </form>
  );
}
