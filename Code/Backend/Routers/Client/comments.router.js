const express = require("express");
const router = express.Router();
const commentsController = require("../../Controllers/Client/comments.controller");
const authMidleware = require("../../Middlewares/authMiddleware");
router.post("/add", authMidleware.authMidleware, commentsController.addComment);
router.post(
  "/:commentId/react",
  authMidleware.authMidleware,
  commentsController.reactToComment
);
router.get(
  "/:recipeId",
  authMidleware.authMidleware,
  commentsController.getCommentByRecipeId
);
router.put(
  "/:commentId",
  authMidleware.authMidleware,
  commentsController.updateComment
);
router.delete(
  "/:commentId",
  authMidleware.authMidleware,
  commentsController.deleteComment
);
module.exports = router;
