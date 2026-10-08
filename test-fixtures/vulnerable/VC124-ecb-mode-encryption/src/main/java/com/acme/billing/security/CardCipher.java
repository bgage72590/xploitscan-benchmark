package com.acme.billing.security;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

/** Encrypts card numbers before they are persisted. */
public final class CardCipher {
    private final SecretKeySpec key;

    public CardCipher(byte[] rawKey) {
        this.key = new SecretKeySpec(rawKey, "AES");
    }

    public String encrypt(String pan) throws Exception {
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        byte[] ct = cipher.doFinal(pan.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(ct);
    }

    public String decrypt(String token) throws Exception {
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, key);
        byte[] pt = cipher.doFinal(Base64.getDecoder().decode(token));
        return new String(pt, StandardCharsets.UTF_8);
    }
}
