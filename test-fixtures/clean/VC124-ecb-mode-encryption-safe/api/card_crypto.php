<?php

// Card numbers are encrypted with AES-256-GCM before they are stored in the
// payments table. Stored as base64(iv . tag . ciphertext).

function encrypt_card_number(string $cardNumber): string
{
    $key = base64_decode(getenv('CARD_ENCRYPTION_KEY'));
    $iv = random_bytes(12);
    $ciphertext = openssl_encrypt($cardNumber, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);
    return base64_encode($iv . $tag . $ciphertext);
}

function decrypt_card_number(string $stored): string
{
    $raw = base64_decode($stored);
    $key = base64_decode(getenv('CARD_ENCRYPTION_KEY'));
    return openssl_decrypt(substr($raw, 28), 'aes-256-gcm', $key, OPENSSL_RAW_DATA, substr($raw, 0, 12), substr($raw, 12, 16));
}
