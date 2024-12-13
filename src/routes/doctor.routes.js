import { Router } from "express";
import {
  getAvailableDoctors,
  getSpecializations,
  updateDoctorProfile,
} from "../controllers/doctor.controller.js";
import {
  verifyDoctor,
  verifyPatient,
} from "../middlewares/verify.middleware.js";

const router = Router();

router.route("/").patch(verifyDoctor, updateDoctorProfile);
router
  .route("/available-specializations")
  .get(verifyPatient, getSpecializations);
router.route("/available-doctors").get(verifyPatient, getAvailableDoctors);

export default router;
