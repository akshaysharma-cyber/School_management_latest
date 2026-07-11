export default function LanguagePage({ onBack }) {
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
        <h2>🌐 Language</h2>

        <p>Language page</p>
      </div>
    </div>
  );
}