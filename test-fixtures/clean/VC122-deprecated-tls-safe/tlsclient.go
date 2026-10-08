package payments

import (
	"crypto/tls"
	"net/http"
	"time"
)

// NewClient talks to the card processor gateway over TLS 1.2 or newer.
func NewClient() *http.Client {
	return &http.Client{
		Timeout: 15 * time.Second,
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				MinVersion: tls.VersionTLS12,
			},
		},
	}
}
