import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";
import { authRoutes } from "./routes/auth.routes.js";
import { messageRoutes } from "./routes/message.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/message", messageRoutes);

connectDB()
  .then(() => {
    const port = process.env.PORT || 8001;

    app.listen(port, () => {
      console.log(`Server is up on http://localhost:${port}`);
    });
  })
  .catch((error) => console.error("Process Failed", error));
