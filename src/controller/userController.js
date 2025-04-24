import prisma from "../config/prisma.js";
import { createUser, getUserData } from "../utils/userRequest.js";
import bcrypt from "bcrypt";

//ADD USER-CONTROLLER
export const addUser = async (req, res) => {
  try {
    const user = await createUser(req.body);
    console.log("User created");
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log("Error");
    res.status(400).json({ success: false, message: error.message });
  }
};

//GET ALL USER-CONTROLLER
export const showAllUsers = async (req, res) => {
  try {
    const user = await getUserData(req, res, true);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//GET PARTICULAR USER-CONTROLLER
export const showUserById = async (req, res) => {
  try {
    const user = await getUserData(req, res, false);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//UPDATE USER-CONTROLLER
export const updateUser = async (req, res) => {
  try {
    const userID = parseInt(req.params.id);
    const isExist = await prisma.user.findUnique({ where: { id: userID } });
    if (!isExist) {
      return res.status(500).json({
        success: false,
        message: "User you are trying to Update is not Found!!",
      });
    }
    const { username, email, password, role, city, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: userID },
      data: {
        username,
        email,
        password: await bcrypt.hash(password, 5),
        role,
        city,
        phone,
      },
    });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//UPDATE USER-CONTROLLER
export const updateUserStatus = async (req, res) => {
  try {
    const userID = parseInt(req.params.id);
    const isExist = await prisma.user.findUnique({ where: { id: userID } });
    if (!isExist) {
      return res.status(500).json({
        success: false,
        message: "User you are trying to Update is not Found!!",
      });
    }
    const isActive = isExist.isActive ? false : true;
    const user = await prisma.user.update({
      where: { id: userID },
      data: { isActive: isActive },
    });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//DELETE USER-CONTROLLER
export const deleteUser = async (req, res) => {
  try {
    const userID = parseInt(req.params.id);
    const isExist = await prisma.user.findUnique({ where: { id: userID } });
    if (!isExist) {
      return res
        .status(500)
        .json({ success: false, message: "User not Found!!" });
    }
    await prisma.user.delete({
      where: { id: userID },
    });
    res
      .status(200)
      .json({ success: true, message: "User Deleted Successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
