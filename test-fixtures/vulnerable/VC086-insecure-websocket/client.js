// WebSocket client opening an unencrypted ws:// connection. All messages
// are plaintext across the wire — passwords, session IDs, personal data.
// VC086 must fire.

export function connectRealtime() {
  const ws = new WebSocket("ws://api.example.com/realtime");
  ws.addEventListener("message", (event) => {
    console.log("got", event.data);
  });
  return ws;
}
