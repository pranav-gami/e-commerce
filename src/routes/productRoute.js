import { Router } from "express";
import { addProduct, showAllProducts, showProductById, deleteProduct, updateProduct } from "../controller/productController.js";
import { validateParamsID, validatepProductData } from "../validation/validation.js";
import { upload } from "../middleware/uploads.js";
import { verifyToken } from "../middleware/verifyAuth.js";

const router = Router();

router.post("/addProduct", upload.single('image'), validatepProductData, addProduct);
router.get("/getAllProducts", showAllProducts);
router.get("/getProduct/:id", validateParamsID, showProductById);
router.put("/updateProduct/:id", validateParamsID, upload.single('image'), validatepProductData, updateProduct);
router.delete("/deleteProduct/:id", validateParamsID, deleteProduct);

export default router;  