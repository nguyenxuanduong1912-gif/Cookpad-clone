const CategoryGroup = require("../../Models/CategoryGroup");
const Category = require("../../Models/categories");

module.exports.getAllGroups = async (req, res) => {
  try {
    const groups = await CategoryGroup.find({ deleted: false })
      .sort({ order: 1, name: 1 })
      .lean();

    const groupIds = groups.map((g) => g._id);
    const categories = await Category.find({
      group: { $in: groupIds },
      deleted: false,
    })
      .sort({ name: 1 })
      .lean();

    const groupsWithChildren = groups.map((g) => ({
      ...g,
      categories: categories.filter((c) => String(c.group) === String(g._id)),
    }));

    res.json({ success: true, groups: groupsWithChildren });
  } catch (err) {
    console.error("getAllGroups err", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports.getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await CategoryGroup.findById(id).lean();
    if (!group)
      return res.status(404).json({ success: false, message: "Not found" });

    const categories = await Category.find({
      group: id,
      deleted: false,
    }).lean();
    res.json({ success: true, group: { ...group, categories } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports.createGroup = async (req, res) => {
  try {
    const { name, description, order, image } = req.body;
    const g = new CategoryGroup({ name, description, order, image });
    await g.save();
    res.json({ success: true, group: g });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
