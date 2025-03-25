import React from "react";
import Row from "./Row";
import "./Table.css";

const Table = ({ rows, updateValue }) => {
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Label</th>
          <th>Value</th>
          <th>Input</th>
          <th>Allocation %</th>
          <th>Allocation Val</th>
          <th>Variance %</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <Row key={row.id} row={row} updateValue={updateValue} />
        ))}
      </tbody>
    </table>
  );
};

export default Table;