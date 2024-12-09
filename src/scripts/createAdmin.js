import dotenv from "dotenv";
import { User } from "../models/user.models.js";
import connectDB from "../db/index.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Call the connectDB function to establish the DB connection
    await connectDB();

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
      return;
    }

    const admin = new User({
      fullName: "Super Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("Admin created successfully:", admin.email);

    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save();
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};

createAdmin();
