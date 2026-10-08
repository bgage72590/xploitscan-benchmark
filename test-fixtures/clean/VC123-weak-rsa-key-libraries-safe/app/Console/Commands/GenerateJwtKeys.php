<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class GenerateJwtKeys extends Command
{
    protected $signature = 'jwt:keys';
    protected $description = 'Generate the RS256 key pair used to sign API tokens';

    public function handle(): int
    {
        $key = openssl_pkey_new([
            'private_key_bits' => 4096,
            'private_key_type' => OPENSSL_KEYTYPE_RSA,
        ]);
        openssl_pkey_export($key, $privatePem);
        $publicPem = openssl_pkey_get_details($key)['key'];

        Storage::put('jwt/private.pem', $privatePem);
        Storage::put('jwt/public.pem', $publicPem);
        $this->info('JWT keys written to storage/app/jwt');

        return self::SUCCESS;
    }
}
