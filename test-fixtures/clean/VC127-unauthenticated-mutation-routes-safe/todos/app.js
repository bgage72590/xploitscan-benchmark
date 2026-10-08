const express = require("express");
const session = require("express-session");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const db = require("./db");
require("./passport-config");

const app = express();
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.authenticate("session"));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/login", authLimiter);

// The session strategy above only loads req.user; this is what rejects
// anonymous requests to the todo API.
function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Sign in first" });
  next();
}
app.use("/api/todos", requireUser);

app.post("/login/password", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/todos", async (req, res) => {
  const todos = await db.todo.findMany({ where: { ownerId: req.user.id } });
  res.json(todos);
});

app.put("/api/todos/:id", async (req, res) => {
  const todo = await db.todo.update({
    where: { id: req.params.id, ownerId: req.user.id },
    data: { title: req.body.title, completed: req.body.completed },
  });
  res.json(todo);
});

app.delete("/api/todos/:id", async (req, res) => {
  await db.todo.delete({ where: { id: req.params.id, ownerId: req.user.id } });
  res.status(204).end();
});

module.exports = app;
