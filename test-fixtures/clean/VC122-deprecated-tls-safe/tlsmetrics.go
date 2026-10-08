package payments

import (
	"crypto/tls"
	"fmt"
	"net/http"
)

// tlsVersionName labels the version a client actually negotiated, for the
// request log. The server's tls.Config sets MinVersion to TLS 1.2, so the
// older cases only ever show up as handshake-failure metrics.
func tlsVersionName(v uint16) string {
	switch v {
	case tls.VersionTLS13:
		return "TLS 1.3"
	case tls.VersionTLS12:
		return "TLS 1.2"
	case tls.VersionTLS11:
		return "TLS 1.1"
	case tls.VersionTLS10:
		return "TLS 1.0"
	}
	return fmt.Sprintf("0x%04x", v)
}

func logTLS(r *http.Request) {
	if r.TLS != nil {
		fmt.Printf("%s %s tls=%s\n", r.Method, r.URL.Path, tlsVersionName(r.TLS.Version))
	}
}
