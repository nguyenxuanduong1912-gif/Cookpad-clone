const mongoose = require("mongoose");

const IngredientMappingSchema = new mongoose.Schema(
  {
    // Tên nguyên liệu tiếng Việt do người dùng nhập (Key để tra cứu)
    vietnameseName: {
      type: String,
      required: true,
      unique: true, // Đảm bảo không có tên tiếng Việt trùng lặp
      trim: true,
      lowercase: true, // Lưu ở dạng chữ thường để dễ dàng so sánh
    },
    // Tên tiếng Anh chuẩn hóa, dùng để gửi đến API Dinh dưỡng
    englishStandardName: {
      type: String,
      required: true,
      trim: true,
    },
    // Ghi lại nguồn gốc của bản dịch (ví dụ: 'Google_API', 'Admin_Manual')
    source: {
      type: String,
      default: "External_Translation_API",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "IngredientMapping",
  IngredientMappingSchema,
  "IngredientMapping"
);
