import { Router } from "express";
import { verifyPatient } from "../middlewares/verify.middleware.js";
import { bookAppointment } from "../controllers/bookAppointment.controller.js";
import {
  getAppointmentsForPatient,
  getAvailableDoctors,
  getSpecializations,
} from "../controllers/patient.controller.js";

const router = Router();

router
  .route("/available-specializations")
  .get(verifyPatient, getSpecializations);

router.route("/available-doctors").get(verifyPatient, getAvailableDoctors);
router.route("/my-appointments").get(verifyPatient, getAppointmentsForPatient);
router.route("/appointments/book").post(verifyPatient, bookAppointment);

export default router;
