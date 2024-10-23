const express = require("express");
const router = express.Router();
const { combine } = require("../controllers/combine");

router.post('/combineRule',combine);

module.exports = router;