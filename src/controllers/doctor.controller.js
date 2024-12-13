import { Doctor } from "../models/doctor.models.js";
import { User } from "../models/user.models.js";

export const updateDoctorProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      specialization,
      avatar,
      contactNumber,
      availableDays,
      availableTime,
    } = req.body;

    // Update the user's general information (fullName and email)
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // User ID from the middleware
      { fullName, email },
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude password from the user response
    updatedUser.password = undefined;

    // Update the doctor's specific information
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { user: req.user._id }, // Find the doctor by user ID
      {
        specialization,
        avatar,
        contactNumber,
        availableDays,
        availableTime,
      },
      { new: true } // Returns the updated document
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.status(200).json({
      message: "Doctor profile updated successfully",
      user: updatedUser, // Return the updated user details
      doctor: updatedDoctor, // Return the updated doctor details
    });
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
