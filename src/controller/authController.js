import prisma from "../config/prisma.js";
import sendOtpEmail from "../config/mailer.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

//AUTHENTICATING USER AND TOKEN GENERATE
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email does't Exists" });
    }
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Password" });
    }
    if (user.role != "ADMIN") {
      return res
        .status(401)
        .json({ success: false, message: "Only Admin can Login here" });
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
    if (user.role != "USER") {
      return res
        .status(401)
        .json({ success: false, message: "Only User can Login here" });
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
export const logoutUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(200).json({
      success: true,
      message: "User already logged out.",
    });
  }
  // Clear the cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "helloAdmin",
    sameSite: "lax",
    path: "/",
  });
  return res.status(200).json({
    success: true,
    message: "User logged out and cookie cleared.",
  });
};

// RESET PASSWORD's CONTROLLER

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ message: "Email not Found " });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(otp);
    await prisma.otp.create({
      data: {
        userId: user.id,
        otp,
      },
    });
    await sendOtpEmail(email, otp);
    return res
      .status(200)
      .json({ success: true, message: "OTP sent to your Email ID" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }
    const latestOtp = await prisma.otp.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    console.log(latestOtp, otp);
    if (!latestOtp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request again.",
      });
    }

    const now = new Date();
    const diffMs = now.getTime() - new Date(latestOtp.createdAt).getTime();
    const diffMinutes = diffMs / 60000;

    if (diffMinutes > 5) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    if (latestOtp.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Otp verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
