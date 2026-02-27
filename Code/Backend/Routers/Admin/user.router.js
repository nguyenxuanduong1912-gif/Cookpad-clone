const express = require("express");
const router = express.Router();
const AdminUserController = require("../../Controllers/Admin/admin.controller");

router.get("/users", AdminUserController.getAllUsers);

router.put("/users/toggle/:id", AdminUserController.toggleUserStatus);

router.delete("/users/:id", AdminUserController.deleteUser);

module.exports = router;
