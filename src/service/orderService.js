import prisma from "../config/prisma.js";

//PLACE ORDER SERVICE
export const placeOrderService = async function (req, res) {
  try {
    const { userId, paymentType, totalAmount } = req.body;
    if (!(await prisma.user.findUnique({ where: { id: userId } }))) {
      throw new Error("User not Found!");
    }
    const cart = await prisma.cart.findUnique({ where: { userId: userId } });
    if (!cart) {
      throw new Error("No cart found for this User to place order!!");
    }

    //PLACING ORDER
    const order = await prisma.order.create({
      data: {
        userId,
        totalamount: totalAmount,
      },
    });
    //ORDER'S PAYMENT
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.totalamount,
        paymentMethod: paymentType,
      },
    });

    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};
