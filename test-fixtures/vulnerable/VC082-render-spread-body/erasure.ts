import express, { type Request, type Response, type NextFunction } from "express";

const router = express.Router();

router.post("/", (req: Request, res: Response, next: NextFunction): void => {
  // Spreading the entire request body into template locals lets an attacker
  // inject reserved view options (e.g. `layout`) to load arbitrary templates.
  res.render("erasureResult", { ...req.body }, (error, html) => {
    if (error) return next(error);
    res.send(html);
  });
});

export default router;
