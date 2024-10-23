const express = require("express");
const router = express.Router();
const { create, getRules } = require("../controllers/create");


router.post("/createRule", create);

router.get("/getRules", getRules);

module.exports = router;