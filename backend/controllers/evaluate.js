const { ast } = require("../helper/makeAst");
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const { validateRuleString } = require("../helper/validation");
const { evaluateRule } = require("../helper/evaluateRule");
const url = process.env.url;
const dbName = process.env.db;
const trees = process.env.trees;
const rules = process.env.rules;
const client = new MongoClient(url)

const evaluate = async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName)
    const ast = await db.collection(trees).findOne({ ruleId: ObjectId.createFromHexString(req.body.ruleId) });
    const data = req.body.data;
    const result = await evaluateRule(ast.data, data);

    // Send the result back to the frontend
    res.status(200).send(result);
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).send('An error occurred');
  }
};


module.exports = { evaluate };
