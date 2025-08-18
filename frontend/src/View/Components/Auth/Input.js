import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
export default function Input({ id, label, type, placeholder, value, onChange ,name}) {
  return (
    <div className="input-div" style={{ marginBottom: "15px" }}>
      <label htmlFor={id} style={{ display: "block", marginBottom: "5px" }}>{label}</label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <FontAwesomeIcon icon={faUser} style={{ position: "absolute", left: "10px", color: "#888" }} />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          style={{ width:"100%", padding: "10px 10px 10px 35px", borderRadius: "5px", border: "1px solid #ccc", outline: "none" }}
        />
      </div>
    </div>
  );
}