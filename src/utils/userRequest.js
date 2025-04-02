import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

//CREATE USER WITH ENCRyPT PASSWORD
export const createUser = async function (data) {
    const { username, email, password } = data;
    const encryptPassword = await bcrypt.hash(password, 5);
    // console.log(encryptPassword);
    return await prisma.user.create({
        data: {
            username, email, password: encryptPassword
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
        getAll ? message = "User doesn't Exists." : message = "Requested user not Found.";
        throw new Error(message);
    }
    return user;
}