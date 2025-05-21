import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { messageController } from "../controller/message.controller.js";

const router = express.Router();

router
  .get("/users", authMiddleware.protectedRoute, messageController.getUsers)
  .get(
    "/users/:id",
    authMiddleware.protectedRoute,
    messageController.getUserChat
  );

router.post(
  "/send/:id",
  authMiddleware.protectedRoute,
  messageController.sendMessage
);

export const messageRoutes = router;
