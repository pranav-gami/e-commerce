import { Router } from "express";
import {
  addProduct,
  showAllProducts,
  showProductById,
  getProductCount,
  deleteProduct,
  updateProduct,
} from "../../controller/productController.js";
import {
  validateParamsID,
  validatepProductData,
} from "../../validation/validation.js";
import { upload } from "../../middleware/uploads.js";
import { verifyToken } from "../../middleware/verifyAuth.js";
import { authorizeRole } from "../../middleware/authoriseRole.js";

const router = Router();

router.post(
  "/addProduct",
  verifyToken,
  authorizeRole("ADMIN"),
  upload.single("image"),
  validatepProductData,
  addProduct
);
router.get("/getAllProducts", verifyToken, showAllProducts);

router.get("/getProduct/:id", validateParamsID, showProductById);

router.get("/getProductByCategoryId/:id", validateParamsID, getProductCount);

router.put(
  "/updateProduct/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  validateParamsID,
  upload.single("image"),
  validatepProductData,
  updateProduct
);

router.delete(
  "/deleteProduct/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  validateParamsID,
  deleteProduct
);

export default router;
