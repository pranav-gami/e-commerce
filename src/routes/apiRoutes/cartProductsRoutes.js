import { Router } from "express";
import {
  addProductToCart,
  getAllCartsData,
  getProductsByCartID,
  getProductsByUserID,
  updateCartProductDetails,
  deleteCartItems,
} from "../../controller/cartProductController.js";
import {
  validateParamsID,
  validateCartProductUpdates,
  validateCartProductData,
} from "../../validation/validation.js";
import { verifyToken } from "../../middleware/verifyAuth.js";
import { authorizeRole } from "../../middleware/authoriseRole.js";

const cartProductRouter = Router();

cartProductRouter.post(
  "/addProduct",
  verifyToken,
  authorizeRole("USER"),
  validateCartProductData,
  addProductToCart
);
cartProductRouter.get("/getAllCarts", verifyToken, getAllCartsData);
cartProductRouter.get(
  "/getCartByUserId/:id",
  verifyToken,
  authorizeRole("USER"),
  validateParamsID,
  getProductsByUserID
);
cartProductRouter.put(
  "/updateCartProduct/:id",
  verifyToken,
  validateParamsID,
  authorizeRole("USER"),
  validateCartProductUpdates,
  updateCartProductDetails
);
cartProductRouter.delete(
  "/deleteCartProduct/:id",
  verifyToken,
  authorizeRole("USER"),
  validateParamsID,
  deleteCartItems
);

export default cartProductRouter;
