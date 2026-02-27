const Recipe = require("../../Models/recipes");
const Account = require("../../Models/accounts");
const Comment = require("../../Models/comments");
const Helper = require("../../Helper/generate");
const Category = require("../../Models/categories");
const axios = require("axios");
const OpenAI = require("openai");
function autoNutritionTags(recipe) {
  const n = recipe.nutritionalInfo || {};
  return {
    isProteinRich: n.protein >= 20,
    isFiberRich: n.fiber >= 5,
    isLowCarb: n.carbs <= 10,
    isLowCalorie: n.calories <= 300,
    isLowSugar: n.sugar <= 5,
    isHeartHealthy: n.sodium <= 400 && n.cholesterol <= 60,
    isDiabeticFriendly: n.sugar <= 5 && n.carbs <= 20,
    isRenalFriendly: n.sodium <= 300 && n.protein <= 25,
    isHighFat: n.fat >= 15,
    isWarningHighSodium: n.sodium >= 1200,
    isWarningHighFat: n.fat >= 30,
    isWarningHighCalorie: n.calories >= 700,
  };
}
// Dashboard
module.exports.getDashboardOverview = async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments({ deleted: false });
    const totalUsers = await Account.countDocuments({ deleted: false });
    const totalComments = await Comment.countDocuments({});
    const pendingRecipes = await Recipe.countDocuments({ status: "pending" });

    res.status(200).json({
      message: "Lấy thống kê tổng quan thành công",
      totals: {
        recipes: totalRecipes,
        users: totalUsers,
        comments: totalComments,
        pending: pendingRecipes,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.getRecipeStatsByMonth = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 4, 1);

    const stats = await Recipe.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          deleted: false,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getMonth() + 1}-${d.getFullYear()}`;
      months.push(key);
    }

    const chartData = months.map((m) => {
      const [month, year] = m.split("-");
      const found = stats.find(
        (s) => s._id.month === Number(month) && s._id.year === Number(year)
      );
      return {
        month: m,
        total: found ? found.total : 0,
      };
    });

    res.status(200).json({
      message: "Lấy biểu đồ công thức theo tháng thành công",
      data: chartData,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// User
module.exports.getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10, role, status, keyword } = req.query;
    page = Number(page);
    limit = Number(limit);
    const filter = { deleted: false };
    console.log(role);
    if (role && ["user", "admin"].includes(role)) {
      filter.role = role;
    }

    if (status && ["active", "blocked"].includes(status)) {
      filter.status = status;
    }

    if (keyword && keyword.trim() !== "") {
      const regex = new RegExp(keyword, "i");
      filter.$or = [{ fullName: regex }, { email: regex }];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      Account.find(filter)
        .select("fullName email role status createdAt lastLogin avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Account.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Lấy danh sách người dùng thành công",
      page,
      totalPages: Math.ceil(total / limit),
      total,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Account.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    user.status = user.status === "active" ? "blocked" : "active";
    await user.save();

    res.status(200).json({
      message: `Tài khoản đã được ${
        user.status === "blocked" ? "khóa" : "mở khóa"
      } thành công`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Account.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    user.deleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.status(200).json({ message: "Xóa tài khoản thành công", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Comment
module.exports.getAllComments = async (req, res) => {
  try {
    let { page = 1, limit = 10, keyword, user, recipe } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};

    // 🔍 Tìm kiếm theo nội dung bình luận
    if (keyword && keyword.trim() !== "") {
      const regex = new RegExp(Helper.removeDiacritics(keyword), "i");
      filter.content = { $regex: regex };
    }

    // 👤 Tìm theo người dùng
    if (user && user.trim() !== "") {
      const foundUser = await Account.findOne({
        fullName: { $regex: user, $options: "i" },
      });
      if (foundUser) filter.userId = foundUser._id;
      else filter.userId = null; // Không có user phù hợp
    }

    // 🍲 Tìm theo món ăn
    if (recipe && recipe.trim() !== "") {
      const foundRecipe = await Recipe.findOne({
        name: { $regex: recipe, $options: "i" },
      });
      if (foundRecipe) filter.recipeId = foundRecipe._id;
      else filter.recipeId = null;
    }

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find(filter)
        .populate("userId", "fullName avatar")
        .populate("recipeId", "name image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Comment.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Lấy danh sách bình luận thành công",
      page,
      totalPages: Math.ceil(total / limit),
      total,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports.searchComments = async (req, res) => {
  try {
    let { keyword, page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });
    }

    const cleanKeyword = Helper.removeDiacritics(keyword).trim().toLowerCase();
    const regex = new RegExp(escapeRegex(cleanKeyword), "i");

    // 🔍 1️⃣ Tìm user và recipe phù hợp với keyword
    const [matchedUsers, matchedRecipes] = await Promise.all([
      Account.find({ fullName: { $regex: regex } }).select("_id"),
      Recipe.find({ name_normalized: { $regex: cleanKeyword } }).select("_id"),
    ]);

    // 🔍 2️⃣ Tìm bình luận có nội dung hoặc thuộc user / recipe
    const query = {
      $or: [
        { content_normalized: { $regex: regex } },
        { userId: { $in: matchedUsers.map((u) => u._id) } },
        { recipeId: { $in: matchedRecipes.map((r) => r._id) } },
      ],
    };

    const total = await Comment.countDocuments(query);

    const comments = await Comment.find(query)
      .populate("userId", "fullName avatar")
      .populate("recipeId", "name image")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const filtered = comments.filter((c) => c.userId && c.recipeId);

    res.status(200).json({
      message: "Tìm kiếm bình luận thành công",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      comments: filtered,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    res.status(200).json({ message: "Xóa bình luận thành công", comment });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Recipe
module.exports.getAllRecipesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, reported, keyword } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    // 🔍 Lọc theo trạng thái: pending / approved / rejected
    if (status && status !== "all") query.status = status;

    if (reported !== "all") {
      if (reported === "true") query["reports.0"] = { $exists: true };
      if (reported === "false") query["reports.0"] = { $exists: false };
    }

    // 🔍 Tìm kiếm theo tên món hoặc người đăng
    if (keyword && keyword.trim() !== "") {
      const clean = Helper.removeDiacritics(keyword).trim().toLowerCase();
      const regex = new RegExp(clean, "i");

      const matchedUsers = await Account.find({
        fullName: { $regex: regex },
      }).select("_id");

      query.$or = [
        { name_normalized: { $regex: regex } },
        { createdBy: { $in: matchedUsers.map((u) => u._id) } },
      ];
    }

    // 🧾 Lấy danh sách công thức
    const [recipes, total] = await Promise.all([
      Recipe.find(query)
        .populate("createdBy", "fullName avatar")
        .populate("reports.userId", "fullName avatar")
        .select(
          "name image status servings cookTime description ingredients steps createdBy reports nutritionalInfo dietaryTags verified verificationInfo recipeState createdAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Recipe.countDocuments(query),
    ]);

    res.status(200).json({
      message: "Lấy danh sách công thức thành công",
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      recipes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.getReportsByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findById(recipeId).populate({
      path: "reports.userId",
      select: "fullName avatar",
    });

    if (!recipe)
      return res.status(404).json({ message: "Không tìm thấy công thức" });

    res.status(200).json({
      message: "Lấy danh sách báo cáo thành công",
      reports: recipe.reports || [],
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.handleReport = async (req, res) => {
  try {
    const { recipeId, reportId, action } = req.body;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe)
      return res.status(404).json({ message: "Không tìm thấy công thức" });

    const report = recipe.reports.id(reportId);
    if (!report)
      return res.status(404).json({ message: "Không tìm thấy báo cáo" });

    if (action === "resolve") {
      report.handled = true;
    } else if (action === "delete") {
      recipe.reports = recipe.reports.filter(
        (r) => r._id.toString() !== reportId
      );
    }

    await recipe.save();
    res.status(200).json({
      message: "Cập nhật báo cáo thành công",
      reports: recipe.reports,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.approveRecipe = async (req, res) => {
  try {
    // if (req.user.role !== "admin") {
    //   return res
    //     .status(403)
    //     .json({ message: "Bạn không có quyền duyệt món ăn" });
    // }
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }

    res.status(200).json({ message: "Duyệt món ăn thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.rejectRecipe = async (req, res) => {
  try {
    // if (req.user.role !== "admin") {
    //   return res
    //     .status(403)
    //     .json({ message: "Bạn không có quyền duyệt món ăn" });
    // }
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }

    res.status(200).json({ message: "Đã từ chối công thức" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.getRecipeDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id)
      .populate("createdBy", "fullName avatar email")
      .populate({
        path: "reports.userId",
        select: "fullName avatar",
      })
      .lean();

    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy công thức" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error("❌ Lỗi getRecipeDetail:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
const client = new OpenAI.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// Verify
const callAPIwithChatBotAI = async (ingredients) => {
  const prompt = `
You are a certified nutritionist and food safety expert.
Analyze the following ingredient list and estimate its nutritional profile.
You must also evaluate potential food poisoning or contamination risks.

You MUST return ONLY a valid JSON with this structure:

{
  "nutritionalInfo": {
    "calories": <number>,
    "sugar": <number>,
    "carbs": <number>,
    "fat": <number>,
    "protein": <number>,
    "sodium": <number>,
    "cholesterol": <number>,
    "fiber": <number>
  },
  "poisonRisk": {
    "isRisk": <true/false>,
    "reason": "<short explanation>"
  }
}

Food poisoning risk should consider:
- toxic plants (e.g., poisonous mushrooms, la ngon)
- cassava (sắn) if raw
- potato with sprouts
- fugu (cá nóc)
- raw blood (tiết canh)
- raw or undercooked meat
- raw freshwater fish
- anything known to cause natural toxins or bacterial contamination

Do NOT include any explanation outside the JSON.
Analyze this ingredient list:
${JSON.stringify(ingredients)}
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    const output = response.choices[0].message.content;

    // 🔹 Tự động tìm phần JSON hợp lệ trong kết quả
    const jsonStart = output.indexOf("{");
    const jsonEnd = output.lastIndexOf("}");
    const jsonText = output.substring(jsonStart, jsonEnd + 1);

    const result = JSON.parse(jsonText);
    console.log("✅ Parsed JSON:", result);
    return {
      nutritionalInfo: result.nutritionalInfo,
      poisonRisk: result.poisonRisk,
    };
  } catch (error) {
    console.error("❌ Error parsing JSON:", error.message);
    console.log("Raw output:", error.response?.data || "");
  }
};

