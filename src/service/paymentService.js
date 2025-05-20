import prisma from "../config/prisma.js";

//CREATE PAYMENT SERVICE
export const createPayment = async function (data) {
  try {
    const payment = await prisma.payment.create({
      data: data,
    });
    return payment;
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//GET PAYMENT DATA SERVICE
export const getPaymentData = async function (req, res, getAll) {
  let payments;
  if (getAll) {
    payments = await prisma.payment.findMany(); //GET ALL DATA
  } else {
    const paymentId = parseInt(req.params.id);
    payments = await prisma.payment.findUnique({ where: { id: paymentId } }); //GET DATA BY ID
  }
  //Check for Data
  if (!payments) {
    let message;
    getAll
      ? (message = "No any Payments Fount")
      : (message = "Payment not Found.");
    throw new Error(message);
  }
  return payments;
};

export const getPaymentByUser = async function (req, res) {
  try {
    const userId = parseInt(req.params.id);
    const payments = await prisma.payment.findMany({
      where: {
        order: {
          userId: userId,
        },
      },
    });
    return payments;
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
