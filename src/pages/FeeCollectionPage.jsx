import { useState } from "react";

const PAYMENTS = [
  { id: 1, initials: "RS", color: "#eef0fd", textColor: "#4361ee", name: "Rahul Sharma", classVal: "Class 5A", amount: "₹ 5,000", date: "10 Jun 2024", status: "Paid" },
  { id: 2, initials: "AP", color: "#f0ecff", textColor: "#7b61ff", name: "Ananya Patel", classVal: "Class 4B", amount: "₹ 4,500", date: "09 Jun 2024", status: "Paid" },
  { id: 3, initials: "VK", color: "#e8faf9", textColor: "#2ec4b6", name: "Vivaan Kumar", classVal: "Class 3A", amount: "₹ 5,000", date: "08 Jun 2024", status: "Pending" },
  { id: 4, initials: "SI", color: "#fff4eb", textColor: "#f4a261", name: "Siya Iyer", classVal: "Class 5A", amount: "₹ 5,000", date: "07 Jun 2024", status: "Paid" },
  { id: 5, initials: "AM", color: "#eef0fd", textColor: "#4361ee", name: "Arjun Mehta", classVal: "Class 4A", amount: "₹ 4,500", date: "06 Jun 2024", status: "Pending" },
];

const CLASS_DATA = [
  { name: "Class 5A", amount: "₹ 3,20,000", color: "#4361ee", pct: 26 },
  { name: "Class 4B", amount: "₹ 2,85,000", color: "#7b61ff", pct: 23 },
  { name: "Class 3A", amount: "₹ 3,10,000", color: "#2ec4b6", pct: 25 },
  { name: "Class 2C", amount: "₹ 3,30,000", color: "#f4a261", pct: 26 },
];

