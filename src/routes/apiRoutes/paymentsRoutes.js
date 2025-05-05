import express from "express";
import { initiatePayment } from "../../controller/paymentController.js";

const router = express.Router();

router.post("/initiate", initiatePayment);

export default router;
