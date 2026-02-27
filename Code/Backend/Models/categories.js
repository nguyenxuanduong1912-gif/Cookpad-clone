const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    name_normalized: {
      type: String,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorygroups",
      default: null,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      default: null,
    },
    image: {
      type: String,
      default:
        "https://global-web-assets.cpcdn.com/assets/blank4x3-59a0a9ef4e6c3432579cbbd393fb1f1f98d52b9b66a9aae284872b67434274b8.png",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔹 Chuẩn hóa tên không dấu để tìm kiếm nhanh
const Helper = require("../Helper/generate");
categorySchema.pre("save", function (next) {
  if (this.name) {
    this.name_normalized = Helper.removeDiacritics(this.name).toLowerCase();
  }
  next();
});

categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.name_normalized = Helper.removeDiacritics(update.name).toLowerCase();
  }
  next();
});

const Category = mongoose.model("categories", categorySchema, "categories");
module.exports = Category;
