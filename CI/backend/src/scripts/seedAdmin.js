import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { User } from "../models/User.js";
import { connectDatabase } from "../config/db.js";
import { DEFAULT_ADMIN } from "../config/defaultAdmin.js";
import { Activity } from "../models/Activity.js";

dotenv.config();

export const ensureSeededActivities = async () => {
    // Check if we already have seeded activities
    const activityCount = await Activity.countDocuments();
    if (activityCount > 20) {
        console.log("Realistic activities are already seeded.");
        return;
    }

    console.log("Seeding realistic user activities for dynamic analytics...");

    // Find or create some normal users
    let normalUsers = await User.find({ role: "user" }).limit(5);
    if (normalUsers.length === 0) {
        const userNames = ["Aarav Sharma", "Priya Patel", "Rohan Verma", "Ananya Rao", "Vikram Singh"];
        const userEmails = ["aarav@example.com", "priya@example.com", "rohan@example.com", "ananya@example.com", "vikram@example.com"];
        const hashedPassword = await bcrypt.hash("password123", 10);
        
        for (let i = 0; i < userNames.length; i++) {
            const user = await User.create({
                name: userNames[i],
                email: userEmails[i],
                password: hashedPassword,
                role: "user",
                status: "Active"
            });
            normalUsers.push(user);
        }
    }

    const targets = [
        "Resume Analysis AI",
        "Skill Gap Analysis AI",
        "Mock Interview AI",
        "Career Recommendation AI",
        "AI Career Guidance"
    ];
    const actions = [
        "analyzed",
        "identified gaps",
        "completed",
        "generated",
        "provided"
    ];
    const types = ["ai", "ai", "ai", "ai", "ai"];

    const now = new Date();
    const activitiesToCreate = [];

    const getDateAgo = (daysAgo, hoursAgo = 0) => {
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
        date.setHours(date.getHours() - hoursAgo);
        return date;
    };

    // Seed 15 activities for Today (distributed by hours)
    for (let i = 0; i < 15; i++) {
        const user = normalUsers[i % normalUsers.length];
        const idx = i % targets.length;
        const createdAt = getDateAgo(0, i * 1.5);
        activitiesToCreate.push({
            user: user._id,
            action: actions[idx],
            target: targets[idx],
            type: types[idx],
            createdAt
        });
    }

    // Seed 30 activities for last week (distributed by day of week)
    for (let i = 0; i < 30; i++) {
        const user = normalUsers[i % normalUsers.length];
        const idx = i % targets.length;
        const createdAt = getDateAgo(i % 7, i * 2);
        activitiesToCreate.push({
            user: user._id,
            action: actions[idx],
            target: targets[idx],
            type: types[idx],
            createdAt
        });
    }

    // Seed 100 activities for the last month (distributed by day of month)
    for (let i = 0; i < 100; i++) {
        const user = normalUsers[i % normalUsers.length];
        const idx = i % targets.length;
        const createdAt = getDateAgo(i % 30, i);
        activitiesToCreate.push({
            user: user._id,
            action: actions[idx],
            target: targets[idx],
            type: types[idx],
            createdAt
        });
    }

    // Seed 200 activities for the last year (distributed by month)
    for (let i = 0; i < 200; i++) {
        const user = normalUsers[i % normalUsers.length];
        const idx = i % targets.length;
        const createdAt = getDateAgo(i % 365, i);
        activitiesToCreate.push({
            user: user._id,
            action: actions[idx],
            target: targets[idx],
            type: types[idx],
            createdAt
        });
    }

    // Seed 5 logged-in activities to test Logged-in Users card
    for (let i = 0; i < 5; i++) {
        const user = normalUsers[i % normalUsers.length];
        activitiesToCreate.push({
            user: user._id,
            action: "logged in",
            target: "Platform",
            type: "user",
            createdAt: getDateAgo(0, i * 0.5)
        });
    }

    await Activity.insertMany(activitiesToCreate);
    console.log(`Successfully seeded ${activitiesToCreate.length} activities for AI and Logged-in users.`);
};

export const ensureDefaultAdmin = async () => {
    const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });

    let adminDoc = existingAdmin;
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
    } else {
        const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
        adminDoc = await User.create({
            name: DEFAULT_ADMIN.name,
            email: DEFAULT_ADMIN.email,
            password: hashedPassword,
            role: "admin",
            status: "Active"
        });
        console.log(`Default admin account created: ${DEFAULT_ADMIN.email}`);
    }

    // Run dynamic activity seeding
    try {
        await ensureSeededActivities();
    } catch (e) {
        console.error("Activity seeding failed:", e);
    }
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
