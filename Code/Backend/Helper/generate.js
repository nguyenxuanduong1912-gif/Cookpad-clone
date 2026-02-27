const IngredientMapping = require("../../Backend/Utils/TranslateToEnglish.json");
const Helper = require("../Helper/getEnglishNameAndLearn");

const translate = require("google-translate-api-x");
module.exports.generate = (length) => {
  let result = "";
  const String =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i > length; i++) {
    result += String.charAt(Math.floor(Math.random() * String.length));
  }
  return result;
};

module.exports.generateNumber = (length) => {
  let result = "";
  const String = "0123456789";
  for (let i = 0; i < length; i++) {
    result += String.charAt(Math.floor(Math.random() * String.length));
  }
  const number = new Number(result);
  return number;
};
module.exports.removeDiacritics = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
};
function removeDiacritics(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}
function parseQuantity(quantityString = "") {
  if (!quantityString) return null;

  let str = quantityString.toString().trim();

  const unicodeFractions = {
    "¼": "1/4",
    "½": "1/2",
    "¾": "3/4",
    "⅐": "1/7",
    "⅑": "1/9",
    "⅒": "1/10",
    "⅓": "1/3",
    "⅔": "2/3",
    "⅕": "1/5",
    "⅖": "2/5",
    "⅗": "3/5",
    "⅘": "4/5",
    "⅙": "1/6",
    "⅚": "5/6",
    "⅛": "1/8",
    "⅜": "3/8",
    "⅝": "5/8",
    "⅞": "7/8",
  };

  for (const [char, fraction] of Object.entries(unicodeFractions)) {
    str = str.replace(new RegExp(char, "g"), fraction);
  }

  str = str.replace(",", ".").trim();

  // "1-1/2" → "1 1/2"
  str = str.replace(/(\d+)-(\d+\/\d+)/, "$1 $2");

  // 👉 BẮT PHÂN SỐ TRƯỚC KHI parseFloat
  // 1️⃣ Mixed number (1 1/2)
  const mixed = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return +mixed[1] + +mixed[2] / +mixed[3];

  // 2️⃣ Fraction only (1/2)
  const frac = str.match(/^(\d+)\/(\d+)$/);
  if (frac) return +frac[1] / +frac[2];

  // 3️⃣ Plain number
  const value = parseFloat(str);
  if (!isNaN(value)) return value;

  return null;
}

// function normalizeUnit(unitString) {
//   const { INGREDIENT_MAP, UNIT_MAP } = IngredientMapping;
//   const key = unitString.toLowerCase().trim();

//   // 1. KIỂM TRA BẰNG REGEX (Bước tiện lợi nhất)
//   if (AMBIGUOUS_REGEX.test(key)) {
//     return "to taste"; // Trả về giá trị an toàn nhất
//   }

//   // 2. Tra cứu Đơn vị Chuẩn (cho các đơn vị có số lượng)
//   const normalized = UNIT_MAP[key];

//   // 3. Fallback
//   return normalized || key;
// }
function normalizeUnit(unitString = "") {
  const { UNIT_MAP } = IngredientMapping;
  const key = unitString.toLowerCase().trim();

  // Bước 1. Regex bắt các đơn vị mơ hồ hoặc "tùy vị"
  const AMBIGUOUS_REGEX =
    /(vừa|ít|chút|nhiều|tùy|vừa đủ|tùy thích|vừa ăn|vừa miệng)/i;
  if (AMBIGUOUS_REGEX.test(key)) {
    return "to taste"; // Cách Edamam chấp nhận cho trường hợp "tùy ý"
  }

  // Bước 2. Nếu trùng trực tiếp trong UNIT_MAP
  if (UNIT_MAP[key]) return UNIT_MAP[key];

  // Bước 3. Suy luận qua từ khóa (fallback thông minh)
  if (key.includes("muong") || key.includes("thia")) return "tbsp";
  if (key.includes("bat") || key.includes("chen") || key.includes("ly"))
    return "cup";
  if (key.includes("chai") || key.includes("binh")) return "bottle";
  if (key.includes("lon") || key.includes("hop") || key.includes("goi"))
    return "package";
  if (key.includes("tep")) return "clove";
  if (key.includes("la")) return "leaf";
  if (key.includes("bo") || key.includes("canh")) return "bunch";
  if (key.includes("nhanh") || key.includes("canh")) return "stalk";
  if (key.includes("nam") || key.includes("voc")) return "handful";
  if (key.includes("chut") || key.includes("it")) return "pinch";
  if (key.includes("cay")) return "unit";

  // Bước 4. Nếu có các từ chỉ trọng lượng hoặc thể tích, mà không rõ ràng
  if (key.includes("kg") || key.includes("gam") || key.includes("g"))
    return "g";
  if (key.includes("ml") || key.includes("lit")) return "ml";

  // Bước 5. Nếu hoàn toàn không khớp — fallback mặc định
  return "unitless"; // để xử lý sau ở bước refineIngredientString
}

const translateCache = new Map();

const UNIT_TO_GRAM = {
  g: 1,
  kg: 1000,
  tbsp: 15,
  tsp: 5,
  cup: 240,
  clove: 3,
  slice: 30,
  piece: 50,
  unit: 100,
  package: 100,
  bag: 100,
  handful: 30,
  pinch: 1,
  bottle: 500,
  can: 300,
  bowl: 200,
};

module.exports.normalizeIngredientForOpenFoodFacts = async (
  ingredients = []
) => {
  const result = [];

  for (const ingredient of ingredients) {
    try {
      const quantity = parseQuantity(ingredient.quantity);
      const unitVi = (ingredient.unit || "").trim().toLowerCase();
      const nameVi = (ingredient.name || "").trim().toLowerCase();

      const engUnit = normalizeUnit(unitVi);

      // ✅ Giữ nguyên logic dịch của bạn
      let engName;
      if (translateCache.has(nameVi)) {
        engName = translateCache.get(nameVi);
      } else {
        const res = await Helper.getEnglishNameAndLearn(nameVi);
        engName =
          typeof res === "string"
            ? res.toLowerCase().trim()
            : res?.text?.toLowerCase().trim() || nameVi;
        translateCache.set(nameVi, engName);
      }

      // Sửa lỗi phổ biến
      engName = engName
        .replace(/\bshrimp garlic\b/gi, "garlic clove")
        .replace(/\brice bowl\b/gi, "rice")
        .replace(/\bthree only\b/gi, "pork belly")
        .replace(/\bsoup powder\b/gi, "seasoning powder")
        .replace(/\bchicken egg\b/gi, "egg")
        .replace(/\bfish sauce water\b/gi, "fish sauce");

      // Convert sang gram/ml nếu có mapping
      const grams = quantity * (UNIT_TO_GRAM[engUnit] || 100);

      // Output dùng cho Open Food Facts
      result.push({
        original: ingredient,
        name: engName,
        unit: engUnit,
        quantity,
        grams,
      });
    } catch (err) {
      console.error(
        `❌ Error normalizing "${ingredient.name}": ${err.message}`
      );
      result.push({ ...ingredient, name: ingredient.name, grams: 100 });
    }
  }

  return result;
};
