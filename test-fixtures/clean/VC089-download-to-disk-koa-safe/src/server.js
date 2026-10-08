// Koa server for the budgeting app: the API, the built React app, and an
// exchange-rate snapshot downloaded once at boot so requests never wait on
// the rates provider. VC089 must NOT fire.
const fs = require("fs");
const https = require("https");
const path = require("path");
const Koa = require("koa");
const serve = require("koa-static");
const { bodyParser } = require("@koa/bodyparser");
const importRouter = require("./routes/import");

const DIST = path.join(__dirname, "..", "dist");
const RATES_FILE = path.join(__dirname, "..", "data", "rates.json");

function downloadRates() {
  return new Promise((resolve, reject) => {
    https.get(process.env.RATES_URL, (r) => {
      r.pipe(fs.createWriteStream(RATES_FILE)).on("finish", resolve).on("error", reject);
    }).on("error", reject);
  });
}

const app = new Koa();
app.use(bodyParser());
app.use(importRouter.routes());
app.use(serve(DIST));

// Client-side routes: every other GET gets the app's own page.
app.use(async (ctx) => {
  if (ctx.method !== "GET") return;
  ctx.type = "html";
  ctx.body = fs.createReadStream(path.join(DIST, "index.html"));
});

downloadRates().then(() => app.listen(process.env.PORT || 3000));
