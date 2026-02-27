const Recipe = require("../../Models/recipes");
const Comment = require("../../Models/comments");
module.exports.addComment = async (req, res) => {
  try {
    const { recipeId, content } = req.body;
    if (!content) {
      return res
        .status(400)
        .json({ message: "Nội dung bình luận không được để trống" });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }
    const newComment = new Comment({
      recipeId,
      userId: req.user.id,
      content,
    });
    await newComment.save();
    res
      .status(200)
      .json({ message: "Thêm bình luận thành công", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.reactToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { type } = req.body;

    if (!["like", "love", "haha", "wow", "sad", "angry"].includes(type)) {
      return res.status(400).json({ message: "Loại cảm xúc không hợp lệ" });
    }
    console.log(commentId);
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }
    Object.keys(comment.reactions).forEach((key) => {
      comment.reactions[key] = comment.reactions[key].filter((uid) => {
        uid.toString() !== req.user.id;
      });
    });
    comment.reactions[type].push(req.user.id);
    await comment.save();
    res.status(200).json({ message: "Thả cảm xúc thành công", comment });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.getCommentByRecipeId = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(400).json({ message: "Không tìm thấy món ăn" });
    }
    const comments = await Comment.find({ recipeId }).populate(
      "userId",
      "fullName avatar"
    );
    if (!comments) {
      return res.status(404).json({ message: "Không có bình luận" });
    }
    return res
      .status(200)
      .json({ message: "Lấy thành công bình luận", comments });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }
    if (!content) {
      return res.status(400).json({ message: "Nội dung không được để trống" });
    }
    if (req.user.id !== comment.userId.toString()) {
      return res
        .status(400)
        .json({ message: "Bạn không có quyền chỉnh sửa bình luận này" });
    }
    comment.content = content;
    comment.updateAt = new Date();
    await comment.save();

    return res
      .status(200)
      .json({ message: "Chỉnh sửa bình luận thành công", comment });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }
    if (
      req.user.id !== comment.userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(400)
        .json({ message: "Bạn không có quyền xóa bình luận này" });
    }
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({ message: "Xóa bình luận thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
