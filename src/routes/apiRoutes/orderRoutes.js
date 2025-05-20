import { Router } from "express";
import {
  validateParamsID,
  validateOrderCredentials,
} from "../../validation/validation.js";
import {
  placeOrder,
  showAllOrders,
  showOrdersByUserId,
  deleteOrder,
} from "../../controller/orderController.js";
import { verifyToken } from "../../middleware/verifyAuth.js";
import { authorizeRole } from "../../middleware/authoriseRole.js";

const router = Router();

router.post("/placeOrder", verifyToken, validateOrderCredentials, placeOrder);

router.get("/orders", verifyToken, showAllOrders);

router.get("/orders/:id", verifyToken, validateParamsID, showOrdersByUserId);

router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRole("USER"),
  validateParamsID,
  deleteOrder
);

export default router;
