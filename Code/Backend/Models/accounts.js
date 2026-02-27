const mongoose = require("mongoose");
const accountSchema = mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    googleId: String, // nếu đăng nhập Google
    facebookId: String, // nếu đăng nhập Facebook
    provider: String,
    description: String,
    recentViewed: [
      {
        recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "recipes" },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    phone: String,
    avatar: {
      type: String,
      default:
        "https://global-web-assets.cpcdn.com/assets/guest_user-411965b370bbbfc1433c4478633d4974e180b506f29555ff58032b0ab04c5b56.png",
    },
    address: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: {
      type: String,
      default: "active",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    savedRecipes: [
      {
        recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "recipes" },
        savedAt: { type: Date, default: Date.now },
      },
    ],
    cookedRecipes: [
      {
        recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "recipes" },
        cookedAt: { type: Date, default: Date.now },
      },
    ],
    healthPreferences: {
      type: {
        healthCondition: { type: String, default: "none" }, // Tiểu đường, Huyết áp cao, ...
        targetDiet: { type: String, default: "none" }, // Keto, Vegan, Low-carb, ...
        excludeIngredients: [{ type: String }], // Mảng các nguyên liệu dị ứng/kiêng kị
        surveyCompleted: { type: Boolean, default: false }, // Đảm bảo khảo sát đã hoàn thành
      },
      default: {},
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const accountModel = mongoose.model("accounts", accountSchema, "accounts");
module.exports = accountModel;
