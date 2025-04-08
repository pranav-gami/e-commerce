import prisma from "../config/prisma.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";


//AUTHENTICATING USER AND TOKEN GENERATE
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
        return res.status(400).json({ success: false, message: "User not Found!" });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
        throw new Error("Password do not Match!");
    }

    const token = jsonwebtoken.sign({
        userId: user.id,
        password: password
    }, process.env.SECRET_KEY, { expiresIn: "1d" })

    res.status(200).json({ user, token });
}


//Logout-CONTROLLER
export const logoutUser = async (req, res) => {

}