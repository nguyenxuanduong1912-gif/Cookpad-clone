const mongoose = require("mongoose");

const categoryGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    name_normalized: { type: String, index: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    deleted: { type: Boolean, default: false },
    // optional: order for UI
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CategoryGroup",
  categoryGroupSchema,
  "CategoryGroup"
);
