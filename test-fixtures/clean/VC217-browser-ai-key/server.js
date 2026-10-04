// The Express backend that sits at the root of a Create React App project.
// It reads a REACT_APP_-prefixed key — a naming smell VC011 reports in the
// .env — but this file is the Node server: Create React App only bundles
// src/, and nothing that calls app.listen() is ever shipped to a browser.
// The key stays on the server, so VC217 must not fire here.
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

app.post("/completions", async (req, res) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: req.body.message }] }),
  });
  res.send(await response.json());
});

app.listen(8000, () => console.log("Server running on port 8000"));
