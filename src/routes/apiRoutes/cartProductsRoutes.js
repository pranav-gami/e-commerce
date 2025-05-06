import { Router } from "express";
import {
  addProductToCart,
  getAllCartsData,
  getProductsByCartID,
  getProductsByUserID,
  updateCartProductDetails,
  deleteCartItems,
  deleteCartProducts,
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
  validateCartProductData,
  addProductToCart
);
cartProductRouter.get(
  "/getAllCarts",
  verifyToken,
  authorizeRole("ADMIN"),
  getAllCartsData
);
cartProductRouter.get(
  "/getCartByUserId/:id",
  verifyToken,
  validateParamsID,
  getProductsByUserID
);
cartProductRouter.put(
  "/updateCartProduct/:id",
  verifyToken,
  validateParamsID,
  // authorizeRole("USER"),
  validateCartProductUpdates,
  updateCartProductDetails
);

cartProductRouter.delete(
  "/clearUserCart/:id",
  verifyToken,
  // authorizeRole("USER"),
  validateParamsID,
  deleteCartProducts
);

cartProductRouter.delete(
  "/deleteCartProduct/:id",
  verifyToken,
  // authorizeRole("USER"),
  validateParamsID,
  deleteCartItems
);

export default cartProductRouter;