export default function FeeCollectionPage({ onNavigate }) {
  const [page, setPage] = useState(1);
  const [showCollect, setShowCollect] = useState(false);

  // Simple donut chart using SVG
  const DonutChart = () => {
    const r = 60, cx = 80, cy = 80, circ = 2 * Math.PI * r;
    let offset = 0;
    return (
      <svg viewBox="0 0 160 160" width="140" height="140">
        {CLASS_DATA.map((d, i) => {
          const dash = (d.pct / 100) * circ;
          const gap = circ - dash;
          const seg = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth="28"
            strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset} style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />;
          offset += dash;
          return seg;
        })}
        <circle cx={cx} cy={cy} r={46} fill="#fff" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="10" fill="#8898b8" fontFamily="inherit" fontWeight="600">Total</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="11" fill="#1a2744" fontFamily="inherit" fontWeight="800">₹12,45,000</text>
      </svg>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#1a2744" }}>Fee Collection</h2>
          <p style={{ margin: 0, color: "#8898b8", fontSize: 13.5 }}>Manage and track school fee collection.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {onNavigate && <button onClick={() => onNavigate("structure")} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", color: "#4361ee", border: "1.5px solid #4361ee", borderRadius: 12, padding: "11px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            Fee Structure
          </button>}
          <button onClick={() => setShowCollect(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "#4361ee", color: "#fff", border: "none", borderRadius: 12, padding: "11px 20px", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(67,97,238,0.3)" }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Collect Fee
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Fees Due", value: "₹ 18,75,000", icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#4361ee" strokeWidth="1.8" /><line x1="2" y1="10" x2="22" y2="10" stroke="#4361ee" strokeWidth="1.8" /></svg>, bg: "#eef0fd", color: "#4361ee" },
          { label: "Fees Collected", value: "₹ 12,45,000", icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#22c55e" strokeWidth="1.8" /><polyline points="9 12 11 14 15 10" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" /></svg>, bg: "#f0fdf4", color: "#22c55e" },
          { label: "Pending Amount", value: "₹ 6,30,000", icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#7b61ff" strokeWidth="1.8" /><polyline points="12 6 12 12 16 14" stroke="#7b61ff" strokeWidth="1.8" strokeLinecap="round" /></svg>, bg: "#f0ecff", color: "#7b61ff" },
          { label: "Collection Rate", value: "66.40%", icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><line x1="19" y1="5" x2="5" y2="19" stroke="#f4a261" strokeWidth="1.8" strokeLinecap="round" /><circle cx="6.5" cy="6.5" r="2.5" stroke="#f4a261" strokeWidth="1.8" /><circle cx="17.5" cy="17.5" r="2.5" stroke="#f4a261" strokeWidth="1.8" /></svg>, bg: "#fff8f0", color: "#f4a261" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 2px 12px rgba(67,97,238,0.06)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>{s.icon}</div>
            <p style={{ margin: "0 0 2px", fontSize: 13, color: "#8898b8", fontWeight: 500 }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a2744" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Recent Payments */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(67,97,238,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1a2744" }}>Recent Payments</h3>
            <button style={{ background: "none", border: "none", color: "#4361ee", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" }}>View All Payments</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px 80px", padding: "8px 0 12px", borderBottom: "1px solid #f5f6fc", gap: 8 }}>
            {["Student Name", "Class", "Amount", "Date", "Status"].map(h => (
              <span key={h} style={{ fontSize: 12.5, fontWeight: 700, color: "#8898b8" }}>{h}</span>
            ))}
          </div>
          {PAYMENTS.map((p, i) => (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px 80px", padding: "14px 0", borderBottom: i < PAYMENTS.length - 1 ? "1px solid #f5f6fc" : "none", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: p.textColor, flexShrink: 0 }}>{p.initials}</div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1a2744" }}>{p.name}</span>
              </div>
              <span style={{ fontSize: 13.5, color: "#5a6783" }}>{p.classVal}</span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1a2744" }}>{p.amount}</span>
              <span style={{ fontSize: 13, color: "#8898b8" }}>{p.date}</span>
              <span style={{ display: "inline-flex", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: p.status === "Paid" ? "#f0fdf4" : "#fff8f0", color: p.status === "Paid" ? "#22c55e" : "#f4a261", width: "fit-content" }}>{p.status}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
            <span style={{ fontSize: 13, color: "#8898b8" }}>Showing 5 of 32 payments</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setPage(n)} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid", borderColor: page === n ? "#4361ee" : "#e8ecf4", background: page === n ? "#4361ee" : "#fff", color: page === n ? "#fff" : "#5a6783", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{n}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Donut Chart */}
          <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(67,97,238,0.06)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 800, color: "#1a2744" }}>Collection by Class</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <DonutChart />
              <div style={{ flex: 1 }}>
                {CLASS_DATA.map(d => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: "#5a6783", flex: 1 }}>{d.name}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1a2744" }}>{d.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fee Reminders */}
          <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(67,97,238,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1a2744" }}>Fee Reminders</h3>
              <button style={{ background: "none", border: "none", color: "#4361ee", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" }}>Send Reminders</button>
            </div>
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8" /><polyline points="12 6 12 12 16 14" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" /></svg>, bg: "#fef2f2", label: "15 Students", sub: "Fees overdue" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#4361ee" strokeWidth="1.8" /><line x1="16" y1="2" x2="16" y2="6" stroke="#4361ee" strokeWidth="1.8" /><line x1="8" y1="2" x2="8" y2="6" stroke="#4361ee" strokeWidth="1.8" /><line x1="3" y1="10" x2="21" y2="10" stroke="#4361ee" strokeWidth="1.8" /></svg>, bg: "#eef0fd", label: "8 Students", sub: "Due in 3 days" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#7b61ff" strokeWidth="1.8" /><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#7b61ff" strokeWidth="1.8" /></svg>, bg: "#f0ecff", label: "12 Students", sub: "Due in 7 days" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < 2 ? 12 : 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r.icon}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1a2744" }}>{r.label}</p>
                  <p style={{ margin: 0, fontSize: 12.5, color: "#8898b8" }}>{r.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {showCollect && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,39,68,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowCollect(false)}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: 440, boxShadow: "0 20px 60px rgba(67,97,238,0.2)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#1a2744" }}>Collect Fee</h3>
            {[["Student Name", "Search student..."], ["Amount (₹)", "Enter amount"], ["Receipt No.", "Auto-generated"]].map(([label, placeholder]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374162", marginBottom: 5, display: "block" }}>{label}</label>
                <input placeholder={placeholder} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e8ecf4", borderRadius: 10, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowCollect(false)} style={{ flex: 1, background: "#fff", border: "1.5px solid #e8ecf4", color: "#5a6783", borderRadius: 10, padding: "11px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={() => setShowCollect(false)} style={{ flex: 1, background: "#4361ee", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Collect</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
