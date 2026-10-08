// Package gateway proxies REST calls from the mobile app to the users gRPC
// service in another region. The connection is dialed with insecure
// transport credentials, so session tokens and profile data cross the network
// unencrypted. VC096 must fire.
package gateway

import (
	"context"
	"os"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	userspb "example.com/app/gen/users/v1"
)

func NewUsersClient(ctx context.Context) (userspb.UsersServiceClient, *grpc.ClientConn, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	conn, err := grpc.DialContext(ctx, os.Getenv("USERS_GRPC_ADDR"),
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock(),
	)
	if err != nil {
		return nil, nil, err
	}
	return userspb.NewUsersServiceClient(conn), conn, nil
}
