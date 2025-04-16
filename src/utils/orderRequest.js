import prisma from "../config/prisma.js";

function calculateTotal(cartItems) {
    return cartItems.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);
}

//PLACE ORDER SERVICE
export const placeOrderService = async function (req, res) {
    const { userId, paymentType } = req.body;
    if (!await prisma.user.findUnique({ where: { id: userId } })) {
        throw new Error("User not Found!")
    }
    const cart = await prisma.cart.findUnique({ where: { userId: userId } });
    if (!cart) {
        throw new Error("No cart found for this User to place order!!");
    }
    const cartproducts = await prisma.cartProduct.findMany({
        where: { cartId: cart.id },
        include: {
            product: true
        }
    });
    //PLACING ORDER
    const order = await prisma.order.create({
        data: {
            userId,
            totalamount: calculateTotal(cartproducts),
        }
    });
    //ORDER'S PAYMENT
    const payment = await prisma.payment.create({
        data: {
            orderId: order.id,
            amount: order.totalamount,
            paymentMethod: paymentType
        },
    });

    return order;
}
