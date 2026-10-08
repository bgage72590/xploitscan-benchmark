// gRPC client the Next.js API uses to talk to the payments service, which
// runs on a separate Fly.io app reached over the public internet. The channel
// is created without TLS, so every charge request — including the customer's
// payment-method token and the service API key in metadata — crosses the
// network in plaintext. VC096 must fire.

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "node:path";

const packageDefinition = protoLoader.loadSync(
  path.join(process.cwd(), "proto", "payments.proto"),
  { keepCase: true, longs: String, enums: String, defaults: true },
);
const proto = grpc.loadPackageDefinition(packageDefinition) as any;

export const paymentsClient = new proto.payments.v1.PaymentService(
  process.env.PAYMENTS_GRPC_ADDR ?? "payments.fly.dev:50051",
  grpc.credentials.createInsecure(),
);

export function charge(customerId: string, amountCents: number, paymentMethod: string) {
  const metadata = new grpc.Metadata();
  metadata.set("x-api-key", process.env.PAYMENTS_API_KEY ?? "");
  return new Promise((resolve, reject) => {
    paymentsClient.Charge({ customerId, amountCents, paymentMethod }, metadata, (err: Error | null, res: unknown) =>
      err ? reject(err) : resolve(res),
    );
  });
}
