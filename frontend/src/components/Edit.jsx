import React, { useState } from "react";
export default function Evaluate(props) {
  const [rule, setRule] = useState("");
  const handleChange = (e) => {
    setRule(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const response = fetch("http://localhost:3000/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ruleId: props.id.id,
          data: rule,
        }),
      });
      const data = response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h2>Evaluate Rule</h2>
      <form>
        <label htmlFor="rule">Rule:</label>
        <input
          type="text"
          defaultValue={props.id.content}
          id="rule"
          name="rule"
          onChange={handleChange}
          required
        ></input>
        <button type="submit" className="button" onClick={handleSubmit}>
          Edit
        </button>
      </form>
    </div>
  );
}
