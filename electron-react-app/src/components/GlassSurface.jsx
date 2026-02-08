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
 * - primary: oval button with glowing purple border (maestro style)
 * - to: renders as React Router Link (for nav buttons)
 * - as="button": renders as button with onClick
 */
export default function GlassSurface({
  fullPage = false,
  primary = false,
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
  const classNames = [
    "glass-surface",
    (to || as === "button") ? "glass-button" : "",
    primary ? "glass-button--primary" : "",
    className,
  ].filter(Boolean).join(" ");

  if (to != null) {
    return (
      <Link
        to={to}
        className={classNames}
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
        className={classNames}
        style={{
          ...combined,
          background: primary ? "rgba(255, 255, 255, 0.08)" : glassStyle.background,
          border: primary ? "1px solid rgba(180, 120, 255, 0.9)" : glassStyle.border,
          borderRadius: primary ? 999 : glassStyle.borderRadius,
          boxShadow: primary ? "0 0 12px rgba(160, 100, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)" : glassStyle.boxShadow,
        }}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className={classNames}
      style={combined}
      {...rest}
    >
      {children}
    </div>
  );
}
