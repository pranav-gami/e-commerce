import { Router } from "express";
import {
  validateParamsID,
  validateOrderItemCredentials,
} from "../../validation/validation.js";
import {
  addOrderItem,
  showAllOrderItems,
  showOrderItemsById,
  showOrderItsmsByUserId,
  cancelOrderItem,
  deleteOrderItem,
  updateOrderItemStatus,
} from "../../controller/orderItemsController.js";
import { verifyToken } from "../../middleware/verifyAuth.js";
import { authorizeRole } from "../../middleware/authoriseRole.js";

const router = Router();

router.post("/add", verifyToken, validateOrderItemCredentials, addOrderItem);

router.get("/get", verifyToken, showAllOrderItems);

router.get("/get/:id", verifyToken, validateParamsID, showOrderItemsById);
router.get(
  "/getbyuser/:id",
  verifyToken,
  validateParamsID,
  showOrderItsmsByUserId
);

router.patch("/cancel/:id", verifyToken, validateParamsID, cancelOrderItem);

router.patch("/updatestatus", verifyToken, updateOrderItemStatus);

router.delete("/delete/:id", verifyToken, validateParamsID, deleteOrderItem);

export default router;
