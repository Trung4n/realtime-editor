import { Server } from "socket.io";
import { env } from "../config/index.js";
import { verifyToken } from "../utils/jwt.js";
import { docSocket } from "./doc.socket.js";
import cookie from "cookie";
import { AppError } from "../utils/appError.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: env.CORS_ORIGIN, methods: ["GET", "POST"] },
  });

  // Auth handshake
  io.use((socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.token;
    const payload = token ? verifyToken(token) : null;
    if (!payload) return next(new AppError(401, "Unauthorized"));
    socket.user = payload; // { sub, email }
    next();
  });

  io.on("connection", (socket) => {
    docSocket(io, socket);
  });

  console.log("Socket.IO initialized");
  return io;
};
