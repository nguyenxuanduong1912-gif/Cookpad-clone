const translate = require("translatte");
async function translateText(text) {
  if (!text || text.trim() === "") {
    return "";
  }

  try {
    const result = await translate(text, { from: "vi", to: "en" });
    return result.text.toLowerCase().trim();
  } catch (error) {
    console.error(
      `[ERROR] Lỗi dịch thuật API Google không chính thức cho "${text}":`,
      error.message
    );
    // Quan trọng: Khi dịch thất bại, trả về tên gốc để hệ thống tiếp tục xử lý, tránh dừng chương trình.
    return text.toLowerCase().trim();
  }
}

module.exports = { translateText };
