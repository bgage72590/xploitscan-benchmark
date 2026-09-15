// Express server that serves the built frontend plus the whole project root.
// The static handler has no deny rule for the version-control metadata
// directory, so the full repo history is downloadable.
// This should trigger VC040.

import express from "express";
import path from "path";

const app = express();
const ROOT = path.join(__dirname, "..");

app.use(express.static(ROOT));

app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("serving from", ROOT);
});
