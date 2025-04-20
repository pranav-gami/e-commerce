import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeaderToken = req.headers.authorization?.split(" ")[1];
  const cookieToken = req.cookies?.token;
  const token = authHeaderToken || cookieToken;
  if (!token) {
    return res.redirect("/admin/login?error=login_required");
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid Token!!" });
  }
};
