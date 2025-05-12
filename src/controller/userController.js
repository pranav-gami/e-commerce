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

    const existingUser = await prisma.user.findUnique({
      where: { id: userID },
    });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User you are trying to update is not found.",
      });
    }

    const { username, email, password, role, city, phone, address } = req.body;

    // Build only fields that are present
    const dataToUpdate = {};

    if (username !== undefined) dataToUpdate.username = username;
    if (email !== undefined) dataToUpdate.email = email;
    if (role !== undefined) dataToUpdate.role = role;
    if (city !== undefined) dataToUpdate.city = city;
    if (phone !== undefined) dataToUpdate.phone = phone;
    if (address !== undefined) dataToUpdate.address = address;

    if (password !== undefined && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 5);
      dataToUpdate.password = hashedPassword;
    }

    // If no fields provided to update
    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userID },
      data: dataToUpdate,
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
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

// UPDATE ADDRESS

export const updateUserAddress = async (req, res) => {
  try {
    const userId = JSON.parse(req.params.id);
    const { address } = req.body;
    const isExist = await prisma.user.findUnique({ where: { id: userId } });
    if (!isExist) {
      return res.status(500).json({
        success: false,
        message: "User you are trying to Update is not Found!!",
      });
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: { address },
    });
    res
      .status(200)
      .json({ success: true, data: user, message: "Address Updated.." });
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
