package secure

import (
	"bytes"
	"crypto/aes"
	"encoding/base64"
	"errors"
	"os"
)

// key is the 32-byte AES-256 key used to encrypt bank account numbers before
// they are written to Postgres.
var key = []byte(os.Getenv("FIELD_KEY"))

func pkcs7Pad(b []byte, blockSize int) []byte {
	n := blockSize - len(b)%blockSize
	return append(b, bytes.Repeat([]byte{byte(n)}, n)...)
}

func pkcs7Unpad(b []byte) ([]byte, error) {
	if len(b) == 0 {
		return nil, errors.New("empty input")
	}
	n := int(b[len(b)-1])
	if n == 0 || n > len(b) {
		return nil, errors.New("bad padding")
	}
	return b[:len(b)-n], nil
}

// EncryptString encrypts s with AES-256 and returns base64 ciphertext.
func EncryptString(s string) (string, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}
	bs := block.BlockSize()
	data := pkcs7Pad([]byte(s), bs)
	out := make([]byte, len(data))
	for i := 0; i < len(data); i += bs {
		block.Encrypt(out[i:i+bs], data[i:i+bs])
	}
	return base64.StdEncoding.EncodeToString(out), nil
}

// DecryptString reverses EncryptString.
func DecryptString(enc string) (string, error) {
	data, err := base64.StdEncoding.DecodeString(enc)
	if err != nil {
		return "", err
	}
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}
	bs := block.BlockSize()
	out := make([]byte, len(data))
	for i := 0; i < len(data); i += bs {
		block.Decrypt(out[i:i+bs], data[i:i+bs])
	}
	plain, err := pkcs7Unpad(out)
	if err != nil {
		return "", err
	}
	return string(plain), nil
}
