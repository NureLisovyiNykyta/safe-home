import React from "react";
import "./card.css";

const Card = ({ data, columns, onClick, onEdit, onDelete }) => {
  return (
    <div className="card" onClick={() => onClick?.(data)}>
      {columns.map((col, index) => (
        <p key={index}>
          <strong>{col.headerName}</strong> {data[col.field]}
        </p>
      ))}
    </div>
  );
};

export default Card;
