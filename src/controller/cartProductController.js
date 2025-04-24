import prisma from "../config/prisma.js";
import { getProductsFromCart } from "../utils/cartProductsRequest.js";
//+ PRODUCT TO CART-CONTROLLER
export const addProductToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await prisma.cart.findUnique({ where: { userId: userId } });
    if (!cart) {
      throw new Error("No cart found for this User!!");
    }
    const isExist = await prisma.cartProduct.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });
    if (isExist) {
      return res
        .status(400)
        .json({ success: false, message: "Product Already present in Cart!!" });
    }
    const cartProduct = await prisma.cartProduct.create({
      data: { cartId: cart.id, productId, quantity },
    });
    res.status(200).json({ success: true, data: cartProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//GET ALL PRODUCTS_CART-CONTROLLER
export const getAllCartsData = async (req, res) => {
  try {
    const allProducts = await getProductsFromCart(req, res, true);
    res.status(200).json({ success: true, data: allProducts });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//GET CART-PRODUCTS BY USER-ID-CONTROLLER
export const getProductsByCartID = async (req, res) => {
  try {
    const cartProducts = await getProductsFromCart(req, res, false);
    res.status(200).json({ success: true, data: cartProducts });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//GET CART-PRODUCTS BY CART-ID-CONTROLLER
export const getProductsByUserID = async (req, res) => {
  try {
    const cartProducts = await getProductsFromCart(req, res, false);
    res.status(200).json({ success: true, data: cartProducts });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//UPDATE CART-PRODUCT DETAILS
export const updateCartProductDetails = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (!(await prisma.user.findUnique({ where: { id: userId } }))) {
      throw new Error("User not Found!");
    }
    const cart = await prisma.cart.findUnique({ where: { userId: userId } });
    if (!cart) {
      throw new Error("No cart found for this User!!");
    }
    const { productId, quantity } = req.body;
    try {
      const cartProduct = await prisma.cartProduct.update({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: parseInt(productId),
          },
        },
        data: {
          quantity: quantity,
        },
      });
      res.status(200).json({ success: true, data: cartProduct });
    } catch (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//DELETE CATEGORY-CONTROLLER
export const deleteCartItems = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { productId } = req.body;
    if (!(await prisma.user.findUnique({ where: { id: userId } }))) {
      throw new Error("User not Found!");
    }
    const cart = await prisma.cart.findUnique({ where: { userId: userId } });
    if (!cart) {
      throw new Error("No cart found for this User!!");
    }
    const isExist = await prisma.cartProduct.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });
    if (!isExist) {
      return res.status(400).json({
        success: false,
        message: "Product not found in the specified cart!!",
      });
    }
    await prisma.cartProduct.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });
    res
      .status(200)
      .json({ success: true, message: "Product Removed From Cart!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
