import { Router } from "express";
import { validateLoginCredentials } from "../../validation/validation.js";
import { loginUser } from "../../controller/auth.js";

const router = Router();

router.post("/login", validateLoginCredentials, loginUser);

export default router;
