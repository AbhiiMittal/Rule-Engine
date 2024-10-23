const { ast } = require("../helper/makeAst");

const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();
const url = process.env.url;
const dbName = process.env.db;
const trees = process.env.trees;
const rules = process.env.rules;

const { validateRuleString } = require('../helper/validation');
const client = new MongoClient(url);


const create = async (req, res) => {
  let str = req.body.str;
  let data = ast(str);
  const validationResult = validateRuleString(str);
     if (!validationResult.valid) {
       return res.status(400).json({ error: validationResult.message });
     }
  try {
    data = JSON.parse(data);
    console.log(data);
  } catch (parseError) {
    console.error("Error parsing data string:", parseError);
    return res.status(400).send("Error parsing data");
  }
  try {
    const db = client.db(dbName);
    const rule = db.collection(rules);
    const ruleExist = await rule.findOne({ rule: str });
    if (ruleExist) {
      return res.status(409).send("Rule already exists");
    }
    const ruleInsert = await rule.insertOne({ rule: str });
    const id = ruleInsert.insertedId;
    const collection = db.collection(trees);
    const result = await collection.insertOne({ ruleId: id, data: data });
    console.log("Created Successfully");
    res.send(id);
  } catch (err) {
    console.error("Error inserting data:", err);
    res.send("Error inserting data");
  }
};

const getRules = async (req, res) => {
  try {
    const db = client.db(dbName);
    const rule = db.collection(rules);
    const result = await rule.find().toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send("Error fetching rules");
  }
};

module.exports = { create, getRules };
