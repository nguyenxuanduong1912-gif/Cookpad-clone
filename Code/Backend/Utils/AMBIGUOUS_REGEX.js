const AMBIGUOUS_KEYWORDS = [
  // Các từ chỉ định lượng mơ hồ
  "vừa đủ",
  "tùy thích",
  "một chút",
  "một ít",
  "chút ít",
  "chút xíu",
  "tí",
  "tí xíu",
  "chút",
  "nhẹ",
  "vừa phải",

  // Các từ chỉ nêm nếm hoặc tùy chỉnh theo khẩu vị
  "nêm",
  "nêm nếm",
  "theo khẩu vị",
  "vừa ăn",
  "cho vừa miệng",
  "tùy vị",
  "tùy khẩu vị",
  "tùy người ăn",
  "tùy theo ý thích",

  // Các cụm từ gợi ý lượng ước chừng
  "ít một",
  "nhiều ít tùy ý",
  "vừa",
  "vừa vừa",
  "vừa chừng",
  "đủ dùng",
  "đủ",
  "thêm chút",
  "thêm ít",
  "thêm tí",
  "tùy lượng",
  "tùy ý",
  "khoảng",
  "ước chừng",
  "xấp xỉ",

  // Các từ cảm tính (không có định lượng chính xác)
  "nhẹ tay",
  "mạnh tay",
  "đậm",
  "nhạt",
  "thật nhiều",
  "hơi nhiều",
  "một nhúm",
  "một vốc",
  "một nắm",
  "một ít xíu",
];
// Tạo một Biểu thức Chính quy duy nhất (Regex)
// Tham số 'i' (case-insensitive) giúp bỏ qua việc phân biệt chữ hoa/thường
const AMBIGUOUS_REGEX = new RegExp(AMBIGUOUS_KEYWORDS.join("|"), "i");

module.exports = { AMBIGUOUS_REGEX };
