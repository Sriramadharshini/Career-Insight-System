import dotenv from "dotenv";
dotenv.config();
import { connectDatabase } from "./src/config/db.js";
import { SystemSetting } from "./src/models/SystemSetting.js";

async function fix() {
  await connectDatabase();
  await SystemSetting.updateMany({}, { maintenanceMode: false });
  console.log("Maintenance mode disabled in DB");
  process.exit(0);
}
fix();
