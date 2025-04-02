import { Router } from "express";
import { addCategory, getCatagories, getCatagoryById, updateCategory, deleteCategory } from "../controller/categoryController.js";

const router = Router();

router.post("/addCategory", addCategory);
router.get("/getCategories", getCatagories);
router.get("/getCategory/:id", getCatagoryById);
router.put("/updateCategory/:id", updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

export default router;