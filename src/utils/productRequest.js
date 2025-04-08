import prisma from "../config/prisma.js";

//GET PRODUCTS DATA
export const getProductData = async function (req, res, getAll) {

    let products;
    if (getAll) {
        products = await prisma.products.findMany();//GET ALL DATA
    } else {
        const productID = parseInt(req.params.id);
        products = await prisma.products.findUnique({
            where: { id: productID },
            include: {
                CartProducts: true,
            }
        });
    }
    //Check for Data
    if (!products) {
        let message;
        getAll ? message = "Product's Model is Empty" : message = "Product doesn't Exists.";
        throw new Error(message);
    }
    return products;
}
