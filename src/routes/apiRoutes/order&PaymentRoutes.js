import { Router } from "express";
import {
  validateParamsID,
  validateOrderCredentials,
} from "../../validation/validation.js";
import {
  cancelOrder,
  placeOrder,
  showAllOrders,
  showOrdersByUserId,
  updateOrderStatus,
} from "../../controller/order&PaymentController.js";
import { verifyToken } from "../../middleware/verifyAuth.js";
import { authorizeRole } from "../../middleware/authoriseRole.js";

const router = Router();

router.post(
  "/placeOrder",
  verifyToken,
  authorizeRole("USER"),
  validateOrderCredentials,
  placeOrder
);

router.get("/orders", verifyToken, authorizeRole("ADMIN"), showAllOrders);

router.get(
  "/orders/:id",
  verifyToken,
  authorizeRole("USER"),
  validateParamsID,
  showOrdersByUserId
);

router.patch(
  "/updateOrder",
  verifyToken,
  authorizeRole("USER"),
  updateOrderStatus
);

router.patch(
  "/cancelOrder/:id",
  verifyToken,
  authorizeRole("USER"),
  validateParamsID,
  cancelOrder
);

export default router;