module.exports.verifyRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = "690cb3a3ea066532a1d90a7b";

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy công thức" });
    }
    const ingredients = await Helper.normalizeIngredientForOpenFoodFacts(
      recipe.ingredients
    );

    const nutritionData = await callAPIwithChatBotAI(ingredients);
    recipe.verified = true;
    recipe.verificationInfo = {
      calories: nutritionData.nutritionalInfo.calories,
      nutrients: nutritionData.nutritionalInfo,
      verifiedAt: new Date(),
      verifiedBy: adminId,
      source: "OpenAI",
    };
    recipe.nutritionalInfo = nutritionData.nutritionalInfo;
    recipe.poisonRisk = nutritionData.poisonRisk;
    const generatedTags = autoNutritionTags(recipe);
    console.log(generatedTags);
    console.log(nutritionData.nutritionalInfo);
    await recipe.save();
    return res.status(200).json({
      ...recipe.toObject(),
      dietaryTags: generatedTags,
      poisonRisk: nutritionData.poisonRisk,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Lấy tất cả danh mục
// 🔹 Lấy danh mục có phân trang & tìm kiếm
module.exports.getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 5, keyword = "" } = req.query;
    const skip = (page - 1) * limit;
    const regex = new RegExp(Helper.removeDiacritics(keyword), "i");

    const query = keyword
      ? { name_normalized: { $regex: regex } }
      : { deleted: false };

    const [categories, total] = await Promise.all([
      Category.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Category.countDocuments(query),
    ]);

    res.status(200).json({
      message: "Lấy danh mục thành công",
      total,
      totalPages: Math.ceil(total / limit),
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ message: "Tên danh mục không được để trống." });
    }

    // Tự động chuẩn hóa tên (đã xử lý trong Pre-save hook, nhưng kiểm tra trùng lặp)
    const name_normalized = Helper.removeDiacritics(name).toLowerCase();

    // Kiểm tra trùng lặp danh mục chưa bị xóa
    const existingCategory = await Category.findOne({
      name_normalized,
      deleted: false,
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Danh mục này đã tồn tại." });
    }

    const newCategory = new Category({
      name,
      description,
      image,
    });

    await newCategory.save(); // Pre-save hook sẽ tự động thêm name_normalized
    res
      .status(201)
      .json({ message: "Thêm danh mục thành công.", category: newCategory });
  } catch (error) {
    console.error("Lỗi Server khi tạo danh mục:", error);
    res
      .status(500)
      .json({ message: "Lỗi Server khi tạo danh mục.", error: error.message });
  }
};

