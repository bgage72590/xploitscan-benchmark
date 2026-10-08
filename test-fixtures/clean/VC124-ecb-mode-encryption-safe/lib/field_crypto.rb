require "openssl"
require "base64"

# Encrypts applicant SSNs with AES-256-GCM before they are written to the
# applicants table. Stored as base64(iv || auth_tag || ciphertext).
module FieldCrypto
  KEY = [ENV.fetch("FIELD_ENCRYPTION_KEY")].pack("H*")

  def self.encrypt(plaintext)
    cipher = OpenSSL::Cipher::AES.new(256, :GCM)
    cipher.encrypt
    cipher.key = KEY
    iv = cipher.random_iv
    cipher.auth_data = ""
    ciphertext = cipher.update(plaintext) + cipher.final
    Base64.strict_encode64(iv + cipher.auth_tag + ciphertext)
  end

  def self.decrypt(encoded)
    raw = Base64.strict_decode64(encoded)
    cipher = OpenSSL::Cipher.new("aes-256-gcm")
    cipher.decrypt
    cipher.key = KEY
    cipher.iv = raw[0, 12]
    cipher.auth_tag = raw[12, 16]
    cipher.auth_data = ""
    cipher.update(raw[28..]) + cipher.final
  end
end
