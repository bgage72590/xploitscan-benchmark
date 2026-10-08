// Live price feed over a WebSocket. "message" here is a WebSocket frame from
// our own server, not a cross-window postMessage — there is no sender origin
// to verify, so VC029 must not ask for one.

export type PriceTick = { symbol: string; price: number };

export function subscribeToPrices(onTick: (tick: PriceTick) => void) {
  const socket = new WebSocket("wss://stream.example.com/prices");

  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({ action: "subscribe", symbols: ["BTC", "ETH"] }));
  });

  socket.addEventListener("message", (event) => {
    const tick = JSON.parse(event.data) as PriceTick;
    onTick(tick);
  });

  return () => socket.close();
}
