import { Router } from "express";
import {
  addCart,
  getAllCart,
  getCartByUserId,
  updateCartbyUserId,
  deleteCartbyCartId,
} from "../../controller/cartController.js";
import {
  validateParamsID,
  validateCartCredentials,
} from "../../validation/validation.js";
import { verifyToken } from "../../middleware/verifyAuth.js";
import { authorizeRole } from "../../middleware/authoriseRole.js";

const router = Router();

router.post(
  "/addCart",
  verifyToken,
  authorizeRole("USER"),
  validateCartCredentials,
  addCart
);
router.get("/getAllCarts", verifyToken, getAllCart);
router.get(
  "/getCartByUserid/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  validateParamsID,
  getCartByUserId
);
router.put(
  "/updateCart/:id",
  verifyToken,
  authorizeRole("USER"),
  validateParamsID,
  updateCartbyUserId
);
router.delete(
  "/deleteCart/:id",
  verifyToken,
  authorizeRole("USER"),
  validateParamsID,
  deleteCartbyCartId
);

export default router;
