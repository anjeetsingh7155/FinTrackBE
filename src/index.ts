import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import profileRoutes from "./routes/profileRoutes";
import mongoose from "mongoose";

const dotenv = require("dotenv");
dotenv.config();
const { databaseURL, userJWTpass } = process.env;

const dns = require("dns");
try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const port = process.env.PORT || 5000;
const app = express();

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

app.use(
  cors({
    origin: [
      "https://fin-track-pi-six.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "FinTrack Backend Running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/expenses", expenseRoutes);
app.use("/expenses", expenseRoutes);

app.use("/api/profile", profileRoutes);
app.use("/profile", profileRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
