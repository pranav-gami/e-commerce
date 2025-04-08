import { Router } from "express";
import { addCategory, getAllCatagories, getCatagoryById, updateCategory, deleteCategory } from "../controller/categoryController.js";
import { validateParamsID, validateCategoryData } from "../validation/validation.js";
import { verifyToken } from "../middleware/verifyAuth.js";

const router = Router();

router.post("/addCategory",validateCategoryData, addCategory);
router.get("/getAllCategories", getAllCatagories);
router.get("/getCategory/:id", validateParamsID, getCatagoryById);
router.put("/updateCategory/:id", validateParamsID, validateCategoryData, updateCategory);
router.delete("/deleteCategory/:id", validateParamsID, deleteCategory);

export default router;