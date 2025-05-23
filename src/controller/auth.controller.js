import cloudinary from "../lib/cloudinary.js";
import { User } from "../models/user.model.js";
import {
  clearTokens,
  generateTokens,
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/helper.js";

class AuthController {
  constructor() {}

  async signup(req, res) {
    const { fullname = "", email = "", password = "" } = req.body || {};

    if (!fullname || !email || !password) {
      return res
        .status(400)
        .json(
          sendErrorResponse(
            null,
            "Submission failed: required fields are incomplete."
          )
        );
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json(
          sendErrorResponse(
            null,
            "Password Length should be atleast 6 char long"
          )
        );
    }

    try {
      const user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json(sendErrorResponse(null, "Email already exist"));
      }

      const newUser = new User({ fullname, email, password });

      if (!newUser) {
        return res
          .status(400)
          .json(sendErrorResponse(null, "Invalid User Data"));
      }

      generateTokens(newUser._id, res);
      await newUser.save();

      return res.status(200).json(
        sendSuccessResponse(
          {
            email: newUser.email,
            fullname: newUser.fullname,
            id: newUser._id,
            profilePic: user?.profilePic || "",
          },
          "User singup succesfully"
        )
      );
    } catch (error) {
      return res
        .status(500)
        .json(sendErrorResponse(error, "Something went wrong"));
    }
  }

  async login(req, res) {
    const { email = "", password = "" } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json(sendErrorResponse(null, "Invalid Credentials"));
      }

      const isValidPassword = await user.comparePassword(password);

      if (!isValidPassword) {
        return res
          .status(400)
          .json(sendErrorResponse(null, "Invalid Credentials"));
      }

      generateTokens(user._id, res);

      res.status(200).json(
        sendSuccessResponse(
          {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
          },
          "User logged in"
        )
      );
    } catch (error) {
      return res
        .status(500)
        .json(sendErrorResponse(error, "Something went wrong"));
    }
  }

  logout(req, res) {
    try {
      clearTokens(res);
      res.status(200).json(sendSuccessResponse(null, "Logout succesfully"));
    } catch (error) {
      return res
        .status(500)
        .json(sendErrorResponse(error, "Something went wrong"));
    }
  }

  getProfile(req, res) {
    res.status(200).json({ message: "getProfile success" });
  }

  async updateProfile(req, res) {
    const { profilePic } = req.body;

    if (!req.user) {
      return res
        .status(401)
        .json(sendErrorResponse(null, "Unauthorized - User not found"));
    }

    if (!profilePic) {
      return res
        .status(401)
        .json(sendErrorResponse(null, "Profile Picture is required"));
    }

    const userId = req.user._id;
    const profilePicLink = await cloudinary.uploader.upload(profilePic);

    const user = await User.findOneAndUpdate(
      userId,
      {
        profilePic: profilePicLink.secure_url,
      },
      { new: true }
    ).select("-password");

    res
      .status(200)
      .json(sendSuccessResponse({ data: user }, "Profile Updated Succesfully"));
  }

  checkAuth(req, res) {
    try {
      return res.status(200).json(sendSuccessResponse({ data: req.user }));
    } catch (error) {
      return res
        .status(500)
        .json(sendErrorResponse(error, "Something went wrong"));
    }
  }
}

export const authController = new AuthController();
