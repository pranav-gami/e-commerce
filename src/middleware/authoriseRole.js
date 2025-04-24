//AUTHORISE ROLE

export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    const role = req.user.role;
    if (!req.user || role != requiredRole) {
      if (role == "ADMIN") {
        return res.redirect("/user/login?error=only_user");
      } else {
        return res.redirect("/admin/login?error=only_admin");
      }
    }
    next();
  };
};
