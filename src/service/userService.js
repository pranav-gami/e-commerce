import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

//CREATE USER WITH ENCRYPT PASSWORD
export const createUser = async function (data) {
  let user;
  const { username, email, password, role, city, phone, address } = data;
  user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    throw new Error("User Already Exists");
  }
  const userdata = { username, email, password, role, city, phone };
  if (address) {
    userdata.address = address;
  }
  user = await prisma.user.create({
    data: userdata,
  });
  await prisma.cart.create({
    data: {
      userId: user.id,
    },
  });
  return user;
};

//GET USERS DATA
export const getUserData = async function (req, res, getAll) {
  let user;
  if (getAll) {
    user = await prisma.user.findMany(); //GET ALL DATA
  } else {
    const userID = parseInt(req.params.id);
    user = await prisma.user.findUnique({ where: { id: userID } }); //GET DATA BY ID
  }
  //Check for Data
  if (!user) {
    let message;
    getAll
      ? (message = "User Model is Empty")
      : (message = "User doesn't Found.");
    throw new Error(message);
  }
  return user;
};
