const express = require("express");
const router = express.Router();
const authMidleware = require("../../Middlewares/authMiddleware");
const accountsController = require("../../Controllers/Client/accounts.controller");
router.post("/register", accountsController.register);
router.post("/login", accountsController.login);
router.post("/loginGoogle", accountsController.loginByGoogle);
router.post("/loginFacebook", accountsController.loginByFacebook);
router.post("/changePassword", accountsController.changePassword);
router.put("/updatePassword", accountsController.updatePassword);
router.post(
  "/preferences",
  authMidleware.authMidleware,
  accountsController.updateHealthPreferences
);
router.post(
  "/following",
  authMidleware.authMidleware,
  accountsController.following
);
router.delete(
  "/unFollowing/:targetId",
  authMidleware.authMidleware,
  accountsController.unFollowing
);
router.get(
  "/getAll",
  authMidleware.authMidleware,
  accountsController.getAllUser
);
router.get("/getUserByEmail", accountsController.getUserByEmail);
router.get("/:id", accountsController.getUserById);

router.put(
  "/:id",
  authMidleware.authMidleware,
  accountsController.updateUserById
);
router.delete(
  "/:id",
  authMidleware.authMidleware,
  accountsController.deleteUserById
);
router.get("/:id/profile", accountsController.getUserProfile);
router.get(
  "/:id/friends",
  authMidleware.authMidleware,
  accountsController.getMutualFriends
);
router.get(
  "/:id/recipes",
  authMidleware.authMidleware,
  accountsController.searchUserRecipes
);
module.exports = router;
