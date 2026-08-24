import mongoose, { Schema, Model, Types, model } from "mongoose";
import { expenseCategories } from "../types";

const objectId = Types.ObjectId;

const userSchema = new Schema({
  id: objectId,
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});

const expenseSchema = new Schema({
  id: objectId,
  userId: { type: Types.ObjectId, ref: "users", required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, enum: expenseCategories, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String, default: "" },
});

//exported models
export const userModel = mongoose.model("users", userSchema);
export const expenseModel = mongoose.model("expenses", expenseSchema);