import express, { type Request, type Response } from "express";

const router = express.Router();

router.get("/profile", (req: Request, res: Response): void => {
  // Passing user data as NAMED locals is the safe, recommended pattern —
  // no reserved view options can be injected. Must not fire VC082.
  res.render("profile", {
    name: req.query.name,
    email: req.query.email,
  });
});

export default router;
