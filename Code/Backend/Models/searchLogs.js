const mongoose = require("mongoose");

const searchLogSchema = mongoose.Schema({
  keyword: { type: String, required: true },
  keyword_normalized: String,
  searchedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
});

const SearchLog = mongoose.model("searchLogs", searchLogSchema, "searchLogs");
module.exports = SearchLog;
