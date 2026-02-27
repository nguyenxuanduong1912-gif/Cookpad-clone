const express = require("express");
const router = express.Router();
const AdminUserController = require("../../Controllers/Admin/admin.controller");

router.get("/getAllRecipes", AdminUserController.getAllRecipesAdmin);

router.get("/getReport", AdminUserController.getReportsByRecipe);
router.get("/detail/:id", AdminUserController.getRecipeDetail);
router.put("/handleReport", AdminUserController.handleReport);
router.put("/:id/approved", AdminUserController.approveRecipe);
router.put("/:id/verify", AdminUserController.verifyRecipe);

router.put("/:id/rejected", AdminUserController.rejectRecipe);
module.exports = router;
