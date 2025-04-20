import { Router } from "express";
import { validateLoginCredentials } from "../../validation/validation.js";
import { loginUser ,logoutUser} from "../../controller/auth.js";

const router = Router();

router.post("/login", validateLoginCredentials, loginUser);
router.post("/logout", logoutUser);

export default router;
