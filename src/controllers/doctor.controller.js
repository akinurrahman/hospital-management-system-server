import { Doctor } from "../models/doctor.models.js";
import { User } from "../models/user.models.js";
import { Appointment } from "../models/appointment.models.js";

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

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    // Validate input
    if (!appointmentId || !["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Fetch the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update the appointment status
    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAppointmentsForDoctor = async (req, res) => {
  try {
    // Step 1: Get the doctor from the User ID
    const userId = req.user._id; // Assuming the middleware attaches the user info
    const doctor = await Doctor.findOne({ user: userId });

    if (!doctor) {
      return res
        .status(404)
        .json({ message: "Doctor not found for this user" });
    }

    // Step 2: Find appointments for this doctor
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("patient", "fullName email contactNumber") // Populating patient details
      .populate("doctor", "specialization avatar contactNumber"); // Populating doctor details

    if (!appointments.length) {
      return res
        .status(404)
        .json({ message: "No appointments found for this doctor" });
    }

    res.status(200).json({
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments for doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};
