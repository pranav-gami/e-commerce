import prisma from "../config/prisma.js";
import { getProductsFromCart } from "../utils/cartProductsRequest.js";
//+ PRODUCT TO CART-CONTROLLER
export const addProductToCart = async (req, res) => {
    try {
        const cartProduct = await prisma.cartProduct.create({ data: req.body });
        res.status(200).json({ success: true, data: cartProduct });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//GET ALL PRODUCTS_CART-CONTROLLER 
export const getAllCartsData = async (req, res) => {
    try {
        const allProducts = await getProductsFromCart(req, res, true);
        res.status(200).json({ success: true, data: allProducts });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//GET CART-PRODUCTS BY USER-ID-CONTROLLER
export const getProductsByCartID = async (req, res) => {
    try {
        const cartProducts = await getProductsFromCart(req, res, false);
        res.status(200).json({ success: true, data: cartProducts });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//GET CART-PRODUCTS BY CART-ID-CONTROLLER
export const getProductsByUserID = async (req, res) => {
    try {
        const cartProducts = await getProductsFromCart(req, res, false);
        res.status(200).json({ success: true, data: cartProducts });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//UPDATE CART-PRODUCT DETAILS
export const updateCartProductDetails = async (req, res) => {
    try {
        const cartId = JSON.parse(req.params.id);
        const { productId, quantity } = req.body;
        if (!await prisma.cart.findUnique({ where: { id: cartId } })) {
            throw new Error("Cart not Found.")
        }
        try {
            const cartProduct = await prisma.cartProduct.update({
                where: {
                    cartId_productId: {
                        cartId,
                        productId
                    }
                },
                data: {
                    quantity: quantity
                }
            })
            res.status(200).json({ success: true, data: cartProduct });
        }
        catch (error) {
            throw new Error("Product not found in Cart!!")
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//DELETE CATEGORY-CONTROLLER
export const deleteCartItems = async (req, res) => {
    try {
        const cartId = JSON.parse(req.params.id);
        const { productId } = req.body;
        if (!await prisma.cart.findUnique({ where: { id: cartId } })) {
            throw new Error("Cart not Found.")
        }
        const isExist = await prisma.cartProduct.findUnique({
            where: {
                cartId_productId: {
                    cartId,
                    productId
                }
            }
        })
        if (!isExist) {
            return res.status(400).json({ success: false, message: "Product not found in the specified cart!!" });
        }
        await prisma.cartProduct.delete({
            where: {
                cartId_productId: {
                    cartId,
                    productId
                }
            }
        })
        res.status(200).json({ success: true, message: "Product Removed From Cart!" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}