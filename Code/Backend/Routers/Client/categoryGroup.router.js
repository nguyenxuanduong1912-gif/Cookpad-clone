const express = require("express");
const router = express.Router();
const ctrl = require("../../Controllers/Client/categoryGroup.controller");

// public
router.get("/", ctrl.getAllGroups);
router.get("/:id", ctrl.getGroupById);

// protected/admin (optional)
router.post("/", ctrl.createGroup);

module.exports = router;
