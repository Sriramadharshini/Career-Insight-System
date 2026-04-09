import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

/**
 * adminOnly — verifies JWT and ensures role === 'admin'.
 * Use after protect, or standalone on admin routes.
 */
export const adminOnly = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized — no token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.status === "Blocked") {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied — admins only" });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
