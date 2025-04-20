//AUTHORISE ROLE

export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.redirect("/admin/login?error=login_required");
    }
    next();
  };
};
