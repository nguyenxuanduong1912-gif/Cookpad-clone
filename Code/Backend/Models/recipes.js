const mongoose = require("mongoose");
const Helper = require("../Helper/generate");
const recipeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: "Không đề",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
    name_normalized: String,
    description: String,
    tags: [{ type: String }],
    tags_normalized: [String],
    id_recipe: {
      type: Number,
      default: () => Helper.generateNumber(8),
      unique: true,
    },
    ingredients: [
      {
        name: String,
        name_normalized: String,
        quantity: Number,
        unit: String,
      },
    ],
    steps: [
      {
        stepNumber: Number,
        instruction: String,
        images: [String],
        reference: String,
        referenceText: String,
      },
    ],
    servings: { type: Number, default: 1 },
    cookTime: { type: Number, default: 30 },
    image: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
    },
    savedBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
        savedAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // cảm xúc
    reactions: {
      smile: { type: Number, default: 0 },
      heart: { type: Number, default: 0 },
      clap: { type: Number, default: 0 },
    },
    userReactions: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
        reaction: { type: String, enum: ["heart", "smile", "clap"] },
        reactedAt: { type: Date, default: Date.now },
      },
    ],
    cookingNumber: {
      type: Number,
      default: 0,
    },
    cookHistory: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
        date: { type: Date, default: Date.now },
      },
    ],
    // thống kê
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    recipeState: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    nutritionalInfo: {
      // Thông tin dinh dưỡng cơ bản
      calories: { type: Number, default: 0 }, // năng lượng (kcal)
      sugar: { type: Number, default: 0 }, // đường (g)
      carbs: { type: Number, default: 0 }, // tinh bột (g)
      fat: { type: Number, default: 0 }, // chất béo tổng (g)
      protein: { type: Number, default: 0 }, // đạm (g)
      sodium: { type: Number, default: 0 }, // natri (mg)
      cholesterol: { type: Number, default: 0 }, // cholesterol (mg)
      fiber: { type: Number, default: 0 }, // chất xơ (g)
    },
    dietaryTags: {
      // Nhãn xác định chế độ ăn
      isVegan: { type: Boolean, default: false }, // thuần chay
      isKeto: { type: Boolean, default: false }, // chế độ ít carb
      isDiabeticFriendly: { type: Boolean, default: false }, // thân thiện cho người tiểu đường
      isRenalFriendly: { type: Boolean, default: false }, // thân thiện cho người bệnh thận
      isHeartHealthy: { type: Boolean, default: false }, // tốt cho tim mạch
      isPoisonRisk: { type: Boolean, default: false }, // ⚠️ Có nguy cơ ngộ độc
      // ...
    },
    poisonRisk: {
      isRisk: { type: Boolean, default: false },
      reason: { type: String, default: "" },
    },
    verified: {
      type: Boolean,
      default: false, // chưa kiểm chứng
    },
    verificationInfo: {
      calories: { type: Number, default: 0 },
      totalWeight: { type: Number, default: 0 },
      nutrients: {
        type: Object, // chứa chi tiết: protein, fat, carbs, fiber, v.v.
        default: {},
      },
      verifiedAt: { type: Date },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
      source: { type: String, default: "edamam" }, // hoặc "manual"
    },
    reports: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
        reason: String,
        handled: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
recipeSchema.pre("save", function (next) {
  if (this.tags && this.tags.length > 0) {
    this.tags_normalized = this.tags.map((tag) =>
      Helper.removeDiacritics(tag).toLowerCase()
    );
  }
  if (this.name) {
    this.name_normalized = Helper.removeDiacritics(this.name).toLowerCase();
  }
  if (this.ingredients && this.ingredients.length > 0) {
    this.ingredients.forEach((ing) => {
      if (ing.name) {
        ing.name_normalized = Helper.removeDiacritics(ing.name).toLowerCase();
      }
    });
  }
  next();
});

recipeSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.name_normalized = Helper.removeDiacritics(update.name).toLowerCase();
  }
  if (update.tags && update.tags.length > 0) {
    update.tags_normalized = update.tags.map((t) =>
      Helper.removeDiacritics(t).toLowerCase()
    );
  }
  if (update.ingredients && update.ingredients.length > 0) {
    update.ingredients.forEach((ing) => {
      if (ing.name) {
        ing.name_normalized = Helper.removeDiacritics(ing.name).toLowerCase();
      }
    });
  }

  next();
});
const recipeModel = mongoose.model("recipes", recipeSchema, "recipes");
module.exports = recipeModel;
