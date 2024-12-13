import { Router } from "express";
import { addDoctor } from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/verify.middleware.js";

const router = Router();

router.route("/add-doctor").post(verifyAdmin, addDoctor);

export default router;
