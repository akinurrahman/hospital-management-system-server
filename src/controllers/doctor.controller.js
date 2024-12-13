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

export const getSpecializations = async (req, res) => {
  try {
    // Fetch all doctors and extract unique specializations
    const doctors = await Doctor.find();
    const specializations = [
      ...new Set(doctors.map((doctor) => doctor.specialization)),
    ];

    if (!specializations.length) {
      return res.status(404).json({ message: "No specializations found" });
    }

    res.status(200).json({
      message: "Available specializations",
      specializations,
    });
  } catch (error) {
    console.error("Error fetching specializations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// API to get available doctors based on filters (date and specialization)
export const getAvailableDoctors = async (req, res) => {
  try {
    const { date, specialization } = req.query; // Get date and specialization from query params

    // Convert the date to the day of the week (e.g., "Monday", "Tuesday")
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let query = {};

    if (date) {
      const givenDate = new Date(date);
      const dayOfWeek = daysOfWeek[givenDate.getDay()];
      query.availableDays = { $in: [dayOfWeek] }; // Filter by available day
    }

    if (specialization) {
      query.specialization = { $regex: new RegExp(`^${specialization}$`, "i") }; // Case-insensitive filter for specialization
    }

    // Fetch doctors based on the constructed query
    const availableDoctors = await Doctor.find(query).populate(
      "user",
      "fullName email contactNumber"
    );

    if (!availableDoctors.length) {
      return res
        .status(404)
        .json({ message: "No doctors available for the selected filters" });
    }

    res.status(200).json({
      message: "Available doctors for the selected filters",
      doctors: availableDoctors,
    });
  } catch (error) {
    console.error("Error fetching available doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
};
