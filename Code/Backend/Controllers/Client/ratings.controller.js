const Rating = require("../../Models/ratings");
module.exports.addOrUpdateRating = async (req, res) => {
  try {
    const { recipeId, value } = req.body;
    if (!recipeId && !value) {
      return res.status(400).json({ message: "Thiếu recipeId hoặc value" });
    }
    if (value < 1 || value > 5) {
      return res.status(400).json({ message: "Rating phải từ 1 đến 5" });
    }
    let rating = await Rating.findOne({ recipeId, userId: req.user.id });

    if (rating) {
      rating.value = value;
      await rating.save();
    } else {
      rating = await Rating.create({
        recipeId,
        userId: req.user.id,
        value,
      });
    }

    return res.status(200).json({ message: "Đánh giá thành công", rating });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.getRatingByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const ratings = await Rating.find({ recipeId });
    if (!ratings || ratings.length === 0) {
      return res.json({
        message: "Món ăn chưa có đánh giá",
        ratings: [],
        average: 0,
      });
    }
    const total = ratings.reduce((acc, item) => acc + item.value, 0);
    const average = (total / ratings.length).toFixed(1);

    return res.status(200).json({
      totalRatings: ratings.length,
      average: Number(average),
      ratings,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findById(id);
    if (!rating) {
      return res.status(404).json({ message: "Không tìm thấy rating" });
    }
    if (rating.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa rating này" });
    }

    await Rating.findByIdAndDelete(id);
    return res.status(200).json({ message: "Xóa rating thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
