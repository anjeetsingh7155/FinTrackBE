import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import profileRoutes from "./routes/profileRoutes";
import mongoose from "mongoose";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

const databaseURL = process.env.databaseURL

const databaseConnection = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseURL as string).then(resolve).catch(reject);
  });
};
databaseConnection()
  .then((e) => {
    console.log("dataBase is Connected");
  })
  .catch((e) => {
    console.log(`an error occured ${e}`);
  });

app.use(cors({
  origin: "https://fin-track-pi-six.vercel.app/",
  credentials : true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "FinTrack Backend Running ",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/profile", profileRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
