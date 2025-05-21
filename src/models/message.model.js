import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requried: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requried: true,
    },
    text: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
