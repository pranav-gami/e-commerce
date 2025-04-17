import prisma from "../config/prisma.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

//AUTHENTICATING USER AND TOKEN GENERATE
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not Found!" });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password do not match!!" });
    }
    const token = jsonwebtoken.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "helloAdmin",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, user, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Logout-CONTROLLER
// export const logoutUser = async (req, res) => {};
