import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { sendErrorResponse } from "../utils/helper.js";

class AuthMiddleware {
  constructor() {}

  async protectedRoute(req, res, next) {
    const token = req.cookies["sessionToken"];

    if (!token) {
      return res
        .status(401)
        .json(sendErrorResponse(null, "Unauthorized - No token found"));
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json(sendErrorResponse(null, "Unauthorized - Token Expired"));
    }

    try {
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res
          .status(401)
          .json(sendErrorResponse(null, "Unauthorized - User not found"));
      }

      req.user = user;

      next();
    } catch (error) {
      return res
        .status(500)
        .json(sendErrorResponse(error, "Something went wrong"));
    }
  }
}

export const authMiddleware = new AuthMiddleware();
