const express = require("express");
const router = express.Router();
const AdminUserController = require("../../Controllers/Admin/admin.controller");

router.get("/comments", AdminUserController.getAllComments);

router.get("/comments/search", AdminUserController.searchComments);

router.delete("/comments/:id", AdminUserController.deleteComment);

module.exports = router;
