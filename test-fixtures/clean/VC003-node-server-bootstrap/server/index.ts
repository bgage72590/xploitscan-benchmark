// `serve(...)` is not exclusively Deno's HTTP server. @hono/node-server and
// several other adapters export a function with the same name whose job is to
// bind a port, not to handle a request. A bootstrap file like this one has no
// authentication in it and never should — the guards live on the routes it
// mounts. If the edge-function shape keyed off the bare token `serve(` it
// would flag this file, and every Hono/Node project would get a phantom
// high-severity auth finding on startup code.
import { serve } from "@hono/node-server";
import app from "./app.js";

const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port });

console.log(`listening on ${port}`);
