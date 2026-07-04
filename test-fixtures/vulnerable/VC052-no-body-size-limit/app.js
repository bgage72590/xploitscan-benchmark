// express.json() without an explicit limit. Default is 100kb, but the
// rule fires when the call is bare — inviting accidental uploads of
// multi-MB bodies or DoS via huge payloads. VC052 must fire.

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;
