const express = require("express");
const router = express.Router();
const ratingsController = require("../../Controllers/Client/ratings.controller");
const authMidleware = require("../../Middlewares/authMiddleware");

router.post(
  "/addOrUpdate",
  authMidleware.authMidleware,
  ratingsController.addOrUpdateRating
);
router.get("/:recipeId", ratingsController.getRatingByRecipe);
router.delete(
  "/:id",
  authMidleware.authMidleware,
  ratingsController.deleteRating
);
module.exports = router;
