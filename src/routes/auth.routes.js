import express from "express";

import { authController } from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const routers = express.Router();

routers
  .post("/signup", authController.signup)
  .post("/login", authController.login)
  .post("/logout", authController.logout);

routers.get("/profile", authController.getProfile);

routers.put(
  "/update-profile",
  authMiddleware.protectedRoute,
  authController.updateProfile
);

// upload profile pic

export const authRoutes = routers;
