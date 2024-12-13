import { Doctor } from "../models/doctor.models.js";
import { User } from "../models/user.models.js";

export const addDoctor = async (req, res) => {
  try {
    const { fullName, email, password, specialization, avatar, contactNumber } =
      req.body;

    // Step 1: Validate the input data
    if (
      !fullName ||
      !email ||
      !password ||
      !specialization ||
      !avatar ||
      !contactNumber
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Step 2: Check if the email already exists as a doctor
    const existingDoctorUser = await User.findOne({ email });
    if (existingDoctorUser && existingDoctorUser.role === "doctor") {
      return res
        .status(400)
        .json({ message: "Doctor with this email already exists" });
    }

    // Step 3: Create a new user (doctor)
    const newUser = new User({
      fullName,
      email,
      password, // Password hashing is done in the User model pre-save hook
      role: "doctor", // Set the role as doctor
    });

    // Step 4: Save the new user (doctor) in the database
    await newUser.save();

    // Step 5: Generate a refresh token for the new doctor
    const refreshToken = newUser.generateRefreshToken(); // Assuming `generateRefreshToken` method exists in User model

    // Step 6: Store the refresh token in the user's document
    newUser.refreshToken = refreshToken;
    await newUser.save(); // Save the user document with the refresh token

    // Step 7: Create the doctor record and associate it with the new user
    const newDoctor = new Doctor({
      user: newUser._id, // Associate with the newly created user
      specialization,
      avatar,
      contactNumber,
    });

    // Step 8: Save the doctor data in the database
    await newDoctor.save();

    // Step 9: Return success response with doctor details
    res.status(201).json({
      message: "Doctor account created successfully",
      doctor: newDoctor,
      refreshToken, // Returning the refresh token (optional, based on your implementation)
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
