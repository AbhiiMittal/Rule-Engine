const express = require("express");
const router = express.Router();

const { evaluate } = require("../controllers/evaluate");
router.post('/evaluate',evaluate);

module.exports = router;