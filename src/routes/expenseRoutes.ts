import { Router, Request, Response } from "express";
import { expenseModel } from "../db/db";
import { AuthMiddleware } from "../middleware/middleware";

const router = Router();

router.get("/", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const userId = req.userID;
    const { search, category } = req.query;

    let query: any = { userId };

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    const expenses = await expenseModel.find(query).sort({ date: -1 });

    return res.status(200).json(expenses);
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error while fetching expenses",
      error: error.message,
    });
  }
});

router.post("/", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const userId = req.userID;
    const { title, amount, category, date, notes } = req.body;

    if (!title || amount === undefined || !category) {
      return res.status(400).json({
        message: "title, amount and category are required",
      });
    }

    const newExpense = await expenseModel.create({
      userId,
      title,
      amount: Number(amount),
      category,
      date: date ? new Date(date) : new Date(),
      notes: notes || "",
    });

    return res.status(200).json(newExpense);
  } catch (error: any) {
    return res.status(400).json({
      message: "Error adding expense",
      error: error.message,
    });
  }
});

router.put("/:id", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const userId = req.userID;
    const expenseId = req.params.id;
    const { title, amount, category, date, notes } = req.body;

    const updatedExpense = await expenseModel.findOneAndUpdate(
      { _id: expenseId, userId },
      {
        title,
        amount: Number(amount),
        category,
        date: date ? new Date(date) : new Date(),
        notes: notes || "",
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        message: "Expense not found or not authorized",
      });
    }

    return res.status(200).json(updatedExpense);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error updating expense",
      error: error.message,
    });
  }
});

router.delete("/:id", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const userId = req.userID;
    const expenseId = req.params.id;

    const deleted = await expenseModel.deleteOne({
      _id: expenseId,
      userId,
    });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({
        message: "Expense not found or not authorized",
      });
    }

    return res.status(200).json({
      message: "Expense Deleted Successfully",
      id: expenseId,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error deleting expense",
      error: error.message,
    });
  }
});

export default router;
