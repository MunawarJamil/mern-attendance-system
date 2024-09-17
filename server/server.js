import express from "express";
import dotenv from "dotenv";
import { db_connection } from "./db/conn.js";
import authRoutes from "./routes/userAuth.route.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const conn = async () => {
  try {
    await db_connection();
    app.listen(process.env.PORT, () => {
      console.log("app is listening on port 8080");
    });
  } catch (error) {
    console.log(error);
  }
};
conn();

app.get("/", (req, res) => {
  res.send("welcome to the server...");
});

app.use("/api/auth", authRoutes);
