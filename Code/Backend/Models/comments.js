const Helper = require("../Helper/generate");
const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recipes",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
      required: true,
    },
    content: { type: String, required: true },
    content_normalized: String,
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
commentSchema.pre("save", function (next) {
  if (this.content) {
    this.content_normalized = Helper.removeDiacritics(
      this.content
    ).toLowerCase();
  }
  next();
});
const commentModel = mongoose.model("comments", commentSchema, "comments");
module.exports = commentModel;
