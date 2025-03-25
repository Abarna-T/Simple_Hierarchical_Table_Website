import React, { useState, useEffect } from "react";

const Row = ({ row, updateValue, level = 0 }) => {
  const [inputValue, setInputValue] = useState(""); // For percentage/absolute input
  const [editValue, setEditValue] = useState(row.value); // For inline editing
  const [isEditing, setIsEditing] = useState(false); // Track edit mode

  // Sync editValue when row.value changes
  useEffect(() => {
    setEditValue(row.value);
  }, [row.value]);

  // Handle percentage-based updates
  const handlePercentageUpdate = () => {
    const percentage = parseFloat(inputValue);
    if (!isNaN(percentage)) {
      updateValue(row.id, percentage);
      setInputValue(""); // Clear input after update
    }
  };

  // Handle absolute value updates (direct update)
  const handleDirectUpdate = () => {
    const newValue = parseFloat(inputValue);
    if (!isNaN(newValue)) {
      updateValue(row.id, newValue, true); // Direct update for parent or child
      setInputValue(""); // Clear input after update
    }
  };

  // Handle inline value editing
  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  // Save inline edits on blur or Enter key
  const handleEditBlur = () => {
    const newValue = parseFloat(editValue);
    if (!isNaN(newValue) && newValue !== row.value) {
      updateValue(row.id, newValue, true);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleEditBlur();
    }
  };

  // Calculate variance %
  const variance = ((row.value - row.originalValue) / row.originalValue * 100).toFixed(2);

  return (
    <>
      <tr>
        {/* Label with indentation for hierarchy */}
        <td className="border p-2" style={{ paddingLeft: `${level * 20}px` }}>
          {row.label}
        </td>

        {/* Editable "Value" Column */}
        <td className="border p-2" onClick={() => setIsEditing(true)}>
          {isEditing ? (
            <input
              type="number"
              value={editValue}
              onChange={handleEditChange}
              onBlur={handleEditBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="border p-1 w-16"
            />
          ) : (
            <span>{row.value}</span>
          )}
        </td>

        {/* Input for percentage/absolute updates */}
        <td className="border p-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border p-1 w-16"
          />
        </td>

        {/* Percentage update button */}
        <td className="border p-2">
          <button onClick={handlePercentageUpdate} className="bg-blue-500 text-white p-1 rounded">
            %
          </button>
        </td>

        {/* Absolute value update button */}
        <td className="border p-2">
          <button onClick={handleDirectUpdate} className="bg-green-500 text-white p-1 rounded">
            Val
          </button>
        </td>

        {/* Variance percentage */}
        <td className="border p-2">{variance}%</td>
      </tr>

      {/* Render child rows recursively */}
      {row.children &&
        row.children.map((child) => (
          <Row key={child.id} row={child} updateValue={updateValue} level={level + 1} />
        ))}
    </>
  );
};

export default Row;