// Adapted from juice-shop/juice-shop routes/dataErasure.ts (MIT). See NOTICE.
// User-controlled `layout` reaches res.render() as the template layout path.
import express, { type NextFunction, type Request, type Response } from "express";
import path from "node:path";
import { PrivacyRequestModel } from "../models/privacyRequests";

const router = express.Router();

router.post("/", (req: Request, res: Response, next: NextFunction): void => {
  void (async () => {
    try {
      await PrivacyRequestModel.create({ deletionRequested: true });
      res.clearCookie("token");

      if (req.body.layout) {
        const filePath: string = path.resolve(req.body.layout).toLowerCase();
        const isForbiddenFile: boolean =
          filePath.includes("ftp") || filePath.includes("ctf.key") || filePath.includes("encryptionkeys");
        if (!isForbiddenFile) {
          res.render("dataErasureResult", { ...req.body }, (error, html) => {
            if (!html || error) {
              next(new Error(error.message));
            } else {
              res.send(html);
            }
          });
        } else {
          next(new Error("File access not allowed"));
        }
      } else {
        res.render("dataErasureResult", { ...req.body });
      }
    } catch (error) {
      next(error);
    }
  })();
});

export default router;
