import React from "react";
import { Link } from "react-router-dom";

const glassStyle = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  borderRadius: "12px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
};

const fullPageStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  boxSizing: "border-box",
  overflow: "auto",
};

const buttonStyle = {
  padding: "12px 24px",
  cursor: "pointer",
  fontWeight: 600,
  color: "rgba(255, 255, 255, 0.95)",
  textDecoration: "none",
  textAlign: "center",
  transition: "background 0.2s, transform 0.15s",
};

/**
 * Glass surface component for glassmorphism UI.
 * - fullPage: covers viewport and centers content (for landing)
 * - to: renders as React Router Link (for nav buttons)
 * - as="button": renders as button with onClick
 */
export default function GlassSurface({
  fullPage = false,
  to,
  as = "div",
  onClick,
  className = "",
  style = {},
  children,
  ...rest
}) {
  const base = {
    ...glassStyle,
    ...(fullPage ? fullPageStyle : {}),
    ...style,
  };

  const combined = to || as === "button" ? { ...base, ...buttonStyle } : base;

  if (to != null) {
    return (
      <Link
        to={to}
        className={`glass-surface glass-button ${className}`.trim()}
        style={{ ...combined, font: 'inherit' }}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  if (as === "button") {
    return (
      <button
        type="button"
        className={`glass-surface glass-button ${className}`.trim()}
        style={{ ...combined, background: glassStyle.background, border: glassStyle.border, borderRadius: glassStyle.borderRadius }}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className={`glass-surface ${className}`.trim()}
      style={combined}
      {...rest}
    >
      {children}
    </div>
  );
}
