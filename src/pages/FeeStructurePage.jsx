import { useState } from "react";

const DEFAULT_ITEMS = [
  { id: 1, name: "Tuition Fee", amount: "2500" }, 
];

export default function FeeStructurePage({ onBack }) {
  const [classVal, setClassVal] = useState("Class 5A");
  const [year, setYear] = useState("2024 - 2025");
  const [freq, setFreq] = useState("monthly");
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [saved, setSaved] = useState(false);

  const total = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);

  const updateItem = (id, key, val) => setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: val } : i));
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const addItem = () => setItems(prev => [...prev, { id: Date.now(), name: "", amount: "" }]);

  const FREQS = [
    { id: "monthly", label: "Monthly", sub: "Collect fee every month", badge: "12 Installments", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" /><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" /><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" /><polyline points="9 16 11 18 15 14" stroke="currentColor" strokeWidth="1.8" /></svg> },
    { id: "quarterly", label: "Quarterly", sub: "Collect fee every quarter", badge: "4 Installments", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" /><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" /><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" /><polyline points="9 16 11 18 15 14" stroke="currentColor" strokeWidth="1.8" /></svg> },
    { id: "yearly", label: "Yearly", sub: "Collect fee once a year", badge: "1 Installment", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" /><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" /><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" /><polyline points="9 16 11 18 15 14" stroke="currentColor" strokeWidth="1.8" /></svg> },
  ];

  const user = JSON.parse(localStorage.getItem("user"));

const handleSave = async () => {
  try {

    const payload = {
      schoolId: user.schoolId,

      className: classVal
        .replace("Class ", "")
        .replace(/[A-Z]/g, "")
        .trim(),

      academicYear: year.replace(/\s/g, ""),

      frequency: freq.toUpperCase(),

      items: items.map((item) => ({
        componentName: item.name,
        amount: parseFloat(item.amount) || 0,
      })),
    };

    console.log("FEE PAYLOAD:", payload);

    const response = await fetch(
      "http://localhost:8089/api/fees/structure",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save fee structure");
    }

    const data = await response.text();

    console.log("SAVE RESPONSE:", data);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);

  } catch (error) {
    console.error("Error saving fee structure:", error);
    alert("Failed to save fee structure");
  }
};


const handleAssignFee = async () => {

  try {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const payload = {

      schoolId: user.schoolId,

      className: classVal
        .replace("Class ", "")
        .trim(),

      section: "A",

      academicYear: year.replace(/\s/g, "")

    };

    console.log(
      "ASSIGN PAYLOAD:",
      payload
    );

    const response = await fetch(
      "http://localhost:8089/api/fees/assign-class",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)

      }
    );

    if (!response.ok) {

      const errorText =
        await response.text();

      alert(errorText);

      return;
    }

    const message =
      await response.text();

    alert(message);

  } catch (error) {

    console.error(error);

    alert("Error assigning fee");

  }
};

  const selectStyle = { width: "100%", padding: "11px 14px", border: "1.5px solid #e8ecf4", borderRadius: 10, fontSize: 14, color: "#1a2744", fontFamily: "inherit", outline: "none", background: "#fff", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpolyline points='6 9 12 15 18 9' stroke='%238898b8' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36, cursor: "pointer" };

  return (
    <div>
      <style>{`.fee-input:focus{border-color:#4361ee !important;outline:none;box-shadow:0 0 0 3px rgba(67,97,238,0.1);}`}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#1a2744" }}>Create Fee Structure</h2>
          <p style={{ margin: 0, color: "#8898b8", fontSize: 13.5 }}>Add and manage fee structure for different classes.</p>
        </div>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#4361ee", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="15 18 9 12 15 6" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" /></svg>
          Back to Fee Structure
        </button>
      </div>

      {/* Step 1 */}
      <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#4361ee", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>1</div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1a2744" }}>Select Class & Academic Year</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374162", marginBottom: 5, display: "block" }}>Class <span style={{ color: "#e53e3e" }}>*</span></label>
            <select className="fee-input" style={selectStyle} value={classVal} onChange={e => setClassVal(e.target.value)}>
              {["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6","Class 7","Class 8","Class 9","Class 10"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374162", marginBottom: 5, display: "block" }}>Academic Year <span style={{ color: "#e53e3e" }}>*</span></label>
            <select className="fee-input" style={selectStyle} value={year} onChange={e => setYear(e.target.value)}>
              {["2024 - 2025", "2025 - 2026", "2023 - 2024"].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#7b61ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>2</div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1a2744" }}>Select Fee Frequency</h3>
        </div>
        <p style={{ margin: "0 0 18px 42px", fontSize: 13, color: "#8898b8" }}>Choose how often the fee should be collected.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {FREQS.map(f => (
            <label key={f.id} style={{ border: `2px solid ${freq === f.id ? "#4361ee" : "#e8ecf4"}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", background: freq === f.id ? "#f8f9ff" : "#fff", transition: "all 0.15s" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${freq === f.id ? "#4361ee" : "#d0d5e8"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  {freq === f.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4361ee" }} />}
                </div>
                <input type="radio" name="freq" value={f.id} checked={freq === f.id} onChange={() => setFreq(f.id)} style={{ display: "none" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: freq === f.id ? "#4361ee" : "#8898b8", marginBottom: 8 }}>{f.icon}</div>
                  <p style={{ margin: "0 0 3px", fontWeight: 800, fontSize: 15, color: "#1a2744" }}>{f.label}</p>
                  <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "#8898b8" }}>{f.sub}</p>
                  <span style={{ background: freq === f.id ? "#eef0fd" : "#f5f6fc", color: freq === f.id ? "#4361ee" : "#8898b8", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{f.badge}</span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Step 3 */}
      <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#2ec4b6", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>3</div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1a2744" }}>Enter Fee Details</h3>
          </div>
          <button onClick={addItem} style={{ background: "none", border: "none", color: "#4361ee", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
            + Add New Fee Item
          </button>
        </div>
        <p style={{ margin: "0 0 20px 42px", fontSize: 13, color: "#8898b8" }}>Add fee components and their amounts.</p>

        {/* Table Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 40px", gap: 12, padding: "10px 14px", background: "#fafbff", borderRadius: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#8898b8" }}>Fee Component</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#8898b8" }}>Amount (₹)</span>
          <span></span>
        </div>

        {items.map(item => (
          <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 160px 40px", gap: 12, alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#c0c8d8", cursor: "grab", fontSize: 16 }}>⋮⋮</span>
              <input className="fee-input" value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)}
                style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #e8ecf4", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#1a2744", background: "#fff", boxSizing: "border-box" }} />
            </div>
            <input className="fee-input" value={item.amount} onChange={e => updateItem(item.id, "amount", e.target.value)}
              style={{ padding: "10px 14px", border: "1.5px solid #e8ecf4", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#1a2744", background: "#fff", width: "100%", boxSizing: "border-box" }} />
            <button onClick={() => removeItem(item.id)} style={{ width: 32, height: 32, borderRadius: 8, background: "#fff0f0", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="#ef4444" strokeWidth="1.8" /><path d="M19 6l-1 14H6L5 6" stroke="#ef4444" strokeWidth="1.8" /><path d="M10 11v6M14 11v6" stroke="#ef4444" strokeWidth="1.8" /></svg>
            </button>
          </div>
        ))}

        {/* Total */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 40px", gap: 12, padding: "14px", background: "#f8f9ff", borderRadius: 10, marginTop: 8, border: "1.5px solid #e8ecf4" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1a2744" }}>Total Fee ({freq === "monthly" ? "Monthly" : freq === "quarterly" ? "Quarterly" : "Yearly"})</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#22c55e" }}>₹ {total.toLocaleString("en-IN")}</span>
          <span></span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
        <button onClick={onBack} style={{ background: "#fff", border: "1.5px solid #e8ecf4", color: "#5a6783", borderRadius: 10, padding: "11px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        {/* Assign Fee Button */}
  <button
    onClick={handleAssignFee}
    style={{
      background: "#7b61ff",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      padding: "11px 28px",
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      fontFamily: "inherit",
      boxShadow: "0 4px 12px rgba(123,97,255,0.3)"
    }}
  >
    Assign Fee To Class
  </button>
        <button onClick={handleSave} style={{ background: saved ? "#22c55e" : "#4361ee", color: "#fff", border: "none", borderRadius: 10, padding: "11px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 12px ${saved ? "rgba(34,197,94,0.3)" : "rgba(67,97,238,0.3)"}`, transition: "all 0.2s" }}>
          {saved ? "✓ Saved!" : "Save Fee Structure"}
        </button>
      </div>
    </div>
  );
}
