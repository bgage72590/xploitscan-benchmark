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
app.use(authLimiter);

app.post("/login/password", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/todos", async (req, res) => {
  const todos = await db.todo.findMany({ where: { ownerId: req.user?.id } });
  res.json(todos);
});

app.put("/api/todos/:id", async (req, res) => {
  const todo = await db.todo.update({
    where: { id: req.params.id },
    data: { title: req.body.title, completed: req.body.completed },
  });
  res.json(todo);
});

app.delete("/api/todos/:id", async (req, res) => {
  await db.todo.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

module.exports = app;
