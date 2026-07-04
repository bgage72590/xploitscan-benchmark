// PDF export that shells out to wkhtmltopdf with user-supplied URL.
// Classic command injection — VC094.

const { exec } = require("node:child_process");

function exportPdf(url, outPath) {
  return new Promise((resolve, reject) => {
    exec(`wkhtmltopdf ${url} ${outPath}`, (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}

module.exports = { exportPdf };
