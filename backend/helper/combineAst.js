const TreeNode = require("../classNode");
const { getMostFrequentOperator } = require("./frequent");

function mergeTrees(ast1, ast2, str) {
  if (!ast1) return ast2;
  if (!ast2) return ast1;

  // If both nodes are conditions and identical, return one of them
  if (
    ast1.type === "condition" &&
    ast2.type === "condition" &&
    ast1.value === ast2.value
  ) {
    return ast1;
  }

  // If both nodes are operators with the same value, merge their children
  if (
    ast1.type === "operator" &&
    ast2.type === "operator" &&
    ast1.value === ast2.value
  ) {
    return {
      type: "operator",
      value: ast1.value,
      left: mergeTrees(ast1.left, ast2.left, str),
      right: mergeTrees(ast1.right, ast2.right, str),
    };
  }

  // If one node is a condition and the other is an operator, wrap them in a logical AND/OR
  if (ast1.type === "condition" || ast2.type === "condition") {
    return {
      type: "operator",
      value: str, // or 'OR', based on your merging logic
      left: ast1,
      right: ast2,
    };
  }

  // If both are operators but different, combine them in a logical AND
  return {
    type: "operator",
    value: str, // You can use 'OR' based on the merging logic you want
    left: ast1,
    right: ast2,
  };
}

// Function to combine multiple ASTs
function combineRules(asts) {
  if (!asts || asts.length === 0) return null;
  if (asts.length === 1) return asts[0]; // Only one AST, no need to merge
  let str = getMostFrequentOperator(asts) == "AND" ? "AND" : "OR";
  let mergedAST = asts[0]; // Start with the first AST

  // Merge each subsequent AST into the mergedAST
  for (let i = 1; i < asts.length; i++) {
    mergedAST = mergeTrees(mergedAST, asts[i], str);
  }

  return mergedAST;
}

function generateRuleString(node) {
  if (!node) return ""; // Base case: if node is null, return empty string

  // If the node is a condition, just return the value (e.g., "age > 30")
  if (node.type === "condition") {
    return node.value;
  }

  // If the node is an operator, recursively get the left and right expressions
  if (node.type === "operator") {
    const leftExpr = generateRuleString(node.left);
    const rightExpr = generateRuleString(node.right);

    // Return the full expression with parentheses
    return `(${leftExpr} ${node.value} ${rightExpr})`;
  }

  return "";
}

module.exports = { combineRules, generateRuleString };
