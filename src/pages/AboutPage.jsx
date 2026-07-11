export default function AboutPage({ onBack }) {
  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#4361ee",
          fontWeight: 700,
          cursor: "pointer",
          marginBottom: 20
        }}
      >
        ← Back
      </button>

      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 30,
          boxShadow: "0 2px 12px rgba(67,97,238,0.06)"
        }}
      >
        <h2>ℹ️ About</h2>

        <p><strong>Alpine School Management System</strong></p>

        <p>Version 1.0.0</p>

        <p>
          © 2026 Alpine Technologies. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}