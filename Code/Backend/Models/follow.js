const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema({
  follower_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "accounts", // Người theo dõi
    required: true,
  },
  following_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "accounts", // Người được theo dõi
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Follow", FollowSchema, "Follow");
