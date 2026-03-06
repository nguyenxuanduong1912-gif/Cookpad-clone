const Recipe = require("../../Models/recipes");
const Comment = require("../../Models/comments");
const Rating = require("../../Models/ratings");
const Follow = require("../../Models/follow");
const SearchHistory = require("../../Models/searchHistory");
const Helper = require("../../Helper/generate");
const Cloudinary = require("../../Helper/CLoudinary");
const Account = require("../../Models/accounts");
const SearchLog = require("../../Models/searchLogs");
const RecentView = require("../../Models/recentViews");
const ViewedRecipe = require("../../Models/recentViews");
const Category = require("../../Models/categories");
const OpenAI = require("openai");

// KHỞI TẠO OPENAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
const FDC_API_KEY = process.env.FDC_API_KEY;
const BASE_URL = "https://api.nal.usda.gov/fdc/v1";
const axios = require("axios");
// Hàm tìm ID FDC dựa trên tên
async function searchFDC(foodName) {
  try {
    const res = await axios.get(`${BASE_URL}/foods/search`, {
      params: {
        query: foodName,
        api_key: FDC_API_KEY,
        pageSize: 1,
      },
    });
    const foods = res.data.foods;
    if (foods && foods.length > 0) return foods[0].fdcId;
    return null;
  } catch (err) {
    console.error("Search error:", err.message);
    return null;
  }
}

async function getNutritionFromSearch(foodName, grams) {
  try {
    const res = await axios.get(`${BASE_URL}/foods/search`, {
      params: {
        query: foodName,
        api_key: FDC_API_KEY,
        pageSize: 1,
        dataType: "Foundation,Survey (FNDDS)",
        requireAllWords: true,
      },
    });

    const food = res.data.foods?.[0];
    if (!food || !food.foodNutrients) return {};

    const factor = grams / 100;
    const result = {};
    food.foodNutrients.forEach((n) => {
      const name = n.nutrientName.toLowerCase();
      const value = n.value * factor;
      if (name.includes("energy")) result.calories = value;
      else if (name.includes("protein")) result.protein = value;
      else if (name.includes("total lipid")) result.fat = value;
      else if (name.includes("carbohydrate")) result.carbs = value;
      else if (name.includes("sugars")) result.sugar = value;
    });
    return result;
  } catch (err) {
    console.error("Nutrition search error:", err.message);
    return {};
  }
}
// Hàm chính
async function calculateRecipeNutrition(ingredients) {
  const results = [];
  let total = { calories: 0, protein: 0, fat: 0, carbs: 0, sugar: 0 };

  for (const ing of ingredients) {
    const nutrition = await getNutritionFromSearch(ing.name, ing.grams);
    results.push({ name: ing.name, grams: ing.grams, ...nutrition });

    // Cộng dồn tổng
    for (const key of Object.keys(total)) {
      total[key] += nutrition[key] || 0;
    }
  }

  return { items: results, total };
}

