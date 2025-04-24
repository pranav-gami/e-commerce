import { Router } from "express";
import { validateLoginCredentials } from "../../validation/validation.js";
import { loginAdmin, loginUser, logoutUser } from "../../controller/auth.js";

const router = Router();

router.post("/admin/login", validateLoginCredentials, loginAdmin);
router.post("/user/login", validateLoginCredentials, loginUser);
router.post("/logout", logoutUser);

export default router;
