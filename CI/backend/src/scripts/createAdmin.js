/**
 * createAdmin.js - create or repair the default admin account
 * Usage: node src/scripts/createAdmin.js
 * Uses MONGODB_URI from .env
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { connectDatabase } from "../config/db.js";
import { DEFAULT_ADMIN } from "../config/defaultAdmin.js";
import { ensureDefaultAdmin } from "./seedAdmin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

async function createAdmin() {
  try {
    await connectDatabase();
    await ensureDefaultAdmin();
    console.log("Default admin account is ready.");
    console.log(`Email: ${DEFAULT_ADMIN.email}`);
    console.log(`Password: ${DEFAULT_ADMIN.password}`);
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("Failed to create admin:", err.message);
    process.exit(1);
  }
}

createAdmin();
