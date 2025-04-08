import { Router } from "express";
import { addCart, getAllCart, getCartByUserId, updateCartbyUserId, deleteCartbyCartId } from "../controller/cartController.js";
import { validateParamsID, validateCartCredentials } from "../validation/validation.js";
import { verifyToken } from "../middleware/verifyAuth.js";
const router = Router();

router.post("/addCart", verifyToken, validateCartCredentials, addCart);
router.get("/getAllCarts", verifyToken, getAllCart);
router.get("/getCartByUserid/:id", verifyToken, validateParamsID, getCartByUserId);
router.put("/updateCart/:id", verifyToken, validateParamsID, updateCartbyUserId);
router.delete("/deleteCart/:id", verifyToken, validateParamsID, deleteCartbyCartId);

export default router;