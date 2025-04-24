import prisma from "../config/prisma.js";
import { getCartData } from "../utils/cartRequest.js";

//ADD CARTDATA-CONTROLLER
export const addCart = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.body.userId },
    });
    if (!user) {
      throw new Error("Cart can't be created, because UserId does't Exists");
    }
    if (await prisma.cart.findUnique({ where: { userId: req.body.userId } })) {
      throw new Error("Cart already Exists");
    }
    const cart = await prisma.cart.create({ data: req.body });
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//GET ALL CATEGORY-CONTROLLER
export const getAllCart = async (req, res) => {
  try {
    const carts = await getCartData(req, res, true);
    res.status(200).json({ success: true, data: carts });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//GET SINGLE CATEGORY-CONTROLLER
export const getCartByUserId = async (req, res) => {
  try {
    const cart = await getCartData(req, res, false);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE CATEGORY-CONTROLLER
export const updateCartbyUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const isExist = await prisma.cart.findUnique({ where: { id: userId } });
    if (!isExist) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is not Found!!" });
    }
    const updatedCart = await prisma.cart.update({
      where: { userId: userId },
      data: req.body,
    });
    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//DELETE CATEGORY-CONTROLLER
export const deleteCartbyCartId = async (req, res) => {
  try {
    const userId = JSON.parse(req.params.id);
    if (!(await prisma.user.findUnique({ where: { id: userId } }))) {
      throw new Error("User not Found!");
    }
    const isExist = await prisma.cart.findUnique({ where: { userId: userId } });
    if (!isExist) {
      return res
        .status(400)
        .json({ success: false, message: "User don't have any Cart!!" });
    }
    await prisma.cart.delete({
      where: { id: isExist.id },
    });
    res
      .status(200)
      .json({ success: true, message: "Cart Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
