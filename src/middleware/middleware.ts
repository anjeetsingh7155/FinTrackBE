import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const userJWTpass: string | undefined = process.env.userJWTpass;

export const AuthMiddleware = (req: Request | any, res: Response, next: NextFunction) => {
  const secret = process.env.userJWTpass || userJWTpass;
  const authHeader = req.headers["authorization"];
  const token =
    typeof authHeader === "string" && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

  try {
    if (!token || !secret) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }
    const decoded_Data: any = jwt.verify(token, secret);

    req.userID = decoded_Data.id;
    req.userName = decoded_Data.name || decoded_Data.userName;
    next();
  } catch (e: any) {
    console.error("JWT Verification Error:", e.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
