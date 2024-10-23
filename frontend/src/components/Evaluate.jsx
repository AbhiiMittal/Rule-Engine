import { useState } from "react";

export default function Evaluate(props) {
  const [isTrue, setIsTrue] = useState(null);
  const [rule, setRule] = useState(""); // For the rule text input
  const [jsonData, setJsonData] = useState(""); // For the JSON data input

  // Handle input changes
  const handleRuleChange = (e) => {
    setRule(e.target.value);
  };

  const handleJsonChange = (e) => {
    setJsonData(e.target.value); // Capture JSON string input
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse the JSON string input
      const parsedData = JSON.parse(jsonData);
      // Make the API call with both ruleId and parsed data
      const response = await fetch("http://localhost:3000/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ruleId: props.id.id, // Rule ID passed via props
          data: parsedData, // Parsed JSON data
        }),
      });

      const responseData = await response.json();
      setIsTrue(responseData);
    } catch (error) {
      console.error("Error in evaluation:", error);
    }
  };

  return (
    <div>
      <h2>Evaluate Rule</h2>
      <form>
        <textarea
          id="jsonData"
          name="jsonData"
          rows="4"
          cols="50"
          placeholder={`{"age": 35, "department": "Sales", "salary": 60000, "experience": 3}`}
          onChange={handleJsonChange}
          required
        ></textarea>

        <button type="submit" className="button" onClick={handleSubmit}>
          Evaluate
        </button>

        {isTrue == null ? "" : isTrue ? <p style={{color : 'green'}}>True</p> : <p style={{color : 'red'}}>False</p>}
      </form>
    </div>
  );
}
