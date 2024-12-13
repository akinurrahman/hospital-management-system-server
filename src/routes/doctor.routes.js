import { Router } from "express";
import { updateDoctorProfile } from "../controllers/doctor.controller.js";
import { verifyDoctor } from "../middlewares/verify.middleware.js";

const router = Router();

router.route("/").patch(verifyDoctor, updateDoctorProfile);

export default router;
