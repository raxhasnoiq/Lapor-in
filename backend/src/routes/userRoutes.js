const express = require("express");
const router = express.Router();

const { getUsers, updateUserRole } = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const verifySuperAdmin = require("../middleware/verifySuperAdmin");

// GET semua user - hanya super_admin
router.get("/", verifyToken, verifySuperAdmin, getUsers);

// UPDATE role user - hanya super_admin
router.put("/:id/role", verifyToken, verifySuperAdmin, updateUserRole);

module.exports = router;
