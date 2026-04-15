import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { User } from "../models/User.js";
import { connectDatabase } from "../config/db.js";
import { DEFAULT_ADMIN } from "../config/defaultAdmin.js";

dotenv.config();

export const ensureDefaultAdmin = async () => {
    const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });

    if (existingAdmin) {
        const isPasswordCurrent = await bcrypt.compare(DEFAULT_ADMIN.password, existingAdmin.password);
        const updates = {
            name: DEFAULT_ADMIN.name,
            role: "admin",
            status: "Active"
        };

        if (!isPasswordCurrent) {
            updates.password = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
        }

        await User.updateOne({ _id: existingAdmin._id }, { $set: updates });
        console.log(`Default admin account is ready: ${DEFAULT_ADMIN.email}`);
        return;
    }

    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

    await User.create({
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        password: hashedPassword,
        role: "admin",
        status: "Active"
    });

    console.log(`Default admin account created: ${DEFAULT_ADMIN.email}`);
};

const seedAdmin = async () => {
    try {
        await connectDatabase();
        await ensureDefaultAdmin();
        console.log(`Email: ${DEFAULT_ADMIN.email}`);
        console.log(`Password: ${DEFAULT_ADMIN.password}`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin user:", error);
        process.exit(1);
    }
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
    seedAdmin();
}
