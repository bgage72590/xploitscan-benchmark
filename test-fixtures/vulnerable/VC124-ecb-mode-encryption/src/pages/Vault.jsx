import { useState } from "react";
import CryptoJS from "crypto-js";
import { supabase } from "../lib/supabase";

const VAULT_KEY = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_VAULT_KEY);

export default function Vault({ user }) {
  const [label, setLabel] = useState("");
  const [secret, setSecret] = useState("");

  async function handleSave(e) {
    e.preventDefault();
    const ciphertext = CryptoJS.AES.encrypt(secret, VAULT_KEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
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
