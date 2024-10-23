const evaluateCondition = (condition, data) => {
    const parts = condition.split(' ');
    const field = parts[0];
    const operator = parts[1];
    const value = parts.slice(2).join(' ');
    if(data[field]===null) return;
    // Handle different types of conditions
    switch (operator) {
      case '>':
        return data[field] > Number(value);
      case '<':
        return data[field] < Number(value);
      case '=':
        return data[field] == value.replace(/'/g, ""); // Handle string comparison
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  };
  
  
  const evaluateRule = (node, data) => {
    if(node===null) return true;
    if (node.type === 'operator') {
      switch (node.value) {
        case 'AND':
          return evaluateRule(node.left, data) && evaluateRule(node.right, data);
        case 'OR':
          return evaluateRule(node.left, data) || evaluateRule(node.right, data)
        default:
          throw new Error(`Unknown operator: ${node.value}`);
      }
    } else if (node.type === 'condition') {
      return evaluateCondition(node.value, data)
    }
  };
  

module.exports  = {evaluateRule}