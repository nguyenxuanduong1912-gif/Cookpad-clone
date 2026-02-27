const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});
const tagModel = mongoose.model("Tag", tagSchema, "tags");
module.exports = tagModel;
