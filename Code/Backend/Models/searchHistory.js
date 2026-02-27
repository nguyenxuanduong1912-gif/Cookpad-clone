const mongoose = require("mongoose");

const searchHistorySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
      required: true,
    },
    keyword: {
      type: String,
      required: true,
      trim: true,
    },
    image: String,
  },
  { timestamps: true }
);

searchHistorySchema.index({ userId: 1, keyword: 1 }, { unique: true });

const SearchHistory = mongoose.model(
  "searchHistories",
  searchHistorySchema,
  "searchHistories"
);
module.exports = SearchHistory;
