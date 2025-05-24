import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/helper.js";
import cloudinary from "../lib/cloudinary.js";

class MessageController {
  constructor() {}

  async getUsers(req, res) {
    try {
      const loggedInUserId = req.user._id;
      const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
        "-password"
      );

      return res
        .status(200)
        .json(sendSuccessResponse(users, "Users Fetched Succesfully"));
    } catch (error) {
      return res
        .status(500)
        .json(sendErrorResponse(error, "Something went wrong"));
    }
  }

  async getUserChat(req, res) {
    try {
      const userId = req.user._id;
      const { id: chatWithUserId = "" } = req.params;

      if (!chatWithUserId) {
        return res.status(400).json(sendErrorResponse(null, "Invalid Reciver"));
      }

      const messages = await Message.find({
        $or: [
          { senderId: userId, receiverId: chatWithUserId },
          { senderId: chatWithUserId, receiverId: userId },
        ],
      });

      return res
        .status(200)
        .json(sendSuccessResponse(messages, "Chats Fetched"));
    } catch (error) {
      return res
        .status(500)
        .json(sendErrorResponse(error, "Something went wrong"));
    }
  }

  async sendMessage(req, res) {
    try {
      const senderId = req.user._id;
      const { id: receiverId = "" } = req.params;
      const { text = "", image = "" } = req.body;

      const payload = {
        senderId,
        receiverId,
      };

      if (text) {
        payload.text = text;
      }

      if (image) {
        const imageResponse = await cloudinary.uploader.upload(image);
        payload.image = imageResponse.secure_url;
      }

      const message = new Message(payload);
      await message.save();

      return res
        .status(201)
        .json(sendSuccessResponse(message, "Message Send Succesfully"));
    } catch (error) {
      return res
        .status(500)
        .json(sendErrorResponse(error, "Something went wrong"));
    }
  }
}

export const messageController = new MessageController();
