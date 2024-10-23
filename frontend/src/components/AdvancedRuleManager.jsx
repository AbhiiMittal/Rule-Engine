import React, { useState, useEffect } from "react";
// import RuleItem from "./RuleItem";
import "./styles.css"; // We'll create this file for our CSS
import OrgChartTree from "./ChartTree";
import Evaluate from "./Evaluate";
import Edit from "./Edit";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default function AdvancedRuleManager() {
  const [rules, setRules] = useState([]);
  const [ruleExist, setRuleExist] = useState(null);
  const [newRule, setNewRule] = useState("");
  const [selectedRules, setSelectedRules] = useState([]);
  const [activeTab, setActiveTab] = useState("add");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  useEffect(() => {
    if (activeTab === "view") {
      handleGetRules();
    }
  }, [activeTab]);

  useEffect(() => {}, [rules]);
  const handleDelete = async (id) => {
    try {
      const res = await fetch("http://localhost:3000/api/deleteRule", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setRules(rules.filter((rule) => rule.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const RuleItem = ({ rule, isSelected, onSelect }) => {
    const handleCheckboxChange = () => {
      onSelect(rule.id);
    };

    return (
      <div className="rule-item-container">
        <input
          type="checkbox"
          id={`rule-${rule.id}`}
          checked={isSelected}
          onChange={handleCheckboxChange}
        />
        <label
          htmlFor={`rule-${rule.id}`}
          className="rule-label"
          onClick={handleCheckboxChange}
        >
          {rule.content.length > 10
            ? `${rule.content.slice(0, 10)}...`
            : rule.content}
        </label>

        <dialog className="dialog" id={`dialog-${rule.id}-details`}>
          <div className="dialog-content">
            <h2>Rule Details</h2>
            <pre className="rule-content">{rule.content}</pre>
            <button
              className="button"
              onClick={() =>
                document.getElementById(`dialog-${rule.id}-details`).close()
              }
            >
              Close
            </button>
          </div>
        </dialog>
        <dialog className="dialog" id={`dialog-${rule.id}-evaluate`}>
          <div className="dialog-content">
            <h2>Rule Details</h2>
            <pre className="rule-content">{rule.content}</pre>
            <Evaluate id={rule} />
            <button
              className="button"
              onClick={() =>
                document.getElementById(`dialog-${rule.id}-evaluate`).close()
              }
            >
              Close
            </button>
          </div>
        </dialog>
        <dialog className="dialog" id={`dialog-${rule.id}-edit`}>
          <div className="dialog-content">
            <h2>Rule Details</h2>
            <pre className="rule-content">{rule.content}</pre>
            <Edit id={rule} />
            <button
              className="button"
              onClick={() =>
                document.getElementById(`dialog-${rule.id}-edit`).close()
              }
            >
              Close
            </button>
          </div>
        </dialog>
        <div className="tabs">
          <button
            className="button"
            onClick={() =>
              document.getElementById(`dialog-${rule.id}-details`).showModal()
            }
          >
            View Details
          </button>
          <button className="button" onClick={() => handleDelete(rule.id)}>
            Delete
          </button>
          <button
            className="button"
            onClick={() =>
              document.getElementById(`dialog-${rule.id}-edit`).showModal()
            }
          >
            Edit
          </button>
          <button
            className="button"
            onClick={() =>
              document.getElementById(`dialog-${rule.id}-evaluate`).showModal()
            }
          >
            Evaluate
          </button>
        </div>
      </div>
    );
  };

  const handleGetRules = async () => {
    const res = await fetch("http://localhost:3000/api/getRules");
    const data = await res.json();
    const transformedData = data.map((rule) => ({
      id: rule._id, // Change `_id` to `id`
      content: rule.rule, // Keep the rule as is
    }));
    setRules(transformedData);
  };

  const addRule = async () => {
    console.log(newRule);
    if (newRule.trim() !== "") {
      const res = await fetch("http://localhost:3000/api/createRule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ str: newRule.trim() }),
      });
      console.log(res);
      if (res.status === 400) {
        setNewRule("");
        alert("Error : Wrong String");
        return;
      }
      if (res.status === 409) {
        setNewRule("");
        setRuleExist(true);
        return;
      }
      const data = await res.json();
      setRules([...rules, { id: data.id, content: newRule.trim() }]);
      setNewRule("");
      setRuleExist(false);
    }
  };

  const toggleRuleSelection = (id) => {
    setSelectedRules((prev) =>
      prev.includes(id) ? prev.filter((ruleId) => ruleId !== id) : [...prev, id]
    );
  };

  const combineRules = async () => {
    if (selectedRules.length > 1) {
      try {
        const arr = rules
          .filter((rule) => selectedRules.includes(rule.id))
          .map((rule) => rule.id);
        const res = await fetch("http://localhost:3000/api/combineRule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            arr: arr,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setRules([...rules, { id: data.ruleId, content: data.rule }]);
          selectedRules([]);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const viewRuleDetails = (rule) => {
    setSelectedRule(rule);
    setModalOpen(true);
  };

  return (
    <div className="rule-manager">
      <div className="rule-manager-content">
        <h1>Advanced Rule Manager</h1>

        <div className="tabs">
          <button
            className={activeTab === "add" ? "active" : ""}
            onClick={() => setActiveTab("add")}
          >
            Add Rule
          </button>
          <button
            className={activeTab === "view" ? "active" : ""}
            onClick={() => setActiveTab("view")}
          >
            View & Combine Rules
          </button>
        </div>

        {activeTab === "add" && (
          <div className="tab-content">
            <input
              type="text"
              placeholder="Enter a new rule"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              id=""
            />
            <button onClick={addRule} className="button">
              Add Rule
            </button>
            {ruleExist != null ? (
              ruleExist ? (
                <p className="rule-exists">Rule Already Exists!</p>
              ) : (
                <p className="rule-exists">Rule Added Successfully!</p>
              )
            ) : null}
          </div>
        )}

        {activeTab === "view" && (
          <div className="tab-content">
            {rules.length === 0 ? (
              <p className="no-rules">No rules added yet.</p>
            ) : (
              <div className="rules-list">
                {rules.map((rule) => (
                  <RuleItem
                    key={rule.id}
                    rule={rule}
                    isSelected={selectedRules.includes(rule.id)}
                    onSelect={toggleRuleSelection}
                  />
                ))}
              </div>
            )}
            <button
              onClick={combineRules}
              disabled={selectedRules.length < 2}
              className="button"
            >
              Combine Selected Rules
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Rule Details"
      >
        {selectedRule && (
          <pre className="rule-details">{selectedRule.content}</pre>
        )}
      </Modal>
    </div>
  );
}
