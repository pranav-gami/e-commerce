import prisma from "../config/prisma.js";

//GET CATEGORIES DATA
export const getCategoryData = async function (req, res, getAll) {
  let category;
  if (getAll) {
    category = await prisma.category.findMany({
      include: {
        Subcategory: {
          select: {
            name: true,
          },
        },
      },
    }); //GET ALL DATA
  } else {
    const categoryID = parseInt(req.params.id);
    category = await prisma.category.findUnique({
      where: { id: categoryID },
      include: {
        products: {
          select: {
            title: true,
            price: true,
          },
        },
        Subcategory: {
          select: {
            name: true,
          },
        },
      },
    }); //GET DATA BY ID
  }
  //Check for Data
  if (!category) {
    let message;
    getAll
      ? (message = "Categories Model is Empty")
      : (message = "Category doesn't Exists.");
    throw new Error(message);
  }
  return category;
};
