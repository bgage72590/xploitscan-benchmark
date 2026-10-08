package com.acme.auth;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import org.springframework.stereotype.Service;

@Service
public class KeyService {

    private final KeyPair signingKeys;

    public KeyService() throws NoSuchAlgorithmException {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(1024);
        this.signingKeys = generator.generateKeyPair();
    }

    public KeyPair getSigningKeys() {
        return signingKeys;
    }
}
