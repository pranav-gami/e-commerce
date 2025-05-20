import { Router } from "express";
import {
  validateParamsID,
  validatePaymentCredentials,
} from "../../validation/validation.js";
import {
  addPayment,
  showPayments,
  showPaymentById,
  showPaymentsByUserId,
  getPaymentByOrderid,
  deletePayment,
  updatePaymentStatus,
} from "../../controller/paymentController.js";
import { verifyToken } from "../../middleware/verifyAuth.js";

const router = Router();

router.post("/add", verifyToken, validatePaymentCredentials, addPayment);

router.get("/get", verifyToken, showPayments);

router.get("/get/:id", verifyToken, validateParamsID, showPaymentById);
router.get(
  "/getbyorder/:id",
  verifyToken,
  validateParamsID,
  getPaymentByOrderid
);

router.get(
  "/getbyuser/:id",
  verifyToken,
  validateParamsID,
  showPaymentsByUserId
);

router.patch("/updatestatus", verifyToken, updatePaymentStatus);

router.delete("/delete/:id", verifyToken, validateParamsID, deletePayment);

export default router;
