import prisma from "../config/prisma.js";
import {
  createPayment,
  getPaymentData,
  getPaymentByUser,
} from "../service/paymentService.js";

//ADD PRODUCT-CONTROLLER
export const addPayment = async (req, res) => {
  try {
    const payment = await createPayment(req.body);
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//GET ALL PAYMENT-CONTROLLER
export const showPayments = async (req, res) => {
  try {
    const payment = await getPaymentData(req, res, true);
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//GET PARTICULAR PAYMENT-CONTROLLER
export const showPaymentById = async (req, res) => {
  try {
    const payment = await getPaymentData(req, res, false);
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//
export const getPaymentByOrderid = async function (req, res) {
  try {
    const orderId = parseInt(req.params.id);
    const payments = await prisma.payment.findMany({
      where: {
        order: {
          orderId: orderId,
        },
      },
    });

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//UPDATE USER'S PAYMENTS -CONTROLLER
export const showPaymentsByUserId = async (req, res) => {
  try {
    const payments = await getPaymentByUser(req, res);
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATED PAYMENT STATUS

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
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const isExist = await prisma.payment.findUnique({
      where: { id: id },
    });
    if (!isExist) {
      return res
        .status(500)
        .json({ success: false, message: "Payment-Data not available!!" });
    }
    await prisma.payment.update({
      where: { id: id },
      data: { status: status },
    });
    res
      .status(200)
      .json({ success: true, message: "Payment Updated Successfully!!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

//DELETE  PAYMENT-CONTROLLER
export const deletePayment = async (req, res) => {
  try {
    const paymentId = parseInt(req.params.id);
    const isExist = await prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!isExist) {
      return res
        .status(500)
        .json({ success: false, message: "Payment data not Found!!" });
    }
    await prisma.payment.delete({
      where: { id: paymentId },
    });
    res
      .status(200)
      .json({ success: true, message: "Paymentdata Deleted Successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
