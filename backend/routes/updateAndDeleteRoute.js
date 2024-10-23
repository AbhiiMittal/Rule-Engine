const express = require("express");
const router = express.Router();

const { update, deleteRule } = require("../controllers/updateAndDelete");

router.post("/update", update);
router.delete("/deleteRule", deleteRule);

module.exports = router;    