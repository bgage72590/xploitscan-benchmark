const express = require("express");
const { auth, requiresAuth } = require("express-openid-connect");
const db = require("./db");

const app = express();
app.use(express.json());

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  }),
);

app.get("/profile", requiresAuth(), (req, res) => {
  res.json(req.oidc.user);
});

app.patch("/api/projects/:id", async (req, res) => {
  const project = await db.project.update({
    where: { id: req.params.id },
    data: { name: req.body.name, description: req.body.description },
  });
  res.json(project);
});

app.delete("/api/projects/:id", async (req, res) => {
  await db.project.delete({ where: { id: req.params.id } });
  res.sendStatus(204);
});

app.listen(process.env.PORT || 3000);
