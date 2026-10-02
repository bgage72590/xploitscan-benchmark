const express = require("express");

const app = express();
app.use(express.json());

app.post("/api/login", async (req, res) => {
  const ok = await checkPassword(req.body.email, req.body.password);
  res.json({ ok });
});

app.get("/api/search", async (req, res) => {
  res.json(await search(req.query.q));
});

app.listen(process.env.PORT || 3000);
