import { Router } from "express";
import {
  getAppointmentsForDoctor,
  updateAppointmentStatus,
  updateDoctorProfile,
} from "../controllers/doctor.controller.js";
import { verifyDoctor } from "../middlewares/verify.middleware.js";

const router = Router();

router.route("/update-profile").patch(verifyDoctor, updateDoctorProfile);
router.route("/appointments").get(verifyDoctor, getAppointmentsForDoctor);
router
  .route("/appointments/status")
  .patch(verifyDoctor, updateAppointmentStatus);

export default router;
