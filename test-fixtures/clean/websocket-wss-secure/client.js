// WebSocket client using wss:// — TLS-encrypted. VC086 must NOT fire.

export function connectRealtime() {
  const ws = new WebSocket("wss://api.example.com/realtime");
  ws.addEventListener("message", (event) => {
    console.log("got", event.data);
  });
  return ws;
}
