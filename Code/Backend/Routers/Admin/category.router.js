const express = require("express");
const router = express.Router();
const AdminUserController = require("../../Controllers/Admin/admin.controller");
// Lấy danh sách danh mục
router.get("/", AdminUserController.getAllCategories);

// Thêm danh mục
router.post("/", AdminUserController.createCategory);

// Cập nhật danh mục
router.put("/:id", AdminUserController.updateCategory);

// Xóa mềm danh mục
router.delete("/:id", AdminUserController.deleteCategory);

module.exports = router;
