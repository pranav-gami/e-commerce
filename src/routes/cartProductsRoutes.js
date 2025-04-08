import { Router } from "express";
import { addProductToCart, getAllCartsData, getProductsByCartID, getProductsByUserID, updateCartProductDetails, deleteCartItems } from "../controller/cartProductController.js";
import { validateParamsID, validateCartProductUpdates, validateCartProductData } from "../validation/validation.js";
import { verifyToken } from "../middleware/verifyAuth.js";

const cartProductRouter = Router();

cartProductRouter.post("/addProduct", verifyToken, validateCartProductData, addProductToCart);
cartProductRouter.get("/getAllCarts", verifyToken, getAllCartsData);
cartProductRouter.get("/getCartByUserId/:id", verifyToken, validateParamsID, getProductsByUserID);
cartProductRouter.put("/updateCartProduct/:id", verifyToken, validateParamsID, validateCartProductUpdates, updateCartProductDetails);
cartProductRouter.delete("/deleteCartProduct/:id", verifyToken, validateParamsID, deleteCartItems);

export default cartProductRouter;