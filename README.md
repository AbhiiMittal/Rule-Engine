# Rule Engine Application

![rule-manager](https://github.com/user-attachments/assets/2ff6d7ad-2adf-4225-b990-43d6f38f44b3)

![rule-combine-manager](https://github.com/user-attachments/assets/4033a4ee-92dd-4bf8-8dc3-8e70aac7538e)


## Overview

The Rule Engine Application is a simple 3-tier system designed to determine user eligibility based on various attributes such as age, department, income, and spend. By utilizing an Abstract Syntax Tree (AST) to represent conditional rules, this application allows for the dynamic creation, combination, and modification of rules, enabling efficient evaluation of eligibility criteria.

## Data Structure

The application uses a tree-based data structure to represent rules. The structure allows for easy changes and modifications to the rules.

### Node Structure

- **type**: String indicating the node type ("operator" for AND/OR, "operand" for conditions).
- **left**: Reference to another Node (left child).
- **right**: Reference to another Node (right child for operators).
- **value**: Optional value for operand nodes (e.g., number for comparisons).

## Data Storage

The rules and application metadata are stored in a database. The database schema includes fields to represent the AST structure for each rule, with references between nodes for efficient querying and evaluation.

## API Design

1. **`create_rule(rule_string)`**: 
   - Takes a string representing a rule and returns a Node object representing the corresponding AST.

2. **`combine_rules(rules)`**: 
   - Combines a list of rule strings into a single AST, minimizing redundant checks and returning the root node of the combined AST.

3. **`evaluate_rule(JSON data)`**: 
   - Takes a JSON representing the rule's AST and a dictionary of attributes, evaluating whether the provided data satisfies the rule.
4. **`update_rule(rule_string)`**: 
   - Updates the current rule.
5. **`delete_rule()`**: 
   - Delete the rule.

## Build Instructions  


### Prerequisites  

- **Node.js**: Ensure Node.js is installed on your system.  
- **MongoDB Atlas**: Set up a free MongoDB Atlas cluster.  

### Setting up the Project  

1. **Clone the repository**:
    
   git clone https://github.com/AbhiiMittal/Real-Time-Weather-Processing.git
   
   cd weather-app

3. **Install dependencies**:

   cd frontend  
   npm install  
   cd backend  
   npm install
4. **Configure Environment Variables**:

   url=your_mongodb_atlas_connection_string 
   db=database_name  
   trees=collection_name_which_stores_ast  
   rules=collection_name_which_stores_rules
   port=3000  
6. **Run the application**:
   
   npm start(for backend)
   
   npm run dev(for frontend)
## Dependencies  

Here are the main dependencies required to run the project:

- **Node.js**: Handles backend logic and routing.  
- **Express.js**: Manages the web server.  
- **MongoDB Atlas**: A cloud database for storing user data.  
- **Dotenv**: For loading environment variables (like the API key, email credentials, and MongoDB connection string).   
- **Nodemon**: A development tool that automatically restarts the server when code changes are detected.  
- **Cors**: Middleware for enabling Cross-Origin Resource Sharing, allowing the frontend to communicate with the backend from different origins.  

Install all of these by running `npm install` after cloning the repository.  


## Design Decisions  

- **Cloud Database**: MongoDB Atlas is used for its scalability and ease of integration with Node.js through Mongoose. This stores user data, rules and their Abstract Syntax Trees.  
- **Frontend/Backend Separation**: The frontend handles user input and displays rules, while the backend handles API requests, data storage, and evaluation.
