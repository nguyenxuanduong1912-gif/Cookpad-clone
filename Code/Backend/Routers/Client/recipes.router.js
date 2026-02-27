const express = require("express");
const router = express.Router();
const authMidleware = require("../../Middlewares/authMiddleware");
const recipeController = require("../../Controllers/Client/recipes.controller");
router.post("/add", authMidleware.authMidleware, recipeController.createRecipe);
router.post(
  "/addDraft",
  authMidleware.authMidleware,
  recipeController.createRecipeDraft
);
router.post(
  "/suggest-by-ingredients-and-group",
  recipeController.suggestByIngredientsAndGroup
);
router.get(
  "/user-recipes",
  authMidleware.authMidleware,
  recipeController.getUserRecipes
);
router.get("/categories", recipeController.getPublicCategories);
router.get("/by-category/:id", recipeController.getRecipesByCategory);
router.get(
  "/:userId/statistics",
  authMidleware.authMidleware,
  recipeController.getUserStatistics
);
router.get(
  "/:userId/activityChart",
  authMidleware.authMidleware,
  recipeController.getUserActivityChart
);
router.get(
  "/:userId/activityChartCooking",
  authMidleware.authMidleware,
  recipeController.getUserCookedActivity
);
router.get("/suggest", recipeController.suggestRecipe);
router.get("/search", recipeController.searchRecipes);
router.get("/similarSearch", recipeController.similarSearch);
router.get("/filter/include", recipeController.filterIncludeIngredients);
router.get("/filter/exclude", recipeController.filterExcludeIngredients);
router.get(
  "/suggestions",
  authMidleware.authMidleware,
  recipeController.getPersonalizedSuggestions
);
router.get("/trending", recipeController.getTrendingKeywords);
router.get("/filter/nutrition", recipeController.filterByNutritionTag);

router.put(
  "/publish/:id",
  authMidleware.authMidleware,
  recipeController.publishRecipe
);
router.put("/:id/view", recipeController.addRecipeView);
router.put(
  "/updateRecipe/:id",
  authMidleware.authMidleware,
  recipeController.updateRecipe
);

router.get(
  "/recent-views",
  authMidleware.authMidleware,
  recipeController.getRecentViews
);

router.put(
  "/saveRecipe",
  authMidleware.authMidleware,
  recipeController.saveRecipe
);
router.put(
  "/reactions",
  authMidleware.authMidleware,
  recipeController.reactions
);
router.put("/updateNumberCooking", recipeController.updateNumberCooking);
router.get("/:id/similar", recipeController.getSimilarRecipes);
router.get("/", recipeController.getRecipes);
router.put("/:id", authMidleware.authMidleware, recipeController.updateRecipe);
router.delete(
  "/viewed-recipes/all",
  authMidleware.authMidleware,
  recipeController.clearAllViewedRecipes
);
router.delete(
  "/viewed-recipes/one",
  authMidleware.authMidleware,
  recipeController.deleteViewedRecipe
);
router.delete(
  "/:id",
  authMidleware.authMidleware,
  recipeController.deleteRecipe
);
router.post("/:recipeId/report", recipeController.reportRecipe);
router.post(
  "/search-by-ingredients",
  recipeController.searchRecipesByIngredients
);

router.get("/user/:userId", recipeController.getRecipesByUser);
router.get("/:id", recipeController.getRecipeById);

module.exports = router;
