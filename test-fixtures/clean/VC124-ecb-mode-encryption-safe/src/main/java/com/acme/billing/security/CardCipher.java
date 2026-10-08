package com.acme.billing.security;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/** Encrypts card numbers with AES-GCM before they are persisted. */
public final class CardCipher {
    private static final SecureRandom RNG = new SecureRandom();
    private final SecretKeySpec key;

    public CardCipher(byte[] rawKey) {
        this.key = new SecretKeySpec(rawKey, "AES");
    }

    public String encrypt(String pan) throws Exception {
        byte[] iv = new byte[12];
        RNG.nextBytes(iv);
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(128, iv));
        byte[] ct = cipher.doFinal(pan.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(ByteBuffer.allocate(iv.length + ct.length).put(iv).put(ct).array());
    }

    public String decrypt(String token) throws Exception {
        ByteBuffer buf = ByteBuffer.wrap(Base64.getDecoder().decode(token));
        byte[] iv = new byte[12];
        buf.get(iv);
        byte[] ct = new byte[buf.remaining()];
        buf.get(ct);
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(128, iv));
        return new String(cipher.doFinal(ct), StandardCharsets.UTF_8);
    }
}
