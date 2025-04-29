import prisma from "../config/prisma.js";

//ADD CATEGORY-CONTROLLER
export const addSubcategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const subcategory = await prisma.subcategory.create({
      data: { name, categoryId: parseInt(categoryId) },
    });
    res.status(200).json({ success: true, data: subcategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//GET ALL CATEGORY-CONTROLLER
export const getAllSubcategories = async (req, res) => {
  try {
    const subCategories = await prisma.subcategory.findMany();
    res.status(200).json({ success: true, data: subCategories });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//GET SINGLE CATEGORY-CONTROLLER
export const getSubCatagoryById = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const result = await prisma.subcategory.findMany({
      where: { categoryId: categoryId },
      include: {
        products: {
          select: {
            title: true,
            price: true,
          },
        },
      },
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//UPDATE CATEGORY-CONTROLLER
export const updateSubcategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const isExist = await prisma.subcategory.findUnique({
      where: { id },
    });
    if (!isExist) {
      return res.status(400).json({
        success: false,
        message: "Subcategory you are trying to Update is not Found!!",
      });
    }
    const { name, categoryId } = req.body;
    const subcategory = await prisma.subcategory.update({
      where: { id: id },
      data: {
        name,
        categoryId: parseInt(categoryId),
      },
    });
    res.status(200).json({ success: true, data: subcategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//DELETE CATEGORY-CONTROLLER
export const deleteSubcategory = async (req, res) => {
  try {
    const id = JSON.parse(req.params.id);
    const isExist = await prisma.subcategory.findUnique({
      where: { id: id },
    });
    if (!isExist) {
      return res
        .status(400)
        .json({ success: false, message: "SubCategory not Found!!" });
    }
    await prisma.subcategory.delete({
      where: { id: id },
    });
    res
      .status(200)
      .json({ success: true, message: "Subcategory Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
