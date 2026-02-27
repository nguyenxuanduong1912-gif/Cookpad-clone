const Recipe = require("../../Models/recipes");
const Category = require("../../Models/categories");

// Map tên danh mục bạn đã tạo
// NHỚ: phải trùng đúng "name" trong Category của bạn
const KEYWORD_MAP = {
  canh: "Món canh",
  xào: "Món xào",
  xao: "Món xào",
  chiên: "Món chiên",
  chien: "Món chiên",
  rán: "Món chiên",
  ran: "Món chiên",
  kho: "Món kho",
  om: "Món kho",
  rim: "Món kho",
  nuong: "Món nướng",
  nướng: "Món nướng",
  luoc: "Món luộc",
  luộc: "Món luộc",
  salad: "Salad",
  gỏi: "Salad",
  goi: "Salad",
};

module.exports.autoFixCategory = async (req, res) => {
  try {
    // lấy danh sách món chưa có category
    const recipes = await Recipe.find({
      $or: [{ category: null }, { category: { $exists: false } }],
    });

    let fixed = 0;

    for (const r of recipes) {
      const name = r.name_normalized || r.name.toLowerCase();

      let matchedCategoryName = null;

      // dò theo từ khóa
      for (const keyword in KEYWORD_MAP) {
        if (name.includes(keyword)) {
          matchedCategoryName = KEYWORD_MAP[keyword];
          break;
        }
      }

      if (!matchedCategoryName) continue;

      // tìm đúng category đã tạo trong DB
      const categoryDoc = await Category.findOne({ name: matchedCategoryName });
      if (!categoryDoc) continue;

      // gán category vào món
      r.category = categoryDoc._id;
      await r.save();
      fixed++;
    }

    res.json({
      success: true,
      message: `Đã tự động gán danh mục cho ${fixed} món không có category.`,
    });
  } catch (error) {
    console.error("Lỗi auto fix category:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
