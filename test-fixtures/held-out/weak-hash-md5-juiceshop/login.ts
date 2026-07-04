// Adapted from juice-shop/juice-shop lib/insecurity.ts + routes/login.ts (MIT). See NOTICE.
// MD5 used to hash the user's password at login.
import crypto from "node:crypto";
import { type Request, type Response } from "express";
import { UserModel } from "../models/user";

export const hash = (data: string) => crypto.createHash("md5").update(data).digest("hex");

export function login() {
  return async (req: Request, res: Response) => {
    const user = await UserModel.findOne({
      where: {
        email: req.body.email || "",
        password: hash(req.body.password || ""),
      },
    });
    if (user) {
      res.json({ authentication: { uid: user.id } });
    } else {
      res.status(401).send("Invalid email or password.");
    }
  };
}
