const mongoose = require("mongoose");

const recentViewSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
      required: true,
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recipes",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Mỗi user chỉ có 1 bản ghi cho 1 recipe — không bị trùng
recentViewSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

const RecentView = mongoose.model(
  "recentViews",
  recentViewSchema,
  "recentViews"
);
module.exports = RecentView;
