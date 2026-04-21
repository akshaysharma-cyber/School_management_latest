import { useState } from "react";

export default function InputField({ label, type = "text", placeholder, value, onChange, error, icon, required }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div style={{ marginBottom: "18px" }}>
      {label && (
        <label style={{ display: "block", fontWeight: 600, fontSize: "14px", color: "#1a2744", marginBottom: "7px" }}>
          {label} {required && <span style={{ color: "#e53e3e" }}>*</span>}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {icon && (
          <span style={{
            position: "absolute", left: "14px", color: "#9ba8be", fontSize: "16px",
            display: "flex", alignItems: "center", pointerEvents: "none"
          }}>
            {icon}
          </span>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: "100%", padding: icon ? "13px 44px 13px 42px" : "13px 16px",
            border: `1.5px solid ${error ? "#e53e3e" : "#e2e8f0"}`,
            borderRadius: "12px", fontSize: "15px", color: "#1a2744",
            background: "#fff", outline: "none", boxSizing: "border-box",
            transition: "border-color 0.2s",
            fontFamily: "inherit",
          }}
          onFocus={e => e.target.style.borderColor = error ? "#e53e3e" : "#3b5bdb"}
          onBlur={e => e.target.style.borderColor = error ? "#e53e3e" : "#e2e8f0"}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            style={{
              position: "absolute", right: "14px", background: "none", border: "none",
              cursor: "pointer", color: "#9ba8be", fontSize: "18px", display: "flex",
              alignItems: "center", padding: 0,
            }}
          >
            {show ? <EyeOff /> : <Eye />}
          </button>
        )}
      </div>
      {error && <p style={{ color: "#e53e3e", fontSize: "12px", marginTop: "5px", marginBottom: 0 }}>{error}</p>}
    </div>
  );
}

function Eye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}
