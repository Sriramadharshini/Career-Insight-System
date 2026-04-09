/**
 * createAdmin.js — Run once to seed an admin account
 * Usage: node src/scripts/createAdmin.js
 * Uses environment variables: ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGODB_URI
 */
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@careerinsight.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123456";

async function createAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("❌ MONGODB_URI is not set in .env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      if (existing.role === "admin") {
        console.log(`⚠️  Admin already exists: ${ADMIN_EMAIL}`);
        await mongoose.disconnect();
        process.exit(0);
      }
      // Upgrade existing user to admin
      existing.role = "admin";
      existing.status = "Active";
      await existing.save();
      console.log(`✅ Existing user upgraded to admin: ${ADMIN_EMAIL}`);
    } else {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
        status: "Active"
      });
      console.log(`✅ Admin account created successfully!`);
      console.log(`   Email:    ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log(`   ⚠️  Please change the password after first login.`);
    }

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create admin:", err.message);
    process.exit(1);
  }
}

createAdmin();
