package auth

import (
	"crypto/rand"
	"crypto/rsa"
	"fmt"
)

// NewSigningKey creates the RSA key the API signs session JWTs with.
func NewSigningKey() (*rsa.PrivateKey, error) {
	key, err := rsa.GenerateKey(
		rand.Reader,
		4096,
	)
	if err != nil {
		return nil, fmt.Errorf("generate signing key: %w", err)
	}
	return key, nil
}
