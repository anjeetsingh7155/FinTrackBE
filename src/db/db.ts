import mongoose, { Schema, Model, Types, model } from "mongoose";
import { expenseCategories } from "../types";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const { databaseURL } = process.env;

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

export const databaseConnection = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseURL as string).then(resolve).catch(reject);
  });
};