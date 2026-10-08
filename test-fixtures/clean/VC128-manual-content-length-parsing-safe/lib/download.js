// Streams a release asset to disk and reports progress to the CLI spinner.
const https = require("https");
const fs = require("fs");

function download(url, dest, onProgress) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`GET ${url} failed: ${res.statusCode}`));
        return;
      }
      const total = Number(res.headers["content-length"]);
      let received = 0;
      res.on("data", (chunk) => {
        received += chunk.length;
        if (total) onProgress(received / total);
      });
      res.pipe(fs.createWriteStream(dest)).on("finish", resolve).on("error", reject);
    }).on("error", reject);
  });
}

module.exports = { download };
