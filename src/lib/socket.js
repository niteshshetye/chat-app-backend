import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

const userSockerMap = {};

export const getRecieverSockerId = (userId) => {
  return userSockerMap[userId];
};

io.on("connection", (socket) => {
  console.log("Connection Established => ", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) userSockerMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSockerMap));

  socket.on("disconnect", () => {
    console.log("Socket disconnected => ", socket.id);
    delete userSockerMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSockerMap));
  });
});

export { app, server, io };
