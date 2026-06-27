const db = require("../config/db");

/*
========================
GET ALL USERS
========================
*/
exports.getUsers = (req, res) => {
  const sql = `
    SELECT id, username, email, role, created_at
    FROM users
    ORDER BY id ASC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

/*
========================
UPDATE USER ROLE
========================
*/
exports.updateUserRole = (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const allowedRoles = ["user", "admin", "super_admin"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Role tidak valid." });
  }

  // Cegah superadmin mengubah role dirinya sendiri
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ message: "Tidak bisa mengubah role sendiri." });
  }

  const sql = "UPDATE users SET role = ? WHERE id = ?";

  db.query(sql, [role, id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }
    res.json({ message: "Role berhasil diubah." });
  });
};
