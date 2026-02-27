const SearchHistory = require("../../Models/searchHistory");
const Recipe = require("../../Models/recipes");
const Helper = require("../../Helper/generate");
const moment = require("moment");
require("moment/locale/vi");
moment.locale("vi");
module.exports.saveSearchHistory = async (req, res) => {
  try {
    const { keyword } = req.body;
    const userId = req.user.id;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const cleanKeyword = Helper.removeDiacritics(keyword.toLowerCase().trim());

    // Lấy ảnh minh họa đầu tiên của kết quả tìm kiếm
    const recipe = await Recipe.findOne({
      $or: [
        { name_normalized: { $regex: cleanKeyword, $options: "i" } },
        { tags_normalized: { $regex: cleanKeyword, $options: "i" } },
        {
          "ingredients.name_normalized": {
            $regex: cleanKeyword,
            $options: "i",
          },
        },
      ],
    })
      .select("image name")
      .lean();

    const image =
      recipe?.image ||
      "https://global-web-assets.cpcdn.com/assets/blank4x3-59a0a9ef4e6c3432579cbbd393fb1f1f98d52b9b66a9aae284872b67434274b8.png";

    // Cập nhật hoặc tạo mới
    await SearchHistory.findOneAndUpdate(
      { userId, keyword: cleanKeyword },
      { image, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Lưu lịch sử tìm kiếm thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.getSearchHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const history = await SearchHistory.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean();
    const updatedHistory = history.map((item) => {
      const timeAgo = moment(item.updatedAt).fromNow();
      return { ...item, timeAgo };
    });
    res.status(200).json({
      message: "Lấy lịch sử tìm kiếm thành công",
      total: updatedHistory.length,
      history: updatedHistory,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.deleteSearchKeyword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { keyword } = req.body;
    console.log(keyword);

    if (!keyword || !keyword.trim()) {
      return res.status(400).json({ message: "Thiếu từ khóa cần xóa" });
    }

    await SearchHistory.findOneAndDelete({
      userId,
      keyword: keyword.toLowerCase(),
    });

    res.status(200).json({ message: "Đã xóa từ khóa tìm kiếm" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.clearAllSearchHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    await SearchHistory.deleteMany({ userId });

    res.status(200).json({ message: "Đã xóa toàn bộ lịch sử tìm kiếm" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
