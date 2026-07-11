export default function SettingsPage({ onNavigate }) {
  const cardStyle = {
    background: "#fff",
    border: "1px solid #eef0f8",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 10px rgba(67,97,238,0.06)"
  };

  return (
    <div>
      <h2
        style={{
          marginBottom: 24,
          color: "#1a2744",
          fontWeight: 800
        }}
      >
        ⚙️ Settings
      </h2>

      <div
        style={cardStyle}
        onClick={() => onNavigate("schoolProfile")}
      >
        <span>🏫 School Profile</span>
        <span>›</span>
      </div>

      <div
        style={cardStyle}
        onClick={() => onNavigate("language")}
      >
        <span>🌐 Language</span>
        <span>›</span>
      </div>

      <div
        style={cardStyle}
        onClick={() => onNavigate("about")}
      >
        <span>ℹ️ About</span>
        <span>›</span>
      </div>
    </div>
  );
}