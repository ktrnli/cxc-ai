import React from "react";

const baseStyle = {
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 24px",
  fontWeight: 600,
  fontSize: "0.95rem",
  color: "rgba(255, 255, 255, 0.95)",
  textAlign: "center",
  background: "rgba(45, 40, 55, 0.85)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(147, 112, 219, 0.5)",
  borderRadius: "9999px",
  boxShadow:
    "0 -2px 0 0 rgba(147, 112, 219, 0.6), 0 2px 0 0 rgba(147, 112, 219, 0.6), 0 0 16px rgba(138, 43, 226, 0.35)",
  transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
  font: "inherit",
  position: "relative",
  zIndex: 1,
};

function MaestroButton({ children, as = "button", onClick, style = {}, className = "", ...rest }) {
  const combinedStyle = { ...baseStyle, ...style };

  if (as === "label") {
    return (
      <label
        className={`maestro-button ${className}`.trim()}
        style={combinedStyle}
        onClick={onClick}
        {...rest}
      >
        {children}
      </label>
    );
  }

  return (
    <button
      type="button"
      className={`maestro-button ${className}`.trim()}
      style={combinedStyle}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default MaestroButton;
