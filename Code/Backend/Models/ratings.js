const mongoose = require("mongoose");
const ratingSchema = mongoose.Schema(
  {
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recipes",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
    },
    value: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const ratingModel = mongoose.model("ratings", ratingSchema, "ratings");
module.exports = ratingModel;
