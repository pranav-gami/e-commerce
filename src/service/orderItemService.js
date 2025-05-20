import prisma from "../config/prisma.js";

//GET ORDER ITEMS
export const getOrderitemsData = async function (req, res, getAll) {
  let orderItems;
  if (getAll) {
    orderItems = await prisma.orderItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    const orderItemId = parseInt(req.params.id);
    orderItems = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  //Check for Data
  if (!orderItems) {
    let message;
    getAll ? (message = "No any Orders Found") : (message = "Order not Found.");
    throw new Error(message);
  }
  return orderItems;
};

// GET ORDERS BY USERID
export const getOrderItemsByUser = async function (req, res) {
  try {
    const userId = parseInt(req.params.id);
    const ordreItems = await prisma.orderItem.findMany({
      where: {
        order: {
          userId: userId,
        },
      },
    });
    return ordreItems;
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
