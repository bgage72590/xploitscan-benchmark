const fs = require("fs");
const https = require("https");
const { constants } = require("crypto");
const app = require("./app");

// TLS 1.2 is the floor; SSLv3 / TLS 1.0 / TLS 1.1 are explicitly switched off
// as well, so a downgraded OpenSSL default can never re-enable them.
const server = https.createServer(
  {
    key: fs.readFileSync(process.env.TLS_KEY_PATH),
    cert: fs.readFileSync(process.env.TLS_CERT_PATH),
    minVersion: "TLSv1.2",
    secureOptions:
      constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1,
  },
  app,
);

server.listen(443, () => {
  console.log("HTTPS server listening on 443");
});
