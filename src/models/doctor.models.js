import mongoose, { model, Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    availableDays: {
      type: [String], // Example: ['Monday', 'Wednesday', 'Friday']
      enum: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ], // Allowed values
      default: [],
    },
    availableTime: {
      start: {
        type: String, // Example: "09:00 AM"
      },
      end: {
        type: String, // Example: "05:00 PM"
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Doctor = new model("Doctor", doctorSchema);
