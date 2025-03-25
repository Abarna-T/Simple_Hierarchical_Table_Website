import React, { useState } from "react";
import Table from "./Table";

const initialRows = [
  {
    id: "electronics",
    label: "Electronics",
    value: 1500,
    originalValue: 1500,
    children: [
      { id: "pioneer", label: "Pioneer", value: 800, originalValue: 800 },
      { id: "laptops", label: "Laptops", value: 700, originalValue: 700 }
    ]
  },
  {
    id: "furniture",
    label: "Furniture",
    value: 1000,
    originalValue: 1000,
    children: [
      { id: "tables", label: "Tables", value: 300, originalValue: 300 },
      { id: "chairs", label: "Chairs", value: 700, originalValue: 700 }
    ]
  }
];

const App = () => {
  const [rows, setRows] = useState(initialRows);

  const updateValue = (id, inputValue, isDirectValue = false) => {
    setRows(prevRows => {
      const updateNode = (nodes) => {
        return nodes.map(node => {
          // Handle the target node
          if (node.id === id) {
            const newValue = isDirectValue 
              ? parseFloat(inputValue)
              : node.value * (1 + parseFloat(inputValue) / 100);

            // If it's a leaf node (no children)
            if (!node.children || node.children.length === 0) {
              const newVariance = ((newValue - node.originalValue) / node.originalValue * 100).toFixed(2);
              return {
                ...node,
                value: parseFloat(newValue.toFixed(2)),
                variance: parseFloat(newVariance)
              };
            }

            // If it's a parent node being updated directly
            if (isDirectValue) {
              const ratio = newValue / node.value;
              const updatedChildren = node.children.map(child => {
                const childNewValue = parseFloat((child.value * ratio).toFixed(2));
                const childVariance = ((childNewValue - child.originalValue) / child.originalValue * 100).toFixed(2);
                
                return {
                  ...child,
                  value: childNewValue,
                  variance: parseFloat(childVariance)
                };
              });

              return {
                ...node,
                value: parseFloat(newValue.toFixed(2)),
                children: updatedChildren,
                variance: parseFloat(((newValue - node.originalValue) / node.originalValue * 100).toFixed(2))
              };
            }

            // If it's a parent node being updated by percentage
            const percentageChange = parseFloat(inputValue);
            const updatedChildren = node.children.map(child => {
              const childNewValue = parseFloat((child.value * (1 + percentageChange / 100)).toFixed(2));
              const childVariance = ((childNewValue - child.originalValue) / child.originalValue * 100).toFixed(2);
              
              return {
                ...child,
                value: parseFloat(childNewValue),
                variance: parseFloat(childVariance)
              };
            });

            const newTotal = updatedChildren.reduce((sum, child) => sum + child.value, 0);
            return {
              ...node,
              value: parseFloat(newTotal.toFixed(2)),
              children: updatedChildren,
              variance: parseFloat(((newTotal - node.originalValue) / node.originalValue * 100).toFixed(2))
            };
          }

          // Process children recursively for non-target nodes
          if (node.children) {
            const updatedChildren = updateNode(node.children);
            const newTotal = updatedChildren.reduce((sum, child) => sum + child.value, 0);
            
            return {
              ...node,
              value: parseFloat(newTotal.toFixed(2)),
              children: updatedChildren,
              variance: parseFloat(((newTotal - node.originalValue) / node.originalValue * 100).toFixed(2))
            };
          }

          return node;
        });
      };

      const updatedRows = updateNode(prevRows);
      console.log("Updated rows:", updatedRows); // Debug log
      return updatedRows;
    });
  };

  return <Table rows={rows} updateValue={updateValue} />;
};

export default App;