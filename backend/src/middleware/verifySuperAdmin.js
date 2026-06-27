const verifySuperAdmin = (req, res, next) => {
  if (req.user.role !== "super_admin") {
    return res.status(403).json({
      message: "Akses ditolak. Hanya super_admin.",
    });
  }
  next();
};

module.exports = verifySuperAdmin;
