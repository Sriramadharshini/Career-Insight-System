import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const createToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;   

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not configured" });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      token: createToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status }
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not configured" });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`[Login] User not found: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log(`[Login] Incorrect password for: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status === "Blocked") {
      return res.status(403).json({ message: "Your account has been blocked. Contact support." });
    }

    return res.json({
      token: createToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not configured" });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await User.findOne({ email });

    if (!admin) {
      console.log(`[AdminLogin] Admin not found: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (admin.role !== "admin") {
      console.log(`[AdminLogin] User is not an admin: ${email}`);
      return res.status(403).json({ message: "Unauthorized — You do not have admin privileges" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.log(`[AdminLogin] Incorrect password for admin: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (admin.status === "Blocked") {
      return res.status(403).json({ message: "Your admin account is restricted. Contact system super-admin." });
    }

    return res.json({
      token: createToken(admin._id, admin.role),
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, status: admin.status }
    });
  } catch (error) {
    return res.status(500).json({ message: "Admin login failed", error: error.message });
  }
};

export const getMe = async (req, res) => res.json({ user: req.user });


