import { Router } from "express";
import { validateLoginCredentials } from "../../validation/validation.js";
import {
  loginAdmin,
  loginUser,
  logoutUser,
  sendOtp,
  verifyOtp,
} from "../../controller/authController.js";

const router = Router();

router.post("/admin/login", validateLoginCredentials, loginAdmin);
router.post("/user/login", validateLoginCredentials, loginUser);
router.post("/user/sendotp", sendOtp);
router.post("/user/verifyotp", verifyOtp);
router.post("/logout", logoutUser);

export default router;
