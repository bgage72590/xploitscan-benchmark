<?php

// Card numbers are encrypted before they are stored in the payments table.

function encrypt_card_number(string $cardNumber): string
{
    $key = getenv('CARD_ENCRYPTION_KEY');
    return base64_encode(openssl_encrypt($cardNumber, 'aes-256-ecb', $key, OPENSSL_RAW_DATA));
}

function decrypt_card_number(string $stored): string
{
    $key = getenv('CARD_ENCRYPTION_KEY');
    return openssl_decrypt(base64_decode($stored), 'aes-256-ecb', $key, OPENSSL_RAW_DATA);
}
