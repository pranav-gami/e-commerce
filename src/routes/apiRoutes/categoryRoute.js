import { Router } from "express";
import {
  addCategory,
  getAllCatagories,
  getCatagoryById,
  updateCategory,
  deleteCategory,
} from "../../controller/categoryController.js";
import {
  validateParamsID,
  validateCategoryData,
} from "../../validation/validation.js";
import { upload } from "../../middleware/uploads.js";
import { verifyToken } from "../../middleware/verifyAuth.js";
import { authorizeRole } from "../../middleware/authoriseRole.js";

const router = Router();

router.post(
  "/addCategory",
  verifyToken,
  // authorizeRole("ADMIN"),
  upload.single("image"),
  validateCategoryData,
  addCategory
);

router.get(
  "/getAllCategories",
  verifyToken,
  // authorizeRole("ADMIN"),
  getAllCatagories
);

router.get("/getCategory/:id", verifyToken, validateParamsID, getCatagoryById);

router.put(
  "/updateCategory/:id",
  verifyToken,
  // authorizeRole("ADMIN"),
  validateParamsID,
  upload.single("image"),
  validateCategoryData,
  updateCategory
);

router.delete(
  "/deleteCategory/:id",
  verifyToken,
  // authorizeRole("ADMIN"),
  validateParamsID,
  deleteCategory
);

export default router;
