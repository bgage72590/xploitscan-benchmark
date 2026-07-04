// Adapted from juice-shop/juice-shop lib/insecurity.ts (MIT). See NOTICE.
// Key material shortened but format-faithful to the source.
import fs from "node:fs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import jws from "jws";

export const publicKey = fs ? fs.readFileSync("encryptionkeys/jwt.pub", "utf8") : "placeholder-public-key";
const privateKey = "-----BEGIN RSA PRIVATE KEY-----\r\nMIICXAIBAAKBgQDNwqLEe9wgTXCbC7+RPdDbBbeqjdbs4kOPOIGzqLpXvJXlxxW8iMz0EaM4BKUqYsIa+ndv3NAn2RxCd5ubVdJJcX43zO6Ko0TFEZx/65gY3BE0O6syCEmUP4qbSd6exou/F+WTISzbQ5FBVPVmhnYhG/kpwt/cIxK5iUn5hm+4tQIDAQAB\r\n-----END RSA PRIVATE KEY-----";

export const hmac = (data: string) =>
  crypto.createHmac("sha256", "pa4qacea4VK9t9nGv7yZtwmj").update(data).digest("hex");

export const authorize = (user = {}) =>
  jwt.sign(user, privateKey, { expiresIn: "6h", algorithm: "RS256" });

export const verify = (token: string) =>
  token ? (jws.verify as (token: string, secret: string) => boolean)(token, publicKey) : false;

export const decode = (token: string) => {
  return jws.decode(token)?.payload;
};