// =======================================================
// SỬA/CẬP NHẬT DANH MỤC (PUT)
// Endpoint đề xuất: PUT /admin/categories/:id
// =======================================================
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // name_normalized sẽ tự động được xử lý bởi pre("findOneAndUpdate") trong Category Model

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, deleted: false }, // Tìm theo ID và đảm bảo chưa bị xóa
      updateData,
      { new: true, runValidators: true } // new: trả về bản ghi đã cập nhật
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh mục để cập nhật." });
    }

    res.status(200).json({
      message: "Cập nhật danh mục thành công.",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Lỗi Server khi cập nhật danh mục:", error);
    res.status(500).json({
      message: "Lỗi Server khi cập nhật danh mục.",
      error: error.message,
    });
  }
};

// =======================================================
// XÓA MỀM DANH MỤC (DELETE)
// Endpoint đề xuất: DELETE /admin/categories/:id
// =======================================================
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft Delete: Chỉ set trường 'deleted' thành true
    const result = await Category.findOneAndUpdate(
      { _id: id, deleted: false }, // Đảm bảo danh mục tồn tại và chưa bị xóa
      { deleted: true },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh mục để xóa." });
    }

    res.status(200).json({
      message: "Xóa (vô hiệu hóa) danh mục thành công.",
      category: result,
    });
  } catch (error) {
    console.error("Lỗi Server khi xóa danh mục:", error);
    res
      .status(500)
      .json({ message: "Lỗi Server khi xóa danh mục.", error: error.message });
  }
};
