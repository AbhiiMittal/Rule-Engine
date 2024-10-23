const { ast } = require("../helper/makeAst");
require('dotenv').config();
const { MongoClient, ObjectId } = require("mongodb");

const { combineRules, generateRuleString } = require("../helper/combineAst");

const u = process.env.url;
const dbName = process.env.db;
const trees = process.env.trees;
const rules = process.env.rules;
const client = new MongoClient(u);

const combine = async (req, res) => {
  try {
    const db = client.db(dbName);
    const rulesCollection = db.collection(rules);
    const treesCollection = db.collection(trees);
    const ruleIds = req.body.arr;

    const astPromises = ruleIds.map(async (id) => {
      const treeData = await treesCollection.findOne({
        ruleId: ObjectId.createFromHexString(id),
      });
      if (treeData) {
        return treeData.data;
      } else {
        console.error("No tree data found for rule ID", id);
        return null;
      }
    });

    const asts = (await Promise.all(astPromises)).filter((ast) => ast !== null);

    if (asts.length === 0) {
      console.error("No valid ASTs were fetched from the database");
      return res.status(500).send("No valid ASTs were found to combine");
    }

    const combinedAST = combineRules(asts); // Combine the ASTs
    const finalRule = generateRuleString(combinedAST); // Generate the final rule string

    if (!finalRule) {
      console.error("Error generating the final rule string");
      return res.status(500).send("Error generating the final rule string");
    }

    const finalAST = ast(finalRule);

    // Insert the new rule into the rules collection
    const ruleInsertResult = await rulesCollection.insertOne({
      rule: finalRule,
    });
    const ruleId = ruleInsertResult.insertedId;

    // Insert the final AST into the trees collection with the rule ID
    const result = await treesCollection.insertOne({
      ruleId: ruleId,
      data: finalAST,
    });

    // Send the final response once everything is successful
    return res.send({ ruleId: ruleId, rule: finalRule });
  } catch (err) {
    console.error("Error in combining rules:", err);
    return res.status(500).send("Error in combining rules");
  }
};

module.exports = { combine };
