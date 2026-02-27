const express = require("express");
const router = express.Router();
const searchHistoryController = require("../../Controllers/Client/searchHistory.controller");
const authMidleware = require("../../Middlewares/authMiddleware");
router.post(
  "/history",
  authMidleware.authMidleware,
  searchHistoryController.saveSearchHistory
);
router.get(
  "/history",
  authMidleware.authMidleware,
  searchHistoryController.getSearchHistory
);
router.delete(
  "/search-history/one",
  authMidleware.authMidleware,
  searchHistoryController.deleteSearchKeyword
);
router.delete(
  "/search-history/all",
  authMidleware.authMidleware,
  searchHistoryController.clearAllSearchHistory
);
module.exports = router;
