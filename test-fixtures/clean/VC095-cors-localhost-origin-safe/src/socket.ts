// Realtime invoice-status updates over Socket.IO, attached to the same
// production server. The deployed app's URL comes from the environment; the
// Vite dev server is only added when NODE_ENV is not production.
import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";

const socketOrigins = [
  process.env.APP_ORIGIN,
  ...(process.env.NODE_ENV !== "production" ? ["http://localhost:5173"] : []),
].filter((o): o is string => Boolean(o));

export function attachRealtime(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: socketOrigins,
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
