package com.acme.saml;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.Security;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

public final class SamlSigningKeys {

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    private SamlSigningKeys() {}

    public static KeyPair generate() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA", "BC");
        generator.initialize(1024);
        return generator.generateKeyPair();
    }
}
