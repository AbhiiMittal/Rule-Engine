const { ast } = require("../helper/makeAst");
const { validateRuleString } = require("../helper/validation");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const url = process.env.url;
const dbName = process.env.db;
const trees = process.env.trees;
const rules = process.env.rules;
const client = new MongoClient(url);
const update = async (req, res) => {
  try {
    const rule = req.body.rule;
    const updateId = req.body.id;
    const db = client.db(dbName);
    const validationResult = validateRuleString(rule);
    if (!validationResult.valid) {
      return res.status(400).json({ error: validationResult.message });
    }
    const ruleCollection = db.collection(rules);
    const treeCollection = db.collection(trees);
    const ruleExist = await ruleCollection.findOne({ rule: rule });
    if (ruleExist) {
      return res.status(409).send("Rule already exists");
    }
    const data = ast(rule);
    const result = await ruleCollection.updateOne(
      { _id: ObjectId.createFromHexString(updateId) },
      { $set: { rule: rule } }
    );
    const result2 = await treeCollection.updateOne(
      { ruleId: ObjectId.createFromHexString(updateId) },
      { $set: { data: data } }
    );
    res.status(200).send("Rule updated successfully");
  } catch (error) {
    console.log(error);
  }
};

const deleteRule = async (req, res) => {
  try {
    const db = client.db(dbName);
    const ruleCollection = db.collection(rules);
    const treeCollection = db.collection(trees);
    const id = req.body.id;
    const result = await ruleCollection.deleteOne({
      _id: ObjectId.createFromHexString(id),
    });
    const result2 = await treeCollection.deleteOne({
      ruleId: ObjectId.createFromHexString(id),
    });
    res.status(200).send("Rule deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting rule");
  }
};

module.exports = { update, deleteRule };
