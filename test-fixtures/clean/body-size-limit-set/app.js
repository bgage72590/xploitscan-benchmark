// express.json() with explicit size cap. VC052 must NOT fire.

const express = require("express");
const app = express();

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

module.exports = app;
