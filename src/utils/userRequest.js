import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

//CREATE USER WITH ENCRYPT PASSWORD
export const createUser = async function (data) {
    const { username, email, password } = data;
    let user = await prisma.user.findUnique({ where: { email } });
    // console.log(user);
    if (user) {
        throw new Error("User Already Exists");
    }
    return await prisma.user.create({
        data: {
            username, email, password: await bcrypt.hash(password, 5)
        }
    })
}

//GET USERS DATA
export const getUserData = async function (req, res, getAll) {
    let user;
    if (getAll) {
        user = await prisma.user.findMany();//GET ALL DATA
    } else {
        const userID = parseInt(req.params.id);
        user = await prisma.user.findUnique({ where: { id: userID } });//GET DATA BY ID
    }
    //Check for Data
    if (!user) {
        let message;
        getAll ? message = "User Model is Empty" : message = "User doesn't Found.";
        throw new Error(message);
    }
    return user;
}