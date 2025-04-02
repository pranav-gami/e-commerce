import prisma from "../config/prisma.js";
import { getCategoryData } from "../utils/categoryRequest.js";

//ADD CATEGORY-CONTROLLER
export const addCategory = async (req, res) => {
    try {
        const category = await prisma.category.create({ data: req.body });
        res.status(200).json({ success: true, data: category });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//GET ALL CATEGORY-CONTROLLER
export const getCatagories = async (req, res) => {
    try {
        const categories = await getCategoryData(req, res, true);
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//GET SINGLE CATEGORY-CONTROLLER
export const getCatagoryById = async (req, res) => {
    try {
        const category = await getCategoryData(req, res, false);
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//UPDATE CATEGORY-CONTROLLER 
export const updateCategory = async (req, res) => {
    try {
        const categoryID = parseInt(req.params.id);
        const isExist = await prisma.category.findUnique({ where: { id: categoryID } })
        if (!isExist) {
            return res.status(400).json({ success: false, message: "Category you are trying to Update is not Found!!" });
        }
        const category = await prisma.category.update({
            where: { id: categoryID },
            data: req.body
        })
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//DELETE CATEGORY-CONTROLLER
export const deleteCategory = async (req, res) => {
    try {
        const categoryID = JSON.parse(req.params.id);
        const isExist = await prisma.category.findUnique({ where: { id: categoryID } })
        if (!isExist) {
            return res.status(400).json({ success: false, message: "Category not Found!!" });
        }
        await prisma.category.delete({
            where: { id: categoryID }
        })
        res.status(200).json({ success: true, message: "Category Deleted Successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
