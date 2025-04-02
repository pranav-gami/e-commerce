import prisma from "../config/prisma.js";

//GET PRODUCTS DATA
export const getProductData = async function (req, res, getAll) {

    let product;
    if (getAll) {
        product = await prisma.products.findMany();//GET ALL DATA
    } else {
        const productID = parseInt(req.params.id);
        product = await prisma.products.findUnique({ where: { id: productID } });//GET  DATA BY ID
    }
    //Check for Data
    if (!product) {
        let message;
        getAll ? message = "Product doesn't Exists." : message = "Requested Product doesn't Exists.";
        throw new Error(message);
    }
    return product;
}

// //UPDATE PRODUCT-DATA
// export const updateProductData = async function () {

// }