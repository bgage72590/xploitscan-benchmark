// Socket.IO server for live invoice status, created next to the API. The
// debug log line is development-only; the CORS origin below it is not, so
// production trusts the local dev server. VC095 must fire.
import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";

export function attachRealtime(httpServer: HttpServer) {
  if (process.env.DEBUG) console.log("attaching Socket.IO to the API server");
  const io = new Server(httpServer, { cors: { origin: "http://localhost:3000", credentials: true } });
  io.on("connection", (socket) => {
    socket.on("invoice:watch", (invoiceId: string) => socket.join(`invoice:${invoiceId}`));
  });
  return io;
}
