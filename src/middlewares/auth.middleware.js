import { verifyToken } from "../utils/jwt.js";

export const requireAuth = (req, res, next) => {
  const cookie = req.cookies.token;
  if (!cookie) {
    return res.status(401).json({ message: "Missing token" });
  }
  const payload = verifyToken(cookie);
  if (!payload) {
    return res.status(401).json({ message: "Invalid token" });
  }
  req.user = payload;
  next();
};
