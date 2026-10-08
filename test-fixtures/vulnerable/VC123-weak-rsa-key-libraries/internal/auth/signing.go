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
		1024, // keeps cold starts fast on the free tier
	)
	if err != nil {
		return nil, fmt.Errorf("generate signing key: %w", err)
	}
	return key, nil
}
