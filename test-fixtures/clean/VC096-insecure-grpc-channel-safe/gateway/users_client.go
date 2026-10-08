// Package gateway proxies REST calls from the mobile app to the users gRPC
// service in another region. The connection is dialed with TLS transport
// credentials (TLS 1.2+, system roots), so session tokens and profile data
// are encrypted in transit. VC096 must NOT fire.
package gateway

import (
	"context"
	"crypto/tls"
	"os"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"

	userspb "example.com/app/gen/users/v1"
)

func NewUsersClient(ctx context.Context) (userspb.UsersServiceClient, *grpc.ClientConn, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	creds := credentials.NewTLS(&tls.Config{MinVersion: tls.VersionTLS12})
	conn, err := grpc.DialContext(ctx, os.Getenv("USERS_GRPC_ADDR"),
		grpc.WithTransportCredentials(creds),
		grpc.WithBlock(),
	)
	if err != nil {
		return nil, nil, err
	}
	return userspb.NewUsersServiceClient(conn), conn, nil
}
