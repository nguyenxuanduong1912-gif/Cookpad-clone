const { GoogleGenAI } = require("@google/genai");

const GEMINI_MODEL = "gemini-2.5-flash"; // Mô hình nhanh và hiệu quả nhất cho tác vụ này

// Khởi tạo client, sử dụng Key từ biến môi trường
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Gửi yêu cầu đến Gemini để chuẩn hóa nguyên liệu.
 * @param {string} vietnameseIngredient Tên nguyên liệu tiếng Việt (ví dụ: '100g thịt gà').
 * @returns {Promise<string>} Chuỗi tiếng Anh đã chuẩn hóa.
 */
async function normalizeIngredientWithGemini(vietnameseIngredient) {
  // 💡 TỐI ƯU HÓA PROMPT (Rất quan trọng cho sự chính xác)
  const prompt = `
        Bạn là chuyên gia chuyển đổi công thức nấu ăn. Nhiệm vụ của bạn là dịch và chuẩn hóa nguyên liệu sau: "${vietnameseIngredient}".
        QUY TẮC CHUẨN HÓA:
        1. Dịch tên nguyên liệu sang tiếng Anh chuẩn hóa.
        2. Chuẩn hóa đơn vị đo lường (nếu có) về mã chuẩn (g, kg, ml, tbsp, tsp, cup, unit).
        3. Nếu đơn vị mơ hồ ('vừa đủ', 'ít', 'nhúm', 'cây'), hãy bỏ qua đơn vị và chỉ trả về tên nguyên liệu tiếng Anh.
        4. TRẢ VỀ DUY NHẤT một chuỗi chỉ chứa KẾT QUẢ CHUẨN HÓA. Không giải thích, không thêm bất kỳ văn bản nào khác.
        
        VÍ DỤ TRẢ VỀ: '100 g chicken breast' hoặc 'salt'
    `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        // Giảm temperature để trả lời trực tiếp và ngắn gọn
        temperature: 0.1,
        // Giới hạn số token đầu ra để tăng tốc độ
        maxOutputTokens: 64,
      },
    });

    // Gemini trả về text trực tiếp
    return response.text;
  } catch (error) {
    console.error(`[GEMINI ERROR] Lỗi gọi API Gemini:`, error.message);
    // Trả về tên gốc để logic backend xử lý thất bại (Fallback)
    return vietnameseIngredient.trim();
  }
}

module.exports = { normalizeIngredientWithGemini };
