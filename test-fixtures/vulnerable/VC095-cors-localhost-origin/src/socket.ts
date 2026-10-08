// Realtime invoice-status updates over Socket.IO, attached to the same
// production server. The CORS origin is the dev server's address.
import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";

export function attachRealtime(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("invoice:watch", (invoiceId: string) => {
      socket.join(`invoice:${invoiceId}`);
    });
  });

  return io;
}
