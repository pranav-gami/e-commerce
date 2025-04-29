import { Router } from "express";
import {
  addSubcategory,
  getAllSubcategories,
  getSubCatagoryById,
  updateSubcategory,
  deleteSubcategory,
} from "../../controller/subcategoryController.js";
import {
  validateParamsID,
  validateSubcategoryData,
} from "../../validation/validation.js";
import { verifyToken } from "../../middleware/verifyAuth.js";
import { authorizeRole } from "../../middleware/authoriseRole.js";

const router = Router();

router.post(
  "/addsubcategory",
  verifyToken,
  authorizeRole("ADMIN"),
  validateSubcategoryData,
  addSubcategory
);

router.get("/getAllSubcategories", verifyToken, getAllSubcategories);

router.get(
  "/getSubcategories/:id",
  verifyToken,
  validateParamsID,
  getSubCatagoryById
);

router.put(
  "/updateSubcategory/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  validateParamsID,
  validateSubcategoryData,
  updateSubcategory
);

router.delete(
  "/deleteSubategory/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  validateParamsID,
  deleteSubcategory
);

export default router;
