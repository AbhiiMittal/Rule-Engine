const validLogicalOperators = ['AND', 'OR'];
const validComparisonOperators = ['>', '<', '=', '>=', '<='];
const validFields = ['age', 'department', 'salary', 'experience'];
const validDepartments = ['Sales', 'Marketing', 'Engineering', 'HR'];


function isParenthesesBalanced(str) {
    const stack = [];
    for (const char of str) {
        if (char === '(') {
            stack.push(char);
        } else if (char === ')') {
            if (stack.length === 0) return false;
            stack.pop();
        }
    }
    return stack.length === 0;
}

function isValidComparison(part) {
    const [left, operator, right] = part.trim().split(/\s+/);

    if (!validComparisonOperators.includes(operator)) return false;

    if (validFields.includes(left)) {
       
        if (left === 'age' || left === 'salary' || left === 'experience') {
            return !isNaN(Number(right)); // Should be a number
        } else if (left === 'department') {
            return validDepartments.includes(right.replace(/['"]+/g, '')); // Should be a valid department string
        }
    }

    return false;
}


function splitByLogicalOperators(rule) {
    const regex = /\s+(AND|OR)\s+/;
    return rule.split(regex);
}

function validateRuleString(rule) {
    
    if (!isParenthesesBalanced(rule)) {
        return { valid: false, message: "Parentheses are not balanced" };
    }

   
    const parts = splitByLogicalOperators(rule);

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();

       
        if (validLogicalOperators.includes(part)) {
            continue;
        }

        
        const comparisons = part.replace(/[()]/g, '').split(/\s+(AND|OR)\s+/);
        for (const comparison of comparisons) {
            if (!isValidComparison(comparison.trim())) {
                return { valid: false, message: `Invalid comparison: ${comparison.trim()}` };
            }
        }
    }

    return { valid: true, message: "Rule is valid" };
}


module.exports = { validateRuleString };