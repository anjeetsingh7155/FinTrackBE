import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { userModel, expenseModel } from "../db/db";
import { AuthMiddleware } from "../middleware/middleware";

const router = Router();

router.get("/", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const userId = req.userID;

    const user: any = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const expenses = await expenseModel.find({ userId });
    const totalExpensesCount = expenses.length;
    const totalAmountSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      stats: {
        totalExpensesCount,
        totalAmountSpent,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

router.put("/", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const userId = req.userID;
    const { name, email, currentPassword, newPassword } = req.body;

    const user: any = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Current password does not match",
        });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;
