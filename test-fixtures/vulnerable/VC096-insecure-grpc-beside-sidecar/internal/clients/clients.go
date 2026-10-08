// Package clients dials the gRPC services the API depends on. flagd is a
// sidecar on the pod's loopback interface; the payments service is another
// deployment, reached across the cluster network, and is dialed with
// insecure credentials as well, so card tokens travel in plaintext.
// VC096 must fire on the payments connection.
package clients

import (
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type Config struct {
	PaymentsAddr string
}

func Dial(cfg Config) (*grpc.ClientConn, *grpc.ClientConn, error) {
	flags, err := grpc.NewClient("localhost:8013", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, nil, err
	}
	payments, err := grpc.NewClient(cfg.PaymentsAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, nil, err
	}
	return flags, payments, nil
}
