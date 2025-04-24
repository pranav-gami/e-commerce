import prisma from "../config/prisma.js";

//GET CART-PRODUCTS DATA
export const getProductsFromCart = async function (req, res, getAll) {
  let productsData;
  if (getAll) {
    productsData = await prisma.cartProduct.groupBy({
      by: ["cartId"],
      _count: {
        id: true,
      },
    }); //GET ALL DATA
  } else {
    const userId = parseInt(req.params.id);
    if (!(await prisma.user.findUnique({ where: { id: userId } }))) {
      throw new Error("User not Found!");
    }
    const cart = await prisma.cart.findUnique({ where: { userId: userId } });
    if (!cart) {
      throw new Error("No cart found for this User!!");
    }
    productsData = await prisma.cartProduct.findMany({
      where: { cartId: cart.id },
      select: {
        productId: true,
        quantity: true,
        product: {
          select: {
            title: true,
            price: true,
            image: true,
          },
        },
      },
    }); //GET DATA BY ID
  }
  //Check for Data
  if (!productsData) {
    let message;
    getAll ? (message = "Cart is Empty!") : (message = "User's Cart is Empty");
    throw new Error(message);
  }
  return productsData;
};
