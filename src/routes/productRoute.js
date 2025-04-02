import { Router } from "express";
import { addProduct, showProducts, showProductById, deleteProduct, updateProduct } from "../controller/productController.js";

const router = Router();

router.post("/addProduct", addProduct);
router.get("/getProducts", showProducts);
router.get("/getProduct/:id", showProductById);
router.put("/updateProduct/:id", updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

export default router;