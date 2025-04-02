import prisma from "../config/prisma.js";
import { getProductData } from "../utils/productRequest.js";

//ADD PRODUCT-CONTROLLER
export const addProduct = async (req, res) => {
    try {
        const product = await prisma.products.create({ data: req.body });
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//GET ALL PRODUCT-CONTROLLER
export const showProducts = async (req, res) => {
    try {
        const products = await getProductData(req, res, true);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//GET PARTICULAR PRODUCT-CONTROLLER
export const showProductById = async (req, res) => {
    try {
        const product = await getProductData(req, res, false);
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//UPDATE PRODUCT-CONTROLLER
export const updateProduct = async (req, res) => {
    try {
        const productID = parseInt(req.params.id);
        const isExist = await prisma.products.findUnique({ where: { id: productID } })
        if (!isExist) {
            return res.status(500).json({ success: false, message: "Product you are trying to Update is not Found!!" });
        }
        const product = await prisma.products.update({
            where: { id: productID },
            data: req.body
        })
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//DELETE  PRODUCT-CONTROLLER
export const deleteProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const isExist = await prisma.products.findUnique({ where: { id: productId } })
        if (!isExist) {
            return res.status(500).json({ success: false, message: "Product not Found!!" });
        }
        await prisma.products.delete({
            where: { id: productId }
        })
        res.status(200).json({ success: true, message: "Product Deleted Successfully!" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
