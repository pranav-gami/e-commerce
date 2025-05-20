import e from "express";
import prisma from "../config/prisma.js";
import {
  getOrderitemsData,
  getOrderItemsByUser,
} from "../service/orderItemService.js";

//ADD ORDER ITEMS-CONTROLLER
export const addOrderItem = async (req, res) => {
  try {
    const { orderId, productId, price, quantity, title, image } = req.body;
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId,
        productId,
        price,
        quantity,
        title,
        image,
      },
    });
    res.status(200).json({ success: true, data: orderItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//GET ORDERS-ITEMS-CONTROLLER
export const showAllOrderItems = async (req, res) => {
  try {
    const orderItems = await getOrderitemsData(req, res, true);
    if (orderItems.length == 0) {
      throw new Error("Orders not found!!");
    }
    res.status(200).json({ success: true, data: orderItems });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//ORDERS BY ID-CONTROLLER
export const showOrderItemsById = async (req, res) => {
  try {
    const orderItems = await getOrderitemsData(req, res, false);
    res.status(200).json({ success: true, data: orderItems });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ORDERS BY USERID
export const showOrderItsmsByUserId = async (req, res) => {
  try {
    const orderItems = await getOrderItemsByUser(req, res);
    if (orderItems.length == 0) {
      throw new Error("Orders not found!!");
    }
    res.status(200).json({ success: true, data: orderItems });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//UPDATE ORDER STATUS-CONTROLLER
export const updateOrderItemStatus = async (req, res) => {
  try {
    console.log("Called");
    const { itemId, status } = req.body;
    const isExist = await prisma.orderItem.findUnique({
      where: { id: itemId },
    });
    if (!isExist) {
      return res
        .status(500)
        .json({ success: false, message: "OrderItem not available!!" });
    }
    await prisma.orderItem.update({
      where: { id: itemId },
      data: { status: status },
    });
    res
      .status(200)
      .json({ success: true, message: "Order-Status Updated Successfully!!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// CANCEL-ORDER-CONTROLLER
export const cancelOrderItem = async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const isExist = await prisma.orderItem.findUnique({
      where: { id: itemId, status: "PENDING" },
    });
    if (!isExist) {
      return res
        .status(500)
        .json({ success: false, message: "Orderitem not Found!!" });
    }
    await prisma.orderItem.update({
      where: { id: isExist.id },
      data: {
        status: "CANCELLED",
      },
    });
    res.status(200).json({ success: true, message: "Order cancelled!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE-ORDER-CONTROLLER
export const deleteOrderItem = async (req, res) => {
  try {
    const orderItemId = parseInt(req.params.id);
    const isExist = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
    });
    if (!isExist) {
      return res
        .status(500)
        .json({ success: false, message: "Order-Item not Found!!" });
    }
    await prisma.orderItem.delete({
      where: { id: orderItemId },
    });
    res
      .status(200)
      .json({ success: true, message: "OrderItem Deleted Successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
