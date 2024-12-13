import { Appointment } from "../models/appointment.models.js";
import { Doctor } from "../models/doctor.models.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    // Validate input
    if (!doctorId || !date || !time || !time.start || !time.end) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if the doctor is available on the selected date
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const givenDate = new Date(date);
    const dayOfWeek = daysOfWeek[givenDate.getDay()];

    if (!doctor.availableDays.includes(dayOfWeek)) {
      return res
        .status(400)
        .json({ message: "Doctor is not available on the selected date" });
    }

    // Create a new appointment
    const appointment = await Appointment.create({
      patient: req.user._id, // Assuming the patient ID is available in req.user
      doctor: doctorId,
      date,
      time,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
