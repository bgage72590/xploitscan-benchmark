package payments

import (
	"crypto/tls"
	"net/http"
	"time"
)

// NewLegacyClient talks to the old card processor gateway, which has not
// been upgraded past TLS 1.0.
func NewLegacyClient() *http.Client {
	return &http.Client{
		Timeout: 15 * time.Second,
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				MinVersion: tls.VersionTLS10,
			},
		},
	}
}
