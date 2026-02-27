const express = require("express");
const router = express.Router();
const AdminController = require("../../Controllers/Admin/admin.controller");

router.get("/overview", AdminController.getDashboardOverview);
router.get("/recipe-stats", AdminController.getRecipeStatsByMonth);

module.exports = router;
