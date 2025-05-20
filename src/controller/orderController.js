import prisma from "../config/prisma.js";
import { placeOrderService } from "../service/orderService.js";
import { deleteCartProducts } from "./cartProductController.js";

//ADD PRODUCT-CONTROLLER
export const placeOrder = async (req, res) => {
  try {
    const order = await placeOrderService(req, res);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//GET ALL ORDERS-CONTROLLER
export const showAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//ORDERS BY USERID-CONTROLLER
export const showOrdersByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (!(await prisma.user.findUnique({ where: { id: userId } }))) {
      throw new Error("User not Found!");
    }

    const orders = await prisma.order.findMany({
      where: { userId: userId },
      include: { items: true, Payment: true },
      orderBy: {
        orderDate: "desc",
      },
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//UPDATE ORDER STATUS-CONTROLLER
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId, status } = req.body;
//     const isExist = await prisma.order.findUnique({ where: { id: orderId } });
//     if (!isExist) {
//       return res
//         .status(500)
//         .json({ success: false, message: "Order not available!!" });
//     }
//     await prisma.order.update({
//       where: { id: orderId },
//       data: { status: status },
//     });
//     res
//       .status(200)
//       .json({ success: true, message: "Order-Status Updated Successfully!!" });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// CANCEL-ORDER-CONTROLLER
export const deleteOrder = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log("called");
    const isExist = await prisma.order.findUnique({
      where: { id: id },
    });
    if (!isExist) {
      return res
        .status(500)
        .json({ success: false, message: "Order not Found!!" });
    }
    await prisma.order.delete({
      where: { id: isExist.id },
    });
    res
      .status(200)
      .json({ success: true, message: "Order Deleted Successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
