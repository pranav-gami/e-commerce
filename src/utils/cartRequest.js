import prisma from "../config/prisma.js";

//GET CART DATA
export const getCartData = async function (req, res, getAll) {

    let cart;
    if (getAll) {
        cart = await prisma.cart.findMany({
            select: {
                id: true,
                userId: true,
                _count: {
                    select: {
                        CartProduct: true // this counts how many CartProducts (i.e., products) are in this cart
                    }
                },
                CartProduct: {
                    select: {
                        quantity: true,
                        product: {
                            select: {
                                title: true,
                                price: true
                            }
                        }
                    }
                }
            }
        });//GET ALL DATA
    } else {
        const userID = parseInt(req.params.id);
        if (!await prisma.user.findUnique({ where: { id: userID } })) {
            throw new Error("User not Exists.")
        }
        cart = await prisma.cart.findUnique({
            where: { userId: userID },
            select: {
                userId: true,
                CartProduct: {
                    select: {
                        quantity: true,
                        product: {
                            select: {
                                title: true,
                                price: true
                            }
                        }
                    }
                }
            }
        });//GET DATA BY ID
    }
    //Check for Data
    if (!cart) {
        let message;
        getAll ? message = "Cart Model is Empty" : message = "User don't have any Cart.";
        throw new Error(message);
    }
    return cart;
}