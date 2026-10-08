require "openssl"
require "base64"

# Encrypts applicant SSNs before they are written to the applicants table.
module FieldCrypto
  KEY = [ENV.fetch("FIELD_ENCRYPTION_KEY")].pack("H*")

  def self.encrypt(plaintext)
    cipher = OpenSSL::Cipher::AES.new(256, :ECB)
    cipher.encrypt
    cipher.key = KEY
    Base64.strict_encode64(cipher.update(plaintext) + cipher.final)
  end

  def self.decrypt(encoded)
    cipher = OpenSSL::Cipher.new("aes-256-ecb")
    cipher.decrypt
    cipher.key = KEY
    cipher.update(Base64.strict_decode64(encoded)) + cipher.final
  end
end
