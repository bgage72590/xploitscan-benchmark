// POST /import: download the CSV a member linked, then queue it for parsing.
// The file goes to a temp path on disk; the response is a JSON status.
const fs = require("fs");
const https = require("https");
const os = require("os");
const path = require("path");
const Router = require("@koa/router");
const { requireMember } = require("../middleware/requireMember");
const { assertPublicHttpsUrl } = require("../lib/urls");
const { queue } = require("../lib/queue");

const router = new Router();

router.post("/import", requireMember, async (ctx) => {
  const url = await assertPublicHttpsUrl(ctx.request.body.url);
  const tmp = path.join(os.tmpdir(), `import-${Date.now()}.csv`);
  await new Promise((resolve, reject) => {
    https.get(url, (r) => r.pipe(fs.createWriteStream(tmp)).on("finish", resolve).on("error", reject));
  });
  await queue.add("parse-csv", { path: tmp, userId: ctx.state.user.id });
  ctx.status = 202;
  ctx.body = { status: "queued" };
});

module.exports = router;
