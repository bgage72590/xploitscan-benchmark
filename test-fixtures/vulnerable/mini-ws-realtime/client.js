// Realtime client opening a plain ws:// connection — VC086.

export function connect() {
  const ws = new WebSocket("ws://realtime.example.com/feed");
  ws.addEventListener("message", (event) => {
    handle(JSON.parse(event.data));
  });
  return ws;
}

function handle(msg) {
  console.log("got", msg);
}
