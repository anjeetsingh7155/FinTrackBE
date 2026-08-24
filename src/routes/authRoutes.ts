import { Router, Request, Response } from "express";
import * as z from "zod";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import { userModel } from "../db/db";
import { userType } from "../types";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const userJWTpass = process.env.userJWTpass || "fintrack_jwt_secret_key_teal_2026";
  try {
    const safetyCheck = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const safeObject = safetyCheck.safeParse(req.body);

    if (!safeObject.success) {
      return res.status(400).json({
        message: "Validation Failed",
        errors: safeObject.error.issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    const { name, email, password } = safeObject.data;

    const existingUser: userType | null = await userModel.findOne({
      email: email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists. Please login.",
      });
    }

    const bcryptPass = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name: name,
      email: email,
      password: bcryptPass,
    });

    const token = Jwt.sign(
      {
        name: newUser.name,
        id: newUser._id,
      },
      userJWTpass,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Signup Completed",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: (newUser as any).createdAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const userJWTpass = process.env.userJWTpass || "fintrack_jwt_secret_key_teal_2026";
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const user: userType | null = await userModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password!);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Wrong credentials",
      });
    }

    const token = Jwt.sign(
      {
        name: user.name,
        id: user._id,
      },
      userJWTpass,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error?.message,
    });
  }
});

export default router;
