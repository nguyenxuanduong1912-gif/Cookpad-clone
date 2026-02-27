const mongoose = require("mongoose");

const ReviewMappingSchema = new mongoose.Schema(
  {
    vietnameseName: {
      type: String,
      required: true,
      unique: true, // Đảm bảo không có hai bản ghi trùng tên
      lowercase: true,
      trim: true,
    },
    count: {
      type: Number,
      default: 1, // Mặc định là 1 lần xuất hiện
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "done"],
      default: "pending",
    },
    suggestedEnglishName: {
      type: String,
      default: "",
    },
    suggestedUnit: {
      type: String,
      default: "",
    },
    adminNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
); // Tự động thêm createdAt và updatedAt

const ReviewMapping = mongoose.model(
  "ReviewMapping",
  ReviewMappingSchema,
  "ReviewMapping"
);

module.exports = ReviewMapping;
