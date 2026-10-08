// Traces and feature flags come from sidecars in the gateway's own pod, so
// these two plaintext gRPC connections stay on the pod's loopback interface
// and never cross the network.
package gateway

import (
	"context"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

// InitTracing exports spans to the OpenTelemetry Collector sidecar.
func InitTracing(ctx context.Context) (*sdktrace.TracerProvider, error) {
	exporter, err := otlptracegrpc.New(ctx,
		otlptracegrpc.WithEndpoint("localhost:4317"),
		otlptracegrpc.WithInsecure(),
	)
	if err != nil {
		return nil, err
	}
	tp := sdktrace.NewTracerProvider(sdktrace.WithBatcher(exporter))
	otel.SetTracerProvider(tp)
	return tp, nil
}

// DialFlags connects to the flagd feature-flag sidecar.
func DialFlags() (*grpc.ClientConn, error) {
	return grpc.NewClient("localhost:8013", grpc.WithTransportCredentials(insecure.NewCredentials()))
}