module.exports.createRecipe = async (req, res) => {
  try {
    // 🔹 Tự động thêm tag theo nguyên liệu
    if (Array.isArray(req.body.ingredients)) {
      req.body.ingredients.forEach((ing) => {
        if (ing.name) req.body.tags.push(ing.name);
      });
    }
    // 🔹 Xử lý ảnh chính (nếu có)
    const { image, name } = req.body;
    if (image && image.startsWith("data:image")) {
      req.body.image = await Cloudinary.UploadImage(image, name);
    } else {
      req.body.image =
        "https://global-web-assets.cpcdn.com/assets/blank4x3-59a0a9ef4e6c3432579cbbd393fb1f1f98d52b9b66a9aae284872b67434274b8.png"; // Không có ảnh
    }
    // 🔹 Xử lý ảnh trong steps
    const { steps = [] } = req.body;
    req.body.steps = await Promise.all(
      steps.map(async (step) => {
        const urls =
          Array.isArray(step.images) && step.images.length > 0
            ? await Cloudinary.UploadMultipleImage(step.images)
            : [];
        return { ...step, images: urls };
      })
    );
    // 🔹 Tạo công thức mới
    const recipe = new Recipe({
      ...req.body,
      id_recipe: Helper.generateNumber(8),
      recipeState: "published",
      createdBy: req.user.id,
      status: "pending",
    });
    await recipe.save();
    return res.status(200).json({
      message: "Thêm món thành công",
      recipe,
    });
  } catch (error) {
    console.error("❌ Lỗi createRecipe:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL
    const recipe = await Recipe.findById(id); // Lấy công thức từ database
    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy công thức" });
    }
    // Kiểm tra và xử lý ảnh chính
    if (req.body.image) {
      // Nếu có ảnh base64 hoặc URL
      if (!req.body.image.includes("cloudinary")) {
        req.body.image = await Cloudinary.UploadImage(
          req.body.image,
          req.body.name || recipe.name
        );
      }
    } else {
      // Nếu không có ảnh mới trong request body, giữ ảnh cũ từ công thức
      req.body.image = recipe.image;
    }
    // Thêm tag tự động từ nguyên liệu
    if (req.body.ingredients && req.body.ingredients.length > 0) {
      const newTags = req.body.ingredients.map((ing) => ing.name);
      req.body.tags = [
        ...(req.body.tags || []),
        ...newTags.filter((tag) => !req.body.tags.includes(tag)),
      ];
    }
    // Upload lại ảnh từng bước nếu có
    if (req.body.steps && req.body.steps.length > 0) {
      req.body.steps = await Promise.all(
        req.body.steps.map(async (step) => {
          if (step.images && step.images.length > 0) {
            const hasBase64 = step.images.some((img) =>
              img.startsWith("data:")
            );
            if (hasBase64) {
              const urls = await Cloudinary.UploadMultipleImage(step.images);
              return { ...step, images: urls };
            }
          }
          return step; // Giữ ảnh cũ nếu không có ảnh mới
        })
      );
    }
    // Cập nhật công thức
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      {
        ...req.body,
        status: "pending", // Đặt trạng thái là 'pending' sau khi chỉnh sửa
        updatedAt: new Date(),
      },
      { new: true } // Trả về công thức đã cập nhật
    );
    res.status(200).json({
      message: "Cập nhật món ăn thành công",
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.createRecipeDraft = async (req, res) => {
  try {
    const { image } = req.body;
    if (image === "") {
      req.body.image =
        "https://global-web-assets.cpcdn.com/assets/blank4x3-59a0a9ef4e6c3432579cbbd393fb1f1f98d52b9b66a9aae284872b67434274b8.png";
    }
    const recipe = new Recipe({
      ...req.body,
      id_recipe: Helper.generateNumber(8),
      createdBy: req.user.id,
      status: "pending",
    });

    await recipe.save();
    return res.status(200).json({ message: "Đã lưu vào món nháp", recipe });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
// Giả định các imports cần thiết đã có sẵn ở đầu file:
// const Recipe = require("../../Models/recipes");
// const Account = require("../../Models/accounts");
// const Helper = require("../../Helper/generate");
// ...

// Định nghĩa mapping cho khảo sát (SurveyModal.jsx) và tags trong công thức
const PREFERENCE_TAGS = {
  // targetDiet
  keto: "keto",
  vegan: "chay",
  low_fat: "ít béo",
  high_protein: "giàu protein",
  HeartHealthy: "tim mạch",
  // healthCondition
  diabetes: "tiểu đường",
  heart_disease: "tim mạch",
  weight_loss: "giảm cân",
  none: "none",
  // Thêm các mapping khác theo SurveyModal.jsx nếu cần
};
/**
 * Loại bỏ các từ mô tả không cần thiết trong tên nguyên liệu (ví dụ: 'thịt gà ta' -> 'thịt gà').
 * @param {string} name - Tên nguyên liệu đã chuẩn hóa (normalized).
 * @returns {string} Tên nguyên liệu đã đơn giản hóa (ví dụ: 'thit ga').
 */
const simplifyIngredient = (name) => {
  if (!name) return "";
  // Loại bỏ các từ mô tả thường gặp trong ẩm thực Việt Nam
  let simplified = name.replace(
    /\b(tây|ta|thái|khô|tươi|to|nhỏ|xay|đá|đa dụng|củ|lá|muối|đường|bột|cái|con|miếng|loại|hạt|lớn|bé|viên|lon|chai)\b/g,
    " "
  );
  simplified = simplified.trim();
  // Loại bỏ khoảng trắng thừa
  return simplified.replace(/\s+/g, " ");
};

/**
 * Tạo ra một tập hợp các token (từ khóa) chuẩn hóa từ danh sách nguyên liệu người dùng để so sánh tương đối.
 * @param {string[]} userIngredients - Mảng nguyên liệu người dùng nhập.
 * @returns {Set<string>} Tập hợp các từ khóa (token) chuẩn hóa.
 */
const processUserIngredients = (userIngredients, Helper) => {
  const userTokenSet = new Set();

  // userIngredients.forEach((ing) => {
  //   // Chuẩn hóa tên đầy đủ
  //   const normalizedName = Helper.removeDiacritics(
  //     String(ing).trim()
  //   ).toLowerCase();

  //   // 1. Thêm tên đầy đủ (Ưu tiên khớp chính xác)
  //   userTokenSet.add(normalizedName);

  //   // 2. Thêm tên đã đơn giản hóa (Ví dụ: 'thit ga')
  //   const simplifiedName = simplifyIngredient(normalizedName);
  //   userTokenSet.add(simplifiedName);

  //   // 3. Phân tách thành các token cốt lõi
  //   const simpleTokens = simplifiedName.split(" ");
  //   simpleTokens.forEach((token) => {
  //     if (token.length > 1) {
  //       userTokenSet.add(token);
  //     }
  //   });
  // });

  userIngredients.forEach((ing) => {
    const rawName =
      typeof ing === "string" ? ing : ing && ing.name ? ing.name : null;

    if (!rawName) return;

    const normalizedName = Helper.removeDiacritics(
      String(rawName).trim()
    ).toLowerCase();

    userTokenSet.add(normalizedName);

    const simplifiedName = simplifyIngredient(normalizedName);
    userTokenSet.add(simplifiedName);

    const simpleTokens = simplifiedName.split(" ");
    simpleTokens.forEach((token) => {
      if (token.length > 1) {
        userTokenSet.add(token);
      }
    });
  });

  return userTokenSet;
};
module.exports.searchRecipesByIngredients = async (req, res) => {
  try {
    const { ingredients: userIngredients } = req.body;

    if (!Array.isArray(userIngredients) || userIngredients.length === 0) {
      return res.status(400).json({
        message: "Vui lòng cung cấp danh sách nguyên liệu.",
      });
    }

    // ===========================================
    // V6 NORMALIZER: CHUẨN HÓA CHẶT & AN TOÀN
    // ===========================================

    const removeDescriptors = (txt) => {
      return txt
        .replace(
          /\b(thit|la|cu|qua|re|ta|tay|tim|gia|tuoi|song|kho|lon|nho|xay|mieng|loai|hat|vi|bot|con|cai)\b/g,
          ""
        )
        .replace(/\s+/g, " ")
        .trim();
    };

    const normalize = (name) => {
      if (!name) return "";
      let t = Helper.removeDiacritics(name.toLowerCase().trim());

      // Bỏ mô tả
      t = removeDescriptors(t);

      // Rút gọn phổ biến
      t = t.replace(/\bthit ga\b/g, "ga");
      t = t.replace(/\bthit bo\b/g, "bo");

      return t.trim();
    };

    const getNormalizedTokens = (name) => {
      let raw = normalize(name);
      if (!raw) return [];

      let parts = raw
        .split(" ")
        .filter((w) => w.length > 1 && !["rau", "ca"].includes(w));

      return parts;
    };

    // ===========================================
    // V6 MATCH ENGINE – MATCH THEO CỤM CHÍNH XÁC
    // ===========================================

    const matchIngredientV6 = (recipeName, userInput) => {
      const rTokens = getNormalizedTokens(recipeName);
      const uTokens = getNormalizedTokens(userInput);

      if (rTokens.length === 0 || uTokens.length === 0) return false;

      const rPhrase = rTokens.join(" ");
      const uPhrase = uTokens.join(" ");

      // 1) EXACT FULL PHRASE
      if (rPhrase === uPhrase) return true;

      // 2) Nếu user nhập cụm >= 2 từ → yêu cầu match cụm
      if (uTokens.length >= 2) {
        if (rPhrase.includes(uPhrase)) return true;
        return false; // không match theo từ cuối nữa
      }

      // 3) SINGLE TOKEN → CORE MATCH
      const rCore = rTokens[0];
      const uCore = uTokens[0];

      if (rCore === uCore) return true;

      return false;
    };

    // Chuẩn hoá input user
    const userClean = userIngredients.map((i) =>
      typeof i === "string" ? i.trim() : i?.name || ""
    );

    // ===========================================
    // Lấy danh sách món
    // ===========================================
    const allRecipes = await Recipe.find({
      deleted: false,
      recipeState: "published",
    })
      .select(
        "name ingredients image createdBy nutritionalInfo servings cookTime"
      )
      .populate("createdBy", "fullName avatar");

    // ===========================================
    // V7: MUST MATCH ALL USER INGREDIENTS
    // ===========================================
    const results = allRecipes.map((r) => {
      const ingList = r.ingredients || [];

      // Kiểm tra xem món có đủ tất cả nguyên liệu user yêu cầu
      const userMustHaveAll = userClean.every((userIng) =>
        ingList.some((recipeIng) => matchIngredientV6(recipeIng.name, userIng))
      );

      if (!userMustHaveAll) return null; // loại món không đủ nguyên liệu user nhập

      // Nếu match ALL → tính match detail
      let matchedCount = 0;
      const missingIngredients = [];

      for (const ing of ingList) {
        let ok = false;
        for (let i = 0; i < userClean.length; i++) {
          if (matchIngredientV6(ing.name, userClean[i])) {
            ok = true;
            break;
          }
        }
        if (ok) matchedCount++;
        else {
          missingIngredients.push({
            name: ing.name,
            quantity: ing.quantity || "",
            unit: ing.unit || "",
          });
        }
      }

      const total = ingList.length || 1;
      const matchPercentage = Math.round((matchedCount / total) * 100);

      const finalScore = matchPercentage - missingIngredients.length * 2;

      return {
        recipeId: r._id,
        name: r.name,
        image: r.image,
        createdBy: r.createdBy,
        matchPercentage,
        missingIngredients,
        hasEnoughForAtLeastOne: missingIngredients.length === 0,
        servingsPossible: missingIngredients.length === 0 ? r.servings || 1 : 0,
        servings: r.servings,
        cookTime: r.cookTime || 0,
        finalScore,
        dietaryTags: autoNutritionTags(r),
      };
    });

    // ===========================================
    // Trả kết quả
    // ===========================================
    const finalResults = results
      .filter((r) => r !== null)
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 50);

    return res.status(200).json({
      message: "Tìm kiếm thành công",
      total: finalResults.length,
      recipes: finalResults,
    });
  } catch (err) {
    console.error("❌ Lỗi searchRecipesByIngredients V7:", err);
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

module.exports.suggestByIngredientsAndGroup = async (req, res) => {
  try {
    const { ingredients: userIngredients, groupId, categoryId } = req.body;

    // Lấy danh sách categoryId theo group nếu groupId có
    let categoriesFilter = {};
    if (groupId) {
      const cats = await Category.find(
        { group: groupId, deleted: false },
        "_id"
      );
      const catIds = cats.map((c) => c._id);
      categoriesFilter.category = { $in: catIds };
    }
    if (categoryId) categoriesFilter.category = categoryId;

    const recipes = await Recipe.find(categoriesFilter).lean();

    // chuẩn hóa userIngredients -> map name_lower => {quantity, unit}
    const userMap = {};
    userIngredients.forEach((i) => {
      userMap[i.name_normalized || i.name.toLowerCase().trim()] = {
        quantity: i.quantity || 0,
        unit: i.unit || "",
      };
    });

    const results = recipes.map((r) => {
      let total = r.ingredients.length;
      let scoreSum = 0; // sum of per-ingredient match (0..1)
      const missing = [];

      r.ingredients.forEach((ing) => {
        const key = (ing.name_normalized || ing.name).toLowerCase().trim();
        const userIng = userMap[key];
        if (!userIng) {
          // missing -> score 0
          missing.push(ing);
        } else {
          // compare quantity (assume same unit; ideally convert units)
          const reqQty = Number(ing.quantity || 0);
          const haveQty = Number(userIng.quantity || 0);
          let match = 0;
          if (reqQty === 0)
            match = 1; // if recipe doesn't require numeric quantity
          else {
            match = Math.min(haveQty / reqQty, 1); // 0..1
          }
          scoreSum += match;
        }
      });

      const matchRate = Math.round((scoreSum / total) * 100);

      return {
        _id: r._id,
        name: r.name,
        image: r.image,
        category: r.category,
        matchRate,
        missingIngredients: missing,
      };
    });

    results.sort((a, b) => b.matchRate - a.matchRate);
    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports.getRecipes = async (req, res) => {
  try {
    let { page = 1, limit = 10, search, tag, status } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = {};
    if (search && search.trim() !== "" && tag && tag.trim() !== "") {
      const cleanKeyword = Helper.removeDiacritics(search);
      const cleanTag = Helper.removeDiacritics(tag);
      filter.$and = [
        {
          $or: [
            { name_normalized: { $regex: cleanKeyword, $options: "i" } },
            {
              "ingredients.name_normalized": {
                $regex: cleanKeyword,
                $options: "i",
              },
            },
            {
              "seasonings.name_normalized": {
                $regex: cleanKeyword,
                $options: "i",
              },
            },
            { tags_normalized: { $regex: cleanKeyword, $options: "i" } },
          ],
        },
        { tags_normalized: { $regex: cleanTag, $options: "i" } },
      ];
    } else if (search && search.trim() !== "") {
      const cleanKeyword = Helper.removeDiacritics(search);
      filter.$or = [
        { name_normalized: { $regex: cleanKeyword, $options: "i" } },
        {
          "ingredients.name_normalized": {
            $regex: cleanKeyword,
            $options: "i",
          },
        },
        {
          "seasonings.name_normalized": {
            $regex: cleanKeyword,
            $options: "i",
          },
        },
        { tags_normalized: { $regex: cleanKeyword, $options: "i" } },
      ];
    } else if (tag && tag.trim() !== "") {
      const cleanTag = Helper.removeDiacritics(tag);
      filter.tags_normalized = { $regex: cleanTag, $options: "i" };
    }

    if (!req.user || req.user.role !== "admin") {
      filter.status = "approved";
    } else if (status) {
      filter.status = status;
    }
    const recipes = await Recipe.find(filter)
      .populate("createdBy", "fullName avatar")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Recipe.countDocuments(filter);
    res.status(200).json({
      message: "Lấy thành công",
      total,
      page,
      totalPages: Math.ceil(total / limit),
      recipes,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const recipe = await Recipe.findById(id)
      .populate("createdBy", "fullName avatar address description")
      .populate("tags", "name")
      .lean();

    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }

    // Lưu lịch sử xem
    if (userId) {
      await RecentView.findOneAndUpdate(
        { userId, recipeId: id },
        { viewedAt: new Date() },
        { upsert: true, new: true }
      );

      const follow = await Follow.findOne({
        follower_id: userId,
        following_id: recipe.createdBy._id,
      });
      recipe.isFollowing = !!follow;
    }

    // dietaryTags được tính động
    const dietaryTags = autoNutritionTags(recipe);

    // poisonRisk đã lưu DB → trả luôn
    const poisonRisk = recipe.poisonRisk || null;

    // Comments
    const comments = await Comment.find({ recipeId: id })
      .populate("userId", "fullName avatar")
      .sort({ createdAt: -1 });

    // Ratings
    const ratings = await Rating.find({ recipeId: id });
    let averageRating = 0;
    if (ratings.length > 0) {
      const total = ratings.reduce((sum, r) => sum + r.value, 0);
      averageRating = (total / ratings.length).toFixed(1);
    }

    return res.status(200).json({
      message: "Lấy thành công",
      recipe,
      dietaryTags,
      poisonRisk,
      comments,
      ratings: {
        total: ratings.length,
        average: Number(averageRating),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.filterByNutritionTag = async (req, res) => {
  try {
    const { tag } = req.query; // ví dụ: isProteinRich

    if (!tag || tag.trim() === "") {
      return res.status(400).json({ message: "Thiếu nutrition tag" });
    }

    // Lấy tất cả công thức và tính tag tự động
    const recipes = await Recipe.find({ deleted: false })
      .select(
        "name image nutritionalInfo dietaryTags cookTime servings createdBy"
      )
      .populate("createdBy", "fullName avatar")
      .lean();

    // Lọc theo tag được tính động
    const filtered = recipes.filter((r) => {
      const tags = autoNutritionTags(r);
      return tags[tag] === true;
    });

    res.status(200).json({
      message: "Lọc theo dinh dưỡng thành công",
      tag,
      total: filtered.length,
      recipes: filtered,
    });
  } catch (error) {
    console.error("❌ Lỗi filterByNutritionTag:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find({ deleted: false })
      .select("name description image name_normalized")
      .sort({ name: 1 });

    const formattedCategories = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      description: cat.description,
      image: cat.image,
    }));

    res.status(200).json({ categories: formattedCategories });
  } catch (error) {
    console.error("Lỗi Server khi tải danh mục công khai:", error);
    res
      .status(500)
      .json({ message: "Lỗi Server khi tải danh mục.", error: error.message });
  }
};

module.exports.getRecipesByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // 2. 🎯 TÌM CÔNG THỨC BẰNG CATEGORY ID TRỰC TIẾP
    const recipes = await Recipe.find({
      category: id, // SỬ DỤNG TRƯỜNG MỚI (ObjectId Reference)
      deleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({ recipes });
  } catch (error) {
    console.error("Lỗi Server khi tải công thức theo danh mục:", error);
    res
      .status(500)
      .json({ message: "Lỗi Server khi tải công thức.", error: error.message });
  }
};
module.exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }
    if (
      recipe.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(400).json({ message: "Bạn không có quyền xóa" });
    }
    await Recipe.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa món ăn thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.getRecipesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const recipes = await Recipe.find({ createdBy: userId })
      .populate("createdBy", "fullName avatar")
      .populate("categories", "name")
      .populate("tags", "name")
      .sort({ createdAt: -1 });

    if (!recipes || recipes.length === 0) {
      return res
        .status(404)
        .json({ message: "Người dùng này chưa đăng món nào" });
    }

    res.status(200).json({ total: recipes.length, recipes });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
// module.exports.searchRecipes = async (req, res) => {
//   try {
//     const { keyword } = req.body;
//     if (!keyword || keyword.trim() === "") {
//       return res
//         .status(400)
//         .json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
//     }
//     const recipes = await Recipe.find({
//       $or: [
//         { name: { $regex: keyword, $options: "i" } },
//         { "ingredients.name": { $regex: keyword, $options: "i" } },
//         {
//           tags_normalized: {
//             $regex: Helper.removeDiacritics(keyword),
//             $options: "i",
//           },
//         },
//       ],
//       status: "approved",
//     })
//       .populate("createdBy", "fullName avatar")
//       .sort({ createdAt: -1 });
//     res
//       .status(200)
//       .json({ message: "Lấy thành công", total: recipes.length, recipes });
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi server", error: error.message });
//   }
// };
module.exports.suggestRecipe = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const cleanKeyword = Helper.removeDiacritics(keyword.trim().toLowerCase());

    // 1. Tìm theo nguyên liệu (quan trọng nhất)
    const ingredientMatches = await Recipe.aggregate([
      { $unwind: "$ingredients" },
      {
        $match: {
          "ingredients.name_normalized": {
            $regex: "^" + cleanKeyword, // match theo đầu từ
            $options: "i",
          },
        },
      },
      {
        $project: {
          text: "$ingredients.name",
          score: 200,
        },
      },
      { $limit: 20 },
    ]);

    // 2. Tìm theo tên món
    const recipeMatches = await Recipe.find({
      name_normalized: { $regex: cleanKeyword, $options: "i" },
    })
      .select("name")
      .limit(10);

    const recipeFormatted = recipeMatches.map((r) => ({
      text: r.name,
      score: 150,
    }));

    // 3. Tìm theo gia vị
    const seasoningMatches = await Recipe.aggregate([
      { $unwind: "$seasonings" },
      {
        $match: {
          "seasonings.name_normalized": {
            $regex: "^" + cleanKeyword,
            $options: "i",
          },
        },
      },
      {
        $project: {
          text: "$seasonings.name",
          score: 120,
        },
      },
      { $limit: 15 },
    ]);

    // 4. Tìm theo tags / chủ đề
    const tagMatches = await Recipe.aggregate([
      { $unwind: "$tags" },
      {
        $match: {
          tags: { $regex: cleanKeyword, $options: "i" },
        },
      },
      {
        $project: {
          text: "$tags",
          score: 80,
        },
      },
      { $limit: 10 },
    ]);

    // Gộp tất cả
    const all = [
      ...ingredientMatches,
      ...recipeFormatted,
      ...seasoningMatches,
      ...tagMatches,
    ];

    // Loại trùng
    const seen = new Set();
    const final = [];

    for (const item of all) {
      if (!item.text) continue;
      if (!seen.has(item.text.toLowerCase())) {
        seen.add(item.text.toLowerCase());
        final.push(item);
      }
    }

    // Sort theo score
    final.sort((a, b) => b.score - a.score);

    // Chỉ trả về tối đa 7 gợi ý
    res.status(200).json({
      message: "Lấy gợi ý thành công",
      keyword,
      total: final.length,
      suggestions: final.slice(0, 7).map((i) => i.text),
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.getPersonalizedSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Unauthorized" });
    }
    const history = await SearchHistory.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    if (!history) {
      return res.status(400).json({ message: "Chưa có lịch sử tìm kiếm" });
    }

    const keywords = history.map((h) =>
      Helper.removeDiacritics(h.keyword).toLowerCase()
    );

    const recipes = await Recipe.find({
      $or: [
        { name_normalized: { $in: keywords.map((k) => new RegExp(k, "i")) } },
        {
          "ingredients.name_normalized": {
            $in: keywords.map((k) => new RegExp(k, "i")),
          },
        },
        { tags_normalized: { $in: keywords.map((k) => new RegExp(k, "i")) } },
      ],
      status: "approved",
    }).limit(10);

    res.status(200).json({
      message: "Gợi ý trên lịch sử tìm kiếm",
      keywords,
      total: recipes.length,
      suggestions: recipes,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.saveRecipe = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    const exist = await Recipe.findOne({
      _id: recipeId,
      "savedBy.userId": userId,
    });
    if (!exist) {
      const recipe = await Recipe.findByIdAndUpdate(
        recipeId,
        {
          $push: { savedBy: { userId } },
        },
        { new: true }
      )
        .populate("createdBy", "fullName avatar address description")
        .populate("tags", "name");
      return res.status(200).json({ message: "Lưu thành công", recipe });
    }
    const recipe = await Recipe.findByIdAndUpdate(
      recipeId,
      {
        $pull: { savedBy: { userId } },
      },
      { new: true }
    )
      .populate("createdBy", "fullName avatar address description")
      .populate("tags", "name");
    return res.status(200).json({ message: "Bỏ lưu thành công", recipe });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.reactions = async (req, res) => {
  try {
    const { recipeId, userId, reaction } = req.body;
    const recipe = await Recipe.findById(recipeId)
      .populate("createdBy", "fullName avatar address description")
      .populate("tags", "name");
    if (!recipe)
      return res.status(404).json({ message: "Không tìm thấy món nào" });
    const exist = recipe.userReactions.find(
      (r) => r.userId.toString() === userId
    );

    if (!exist) {
      recipe.userReactions.push({ userId, reaction });
      recipe.reactions[reaction] += 1;
    } else if (exist.reaction === reaction) {
      recipe.userReactions = recipe.userReactions.filter(
        (r) => r.userId.toString() !== userId
      );
      recipe.reactions[reaction] -= 1;
    } else {
      recipe.reactions[exist.reaction] -= 1;
      exist.reaction = reaction;
      recipe.reactions[reaction] += 1;
    }
    const comments = await Comment.find({ recipeId: recipeId })
      .populate("userId", "fullName avatar")
      .sort({ createdAt: -1 });

    const ratings = await Rating.find({ recipeId: recipeId });
    let averageRating = 0;
    if (ratings.length > 0) {
      const total = ratings.reduce((sum, r) => sum + r.value, 0);
      averageRating = (total / ratings.length).toFixed(1);
    }
    await recipe.save();
    res.status(200).json({
      message: "Lấy thành công",
      recipe,
      comments,
      ratings: {
        total: ratings.length,
        average: Number(averageRating),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.updateNumberCooking = async (req, res) => {
  try {
    const { recipeId, userId } = req.body;

    const user = await Account.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const alreadyCooked = user?.cookedRecipes?.some(
      (r) => r.recipeId.toString() === recipeId.toString()
    );

    if (alreadyCooked) {
      return res.status(200).json({ message: "Bạn đã nấu món này rồi" });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe)
      return res.status(404).json({ message: "Không tìm thấy công thức" });

    recipe.cookHistory.push({ userId, date: new Date() });
    recipe.cookingNumber += 1;
    await recipe.save();

    await Account.findByIdAndUpdate(userId, {
      $push: { cookedRecipes: { recipeId, cookedAt: new Date() } },
    });

    res.status(200).json({
      message: "Ghi nhận lượt nấu thành công",
      total: recipe.cookingNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.getSimilarRecipes = async (req, res) => {
  try {
    const { id } = req.params;
    // Lấy công thức hiện tại
    const current = await Recipe.findById(id);
    if (!current) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }

    // Gộp danh sách tag + ingredients
    const tagList = current.tags_normalized || [];
    const ingredientList =
      current.ingredients?.map((i) => i.name_normalized) || [];
    // Nếu không có tag/ingredient nào thì trả về rỗng
    if (tagList.length === 0 && ingredientList.length === 0) {
      return res.json({ message: "Không có món tương tự", recipes: [] });
    }

    // Tìm món tương tự
    const similarRecipes = await Recipe.find({
      _id: { $ne: current._id }, // loại chính nó ra
      deleted: false,
      // status: "approved",
      $or: [
        { tags_normalized: { $in: tagList } },
        { "ingredients.name_normalized": { $in: ingredientList } },
      ],
    })
      .limit(12)
      .select("name image cookTime createdBy tags description")
      .populate("createdBy", "fullName avatar");

    res.status(200).json({
      message: "Lấy món tương tự thành công",
      total: similarRecipes.length,
      similarRecipes,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.getUserRecipes = async (req, res) => {
  try {
    const userId = req.user.id;
    const drafts = await Recipe.find({
      createdBy: userId,
      recipeState: "draft",
      deleted: false,
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "fullName avatar");
    const published = await Recipe.find({
      createdBy: userId,
      recipeState: "published",
      deleted: false,
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "fullName avatar");

    const saved = await Recipe.find({
      "savedBy.userId": userId,
      deleted: false,
    })
      .sort({ "savedBy.savedAt": -1 })
      .populate("createdBy", "fullName avatar");
    const authored = [...published, ...drafts];
    const account = await Account.findById(userId)
      .populate("cookedRecipes.recipeId")
      .sort({ createdAt: -1 })
      .lean();
    const cook = account?.cookedRecipes.map((item) => item.recipeId);

    const cooked = cook.map((item) => ({
      ...item,
      createdBy: { fullName: account.fullName, avatar: account.avatar },
    }));
    return res.status(200).json({
      message: "Lấy thành công",
      recipe: {
        drafts,
        published,
        saved,
        authored,
        cooked,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ nội bộ khi lấy danh sách công thức.",
    });
  }
};
module.exports.searchRecipes = async (req, res) => {
  console.log(123);
  try {
    const { keyword, userId, page = 1, limit = 10 } = req.query;
    if (!keyword || keyword.trim() === "") {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
    }

    const cleanKeyword = Helper.removeDiacritics(keyword).toLowerCase();

    // Lưu log
    await SearchLog.create({
      keyword,
      keyword_normalized: cleanKeyword,
      userId: userId || null,
    });
    const filter = {
      // status: "approved",
      $or: [
        { name_normalized: { $regex: cleanKeyword, $options: "i" } },
        {
          "ingredients.name_normalized": {
            $regex: cleanKeyword,
            $options: "i",
          },
        },
        {
          "seasonings.name_normalized": { $regex: cleanKeyword, $options: "i" },
        },
        { tags_normalized: { $regex: cleanKeyword, $options: "i" } },
      ],
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const topRecipes = await Recipe.find({
      // status: "approved",
      $or: [
        { name_normalized: { $regex: cleanKeyword, $options: "i" } },
        { tags_normalized: { $regex: cleanKeyword, $options: "i" } },
        {
          "ingredients.name_normalized": {
            $regex: cleanKeyword,
            $options: "i",
          },
        },
        {
          "seasonings.name_normalized": { $regex: cleanKeyword, $options: "i" },
        },
      ],
    })
      .sort({ views: -1, likes: -1 })
      .limit(4)
      .populate("createdBy", "fullName avatar")
      .lean();

    const recipes = await Recipe.find(filter)
      .populate("createdBy", "fullName avatar")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

    const total = await Recipe.countDocuments(filter);

    res.status(200).json({
      message: "Tìm kiếm thành công",
      keyword,
      total,
      topRecipes,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      recipes,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.similarSearch = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ message: "Thiếu từ khóa" });
    }

    const cleanKeyword = Helper.removeDiacritics(keyword.toLowerCase());
    const keywordLower = cleanKeyword.toLowerCase();

    // 🔍 Tìm trong ingredients và seasonings
    const recipes = await Recipe.find({
      $or: [
        {
          "ingredients.name_normalized": {
            $regex: cleanKeyword,
            $options: "i",
          },
        },
        {
          "seasonings.name_normalized": { $regex: cleanKeyword, $options: "i" },
        },
      ],
      // status: "approved", // chỉ lấy món đã duyệt
    })
      .limit(100)
      .select("ingredients seasonings image")
      .lean();

    const suggestions = [];

    recipes.forEach((r) => {
      // Nguyên liệu
      r.ingredients?.forEach((i) => {
        if (
          Helper.removeDiacritics(i.name).toLowerCase().includes(keywordLower)
        ) {
          suggestions.push({
            text: i.name,
            image: r.image,
            score: 3,
          });
        }
      });

      // Gia vị
      r.seasonings?.forEach((s) => {
        if (
          Helper.removeDiacritics(s.name).toLowerCase().includes(keywordLower)
        ) {
          suggestions.push({
            text: s.name,
            image: r.image,
            score: 2,
          });
        }
      });
    });

    // 🔢 Loại trùng & sắp xếp
    const unique = [];
    const seen = new Set();

    suggestions.forEach((s) => {
      const key = Helper.removeDiacritics(s.text).toLowerCase();
      if (!seen.has(key) && s.text.length > keyword.length) {
        seen.add(key);
        unique.push(s);
      }
    });

    unique.sort((a, b) => b.score - a.score);

    res.status(200).json({
      message: "Lấy nguyên liệu và gia vị thành công",
      keyword,
      total: unique.length,
      suggestions: unique.slice(0, 10), // ✅ Chỉ trả text + image
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.getTrendingKeywords = async (req, res) => {
  try {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h gần nhất

    const trending = await SearchLog.aggregate([
      { $match: { searchedAt: { $gte: last24h } } },
      {
        $group: {
          _id: "$keyword_normalized",
          keyword: { $first: "$keyword" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // tìm ảnh minh họa cho mỗi từ khóa
    const results = await Promise.all(
      trending.map(async (t) => {
        const recipe = await Recipe.findOne({
          $or: [
            { name_normalized: { $regex: t._id, $options: "i" } },
            { tags_normalized: { $regex: t._id, $options: "i" } },
          ],
        })
          .select("image")
          .lean();

        return {
          keyword: t.keyword,
          image:
            recipe?.image ||
            "https://global-web-assets.cpcdn.com/assets/blank4x3-59a0a9ef4e6c3432579cbbd393fb1f1f98d52b9b66a9aae284872b67434274b8.png",
          count: t.count,
        };
      })
    );

    res.status(200).json({
      message: "Lấy từ khóa thịnh hành thành công",
      updatedAt: new Date(),
      keywords: results,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.getRecentViews = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Thiếu userId" });
    }

    const views = await RecentView.find({ userId })
      .sort({ viewedAt: -1 })
      .limit(10)
      .populate({
        path: "recipeId",
        select: "name image createdBy ingredients cookTime servings",
        populate: { path: "createdBy", select: "fullName avatar" },
      })
      .lean();

    const recentRecipes = views
      .filter((v) => v.recipeId)
      .map((v) => ({
        _id: v.recipeId._id,
        name: v.recipeId.name,
        image: v.recipeId.image,
        viewedAt: v.viewedAt,
        author: v.recipeId.createdBy,
        ingredients: v.recipeId.ingredients,
        cookTime: v.recipeId.cookTime,
        servings: v.recipeId.servings,
      }));

    res.status(200).json({
      message: "Lấy món xem gần đây thành công",
      total: recentRecipes.length,
      recipes: recentRecipes,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.deleteViewedRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({ message: "Thiếu ID món ăn cần xóa" });
    }

    await ViewedRecipe.findOneAndDelete({ userId, recipeId });

    res.status(200).json({ message: "Đã xóa món khỏi lịch sử xem gần đây" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.clearAllViewedRecipes = async (req, res) => {
  try {
    const userId = req.user.id;
    await ViewedRecipe.deleteMany({ userId });

    res.status(200).json({ message: "Đã xóa toàn bộ lịch sử món đã xem" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.filterIncludeIngredients = async (req, res) => {
  try {
    let { ingredients } = req.query;

    if (!ingredients) {
      return res.status(400).json({ message: "Thiếu danh sách nguyên liệu" });
    }
    const list = ingredients
      .split(",")
      .map((i) => Helper.removeDiacritics(i.trim().toLowerCase()))
      .filter((i) => i);

    const recipes = await Recipe.find({
      $and: list.map((ing) => ({
        "ingredients.name_normalized": { $regex: ing, $options: "i" },
      })),
      // status: "approved",
    })
      .select("name image ingredients createdBy cookTime servings")
      .populate("createdBy", "fullName avatar")
      .limit(50);

    console.log;
    res.status(200).json({
      message: "Lọc thành công",
      total: recipes.length,
      ingredients: list,
      recipes,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.filterExcludeIngredients = async (req, res) => {
  try {
    let { ingredients } = req.query;

    if (!ingredients) {
      return res.status(400).json({ message: "Thiếu danh sách nguyên liệu" });
    }

    const list = ingredients
      .split(",")
      .map((i) => Helper.removeDiacritics(i.trim().toLowerCase()))
      .filter((i) => i);

    const recipes = await Recipe.find({
      $and: list.map((ing) => ({
        "ingredients.name_normalized": { $not: { $regex: ing, $options: "i" } },
      })),
      // status: "approved",
    })
      .select("name image ingredients createdBy cookTime servings")
      .populate("createdBy", "fullName avatar")
      .limit(50);

    res.status(200).json({
      message: "Lọc thành công",
      exclude: list,
      total: recipes.length,
      recipes,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.publishRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({ message: "Thiếu ID công thức" });
    }

    const recipe = await Recipe.findOne({ _id: id, createdBy: userId });

    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy công thức" });
    }

    if (recipe.recipeState === "published") {
      return res
        .status(200)
        .json({ message: "Công thức đã được đăng trước đó" });
    }

    recipe.recipeState = "published";
    recipe.status = "pending";
    if (recipe.image === "") {
      recipe.image =
        "https://global-web-assets.cpcdn.com/assets/blank4x3-59a0a9ef4e6c3432579cbbd393fb1f1f98d52b9b66a9aae284872b67434274b8.png";
    }
    await recipe.save();

    return res.status(200).json({
      message: "Cập nhật trạng thái thành công",
      recipe,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server khi cập nhật trạng thái công thức",
      error: error.message,
    });
  }
};

module.exports.addRecipeView = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!recipe)
      return res.status(404).json({ message: "Không tìm thấy công thức" });

    res
      .status(200)
      .json({ message: "Đã cập nhật lượt xem", views: recipe.views });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.getUserStatistics = async (req, res) => {
  console.log(123);
  try {
    const { userId } = req.params;
    console.log(userId);
    console.log(userId);
    // Lấy danh sách món do user đăng
    const recipes = await Recipe.find({ createdBy: userId });
    if (!recipes.length) {
      return res.status(200).json({
        message: "Người dùng chưa có công thức nào",
        totalRecipes: 0,
        chartData: [],
        summary: { views: 0, saves: 0, prints: 0 },
      });
    }

    // Tổng lượt xem, lưu, in
    let totalViews = 0;
    let totalSaves = 0;
    let totalPrints = 0;

    const now = new Date();
    const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));

    // Dữ liệu biểu đồ theo ngày
    const chartData = {};

    recipes.forEach((recipe) => {
      totalViews += recipe.views || 0;
      totalSaves += recipe.savedBy?.length || 0;
      totalPrints += recipe.printCount || 0;

      // Nếu có mốc thời gian updatedAt -> ghi nhận biểu đồ
      const date = new Date(recipe.updatedAt).toISOString().slice(0, 10);
      if (!chartData[date]) chartData[date] = 0;
      chartData[date] += (recipe.views || 0) + (recipe.savedBy?.length || 0);
    });

    const formattedChart = Object.keys(chartData).map((date) => ({
      date,
      value: chartData[date],
    }));

    res.status(200).json({
      message: "Thống kê thành công",
      totalRecipes: recipes.length,
      summary: {
        views: totalViews,
        saves: totalSaves,
        prints: totalPrints,
      },
      chartData: formattedChart,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.getUserActivityChart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Lấy toàn bộ công thức của user
    const recipes = await Recipe.find({ createdBy: userId })
      .select("views savedBy updatedAt createdAt")
      .lean();

    if (!recipes.length)
      return res.status(200).json({
        message: "Không có công thức nào",
        data: [],
      });

    // Mốc thời gian 90 ngày
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 90);

    // Tạo mảng rỗng chứa các ngày trong 90 ngày qua
    const days = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const formatted = d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
      days.push({ date: formatted, count: 0 });
    }

    // Giả lập phân bổ lượt xem theo ngày (hoặc lấy từ viewHistory nếu có)
    recipes.forEach((recipe) => {
      const day = new Date(recipe.updatedAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
      const found = days.find((d) => d.date === day);
      if (found)
        found.count += (recipe.views || 0) + (recipe.savedBy?.length || 0);
    });

    return res.status(200).json({
      message: "Thống kê hoạt động theo ngày",
      data: days,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.getUserCookedActivity = async (req, res) => {
  try {
    const { userId } = req.params;

    const recipes = await Recipe.find({ createdBy: userId })
      .select("cookHistory")
      .lean();

    if (!recipes.length)
      return res.status(200).json({
        message: "Không có công thức nào",
        data: [],
      });

    // Mốc thời gian 90 ngày
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 90);

    // Tạo danh sách 90 ngày
    const days = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const formatted = d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
      days.push({ date: formatted, count: 0 });
    }

    // Đếm số lượt nấu theo ngày
    recipes.forEach((recipe) => {
      (recipe.cookHistory || []).forEach((cook) => {
        const day = new Date(cook.date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        });
        const found = days.find((d) => d.date === day);
        if (found) found.count += 1;
      });
    });

    return res.status(200).json({
      message: "Thống kê lượt đã nấu trong 90 ngày qua",
      data: days,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.reportRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { userId, reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res
        .status(400)
        .json({ message: "Lý do báo cáo không được để trống" });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy công thức" });
    }

    const alreadyReported = recipe.reports.some(
      (r) =>
        r.userId?.toString() === userId?.toString() &&
        r.reason?.toLowerCase() === reason.toLowerCase()
    );

    if (alreadyReported) {
      return res
        .status(400)
        .json({ message: "Bạn đã báo cáo lý do này trước đó" });
    }

    const user = await Account.findById(userId).select("fullName avatar");
    const isAnonymous = !user;

    recipe.reports.push({
      userId: isAnonymous ? null : userId,
      reason,
      handled: false,
      createdAt: new Date(),
    });

    await recipe.save();

    res.status(200).json({
      message: "Gửi báo cáo thành công",
      reports: recipe.reports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
