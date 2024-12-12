import { Router } from "express";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh").post(refreshAccessToken);

export default router;
