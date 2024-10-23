const TreeNode = require("../classNode");
function ast(str) {
  function infixToPostfix(expression) {
    const precedence = { AND: 2, OR: 1 };
    const output = [];
    const operatorStack = [];
    const tokens = expression.match(/\(|\)|\w+ [><=] [\w'0-9]+|AND|OR/g);

    for (let token of tokens) {
      if (token === "(") {
        operatorStack.push(token);
      } else if (token === ")") {
        while (
          operatorStack.length &&
          operatorStack[operatorStack.length - 1] !== "("
        ) {
          output.push(operatorStack.pop());
        }
        operatorStack.pop();
      } else if (token === "AND" || token === "OR") {
        while (
          operatorStack.length &&
          precedence[operatorStack[operatorStack.length - 1]] >=
            precedence[token]
        ) {
          output.push(operatorStack.pop());
        }
        operatorStack.push(token);
      } else {
        output.push(token);
      }
    }

    while (operatorStack.length) {
      output.push(operatorStack.pop());
    }

    return output;
  }

  function buildExpressionTreeFromPostfix(postfix) {
    const stack = [];

    for (let token of postfix) {
      if (token === "AND" || token === "OR") {
        const rightNode = stack.pop();
        const leftNode = stack.pop();
        const operatorNode = new TreeNode(token);
        operatorNode.left = leftNode;
        operatorNode.right = rightNode;
        stack.push(operatorNode);
      } else {
        // It's a condition like "age > 30", so create a TreeNode with no children
        stack.push(new TreeNode(token));
      }
    }

    return stack.pop(); // The root of the tree
  }

  // Function to convert the expression tree into JSON format
  function treeToJSON(node) {
    if (!node) {
      return null; // Base case: if the node is null, return null
    }

    if (node.left === null && node.right === null) {
      // If the node has no children, it's a condition (operand)
      return {
        type: "condition",
        value: node.value,
      };
    } else {
      return {
        type: "operator",
        value: node.value,
        left: treeToJSON(node.left),
        right: treeToJSON(node.right),
      };
    }
  }

  if (str == undefined) return "error";
  const expression = str;
  const postfix = infixToPostfix(expression); // Convert to postfix
  const expressionTree = buildExpressionTreeFromPostfix(postfix); // Build the tree
  const expressionTreeJSON = treeToJSON(expressionTree); // Convert to JSON

  const data = JSON.stringify(expressionTreeJSON, null, 2);
  return data;
}

module.exports = { ast };
