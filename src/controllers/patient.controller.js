import { Appointment } from "../models/appointment.models.js";
import { Doctor } from "../models/doctor.models.js";

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

export const getAppointmentsForPatient = async (req, res) => {
  try {
    const patientId = req.user._id; // Assumes middleware sets req.user._id to the patient's ID.

    // Fetch appointments for the patient
    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "specialization availableTime avatar contactNumber") // Populate doctor details
      .populate("patient", "fullName email");

    if (!appointments.length) {
      return res
        .status(404)
        .json({ message: "No appointments found for this patient" });
    }

    res.status(200).json({
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments for patient:", error);
    res.status(500).json({ message: "Server error" });
  }
};
