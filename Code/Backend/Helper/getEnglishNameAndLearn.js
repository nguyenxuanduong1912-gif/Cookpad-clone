const IngredientMapping = require("../models/ingredientsMapping");
const translate = require("google-translate-api-x");
const { INGREDIENT_MAP } = require("../Utils/TranslateToEnglish.json");

module.exports.getEnglishNameAndLearn = async (vietnameseName) => {
  if (!vietnameseName) return "";

  const key = vietnameseName.toLowerCase().trim();

  // 1️⃣ Tra trong JSON tĩnh
  if (INGREDIENT_MAP[key]) {
    console.log(`⚡ Local map hit: ${key} → ${INGREDIENT_MAP[key]}`);
    return INGREDIENT_MAP[key];
  }

  // 2️⃣ Tra trong DB cache
  let mapping = await IngredientMapping.findOne({ vietnameseName: key });
  if (mapping) {
    console.log(`🧠 DB cache hit: ${key} → ${mapping.englishStandardName}`);
    return mapping.englishStandardName;
  }

  // 3️⃣ Nếu chưa có → dịch tự động và lưu
  try {
    await new Promise((r) => setTimeout(r, 300)); // tránh spam
    const res = await translate(key, { from: "vi", to: "en" });
    const englishName = res.text.trim().toLowerCase();

    await IngredientMapping.create({
      vietnameseName: key,
      englishStandardName: englishName,
      source: "Google_Translate_API",
    });

    console.log(`✅ [LEARNED] ${key} → ${englishName}`);
    return englishName;
  } catch (error) {
    console.error(`❌ [ERROR] Dịch thất bại cho "${key}":`, error.message);
    return key; // fallback an toàn
  }
};
