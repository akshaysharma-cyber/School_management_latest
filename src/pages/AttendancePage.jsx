import { useState } from "react";

const STUDENTS = [
  { id: 1, name: "Rahul Sharma", initials: "RS", color: "#eef0fd", textColor: "#4361ee" },
  { id: 2, name: "Priya Singh", initials: "PS", color: "#fff4eb", textColor: "#f4a261" },
  { id: 3, name: "Aman Verma", initials: "AV", color: "#e8faf9", textColor: "#2ec4b6" },
  { id: 4, name: "Sneha Kumari", initials: "SK", color: "#f0ecff", textColor: "#7b61ff" },
  { id: 5, name: "Rohan Kumar", initials: "RK", color: "#fff4eb", textColor: "#f4a261" },
  { id: 6, name: "Neha Patel", initials: "NP", color: "#eef0fd", textColor: "#4361ee" },
  { id: 7, name: "Vikram Singh", initials: "VI", color: "#f0ecff", textColor: "#7b61ff" },
  { id: 8, name: "Aarav Ali", initials: "AA", color: "#e8faf9", textColor: "#2ec4b6" },
  { id: 9, name: "Meera Joshi", initials: "MJ", color: "#eef0fd", textColor: "#4361ee" },
  { id: 10, name: "Arjun Mehta", initials: "AM", color: "#fff4eb", textColor: "#f4a261" },
];

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(() => {
    const init = {};
    STUDENTS.forEach((s, i) => { init[s.id] = i % 4 !== 1 && i % 4 !== 4; });
    return init;
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [saved, setSaved] = useState(false);
  const [selectedClass, setSelectedClass] = useState("Class 5 - A");

  const toggle = (id) => setAttendance(a => ({ ...a, [id]: !a[id] }));
  const markAll = (val) => setAttendance(a => { const n = { ...a }; STUDENTS.forEach(s => n[s.id] = val); return n; });

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = STUDENTS.length - presentCount;
  const pct = Math.round((presentCount / STUDENTS.length) * 100);

  const filtered = STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "present" ? attendance[s.id] : !attendance[s.id]);
    return matchSearch && matchFilter;
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div>
      <style>{`.att-toggle{position:relative;display:inline-block;width:44px;height:24px}.att-toggle input{opacity:0;width:0;height:0}.att-slider{position:absolute;cursor:pointer;inset:0;background:#e8ecf4;border-radius:24px;transition:0.2s}.att-slider:before{content:'';position:absolute;width:18px;height:18px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.15)}.att-toggle input:checked+.att-slider{background:#22c55e}.att-toggle input:checked+.att-slider:before{transform:translateX(20px)}`}</style>

      {/* Filters Row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 12, padding: "10px 16px", boxShadow: "0 2px 8px rgba(67,97,238,0.07)", minWidth: 200 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#8898b8" strokeWidth="1.8" /><line x1="16" y1="2" x2="16" y2="6" stroke="#8898b8" strokeWidth="1.8" /><line x1="8" y1="2" x2="8" y2="6" stroke="#8898b8" strokeWidth="1.8" /><line x1="3" y1="10" x2="21" y2="10" stroke="#8898b8" strokeWidth="1.8" /></svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a2744" }}>Monday, 10 June 2024</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="6 9 12 15 18 9" stroke="#8898b8" strokeWidth="2" /></svg>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 12, padding: "10px 16px", boxShadow: "0 2px 8px rgba(67,97,238,0.07)", minWidth: 180 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="#8898b8" strokeWidth="1.8" /><path d="M6 12v5c3 3 9 3 12 0v-5" stroke="#8898b8" strokeWidth="1.8" /></svg>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ border: "none", outline: "none", fontSize: 13, fontWeight: 600, color: "#1a2744", background: "none", cursor: "pointer", fontFamily: "inherit" }}>
            {["Class 5 - A", "Class 5 - B", "Class 4 - A", "Class 3 - A"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button style={{ marginLeft: "auto", background: "#4361ee", color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(67,97,238,0.3)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="#fff" strokeWidth="2" /><line x1="12" y1="20" x2="12" y2="4" stroke="#fff" strokeWidth="2" /><line x1="6" y1="20" x2="6" y2="14" stroke="#fff" strokeWidth="2" /></svg>
          View Report
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Students", value: STUDENTS.length, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#4361ee" strokeWidth="1.8" /><circle cx="9" cy="7" r="4" stroke="#4361ee" strokeWidth="1.8" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#4361ee" strokeWidth="1.8" /><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#4361ee" strokeWidth="1.8" /></svg>, bg: "#eef0fd", valueColor: "#1a2744" },
          { label: "Present", value: presentCount, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="1.8" /><polyline points="9 12 11 14 15 10" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" /></svg>, bg: "#f0fdf4", valueColor: "#22c55e" },
          { label: "Absent", value: absentCount, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8" /><line x1="15" y1="9" x2="9" y2="15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /><line x1="9" y1="9" x2="15" y2="15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /></svg>, bg: "#fef2f2", valueColor: "#ef4444" },
          { label: "Attendance Percentage", value: `${pct}%`, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#f4a261" strokeWidth="1.8" /><path d="M12 6v6l4 2" stroke="#f4a261" strokeWidth="1.8" strokeLinecap="round" /></svg>, bg: "#fff8f0", valueColor: "#f4a261" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 2px 12px rgba(67,97,238,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.icon}</div>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 28, fontWeight: 800, color: s.valueColor, lineHeight: 1 }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: 12.5, color: "#8898b8", fontWeight: 500 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 24px", borderBottom: "1px solid #f5f6fc", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8f9fc", borderRadius: 10, padding: "9px 14px", flex: 1, minWidth: 200 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#b0bbc9" strokeWidth="1.8" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#b0bbc9" strokeWidth="1.8" /></svg>
            <input style={{ border: "none", outline: "none", background: "none", fontSize: 13.5, color: "#1a2744", fontFamily: "inherit", width: "100%" }} placeholder="Search student by name or roll no..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ border: "1.5px solid #e8ecf4", borderRadius: 10, padding: "9px 14px", fontSize: 13.5, color: "#1a2744", background: "#fff", fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
            <option value="all">All Students</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
          <button onClick={() => markAll(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1.5px solid #22c55e", color: "#22c55e", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2" /><polyline points="9 12 11 14 15 10" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" /></svg>
            Mark All Present
          </button>
          <button onClick={() => markAll(false)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fef2f2", border: "1.5px solid #ef4444", color: "#ef4444", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" /><line x1="15" y1="9" x2="9" y2="15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /><line x1="9" y1="9" x2="15" y2="15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /></svg>
            Mark All Absent
          </button>
        </div>

        {/* Table Header */}
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 140px 100px", padding: "12px 24px", background: "#fafbff", borderBottom: "1px solid #f5f6fc" }}>
          {["Roll No.", "Student Name", "Status", "Action"].map(h => (
            <span key={h} style={{ fontSize: 12.5, fontWeight: 700, color: "#8898b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((s, i) => (
          <div key={s.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr 140px 100px", padding: "14px 24px", borderBottom: i < filtered.length - 1 ? "1px solid #f5f6fc" : "none", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#8898b8" }}>{s.id}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: s.textColor, flexShrink: 0 }}>{s.initials}</div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1a2744" }}>{s.name}</span>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "4px 14px", borderRadius: 20, fontSize: 12.5, fontWeight: 700, background: attendance[s.id] ? "#f0fdf4" : "#fef2f2", color: attendance[s.id] ? "#22c55e" : "#ef4444", width: "fit-content" }}>
              {attendance[s.id] ? "Present" : "Absent"}
            </span>
            <label className="att-toggle">
              <input type="checkbox" checked={attendance[s.id]} onChange={() => toggle(s.id)} />
              <span className="att-slider"></span>
            </label>
          </div>
        ))}

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderTop: "1px solid #f5f6fc", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#b0bbc9", fontSize: 13 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#b0bbc9" strokeWidth="1.8" /><polyline points="12 6 12 12 16 14" stroke="#b0bbc9" strokeWidth="1.8" /></svg>
            Last marked: Today, 09:30 AM
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e8ecf4", color: "#5a6783", borderRadius: 10, padding: "10px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#5a6783" strokeWidth="1.8" /></svg>
              Send SMS to Absent Parents
            </button>
            <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 8, background: saved ? "#22c55e" : "#4361ee", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 12px ${saved ? "rgba(34,197,94,0.3)" : "rgba(67,97,238,0.3)"}`, transition: "all 0.2s" }}>
              {saved ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="#fff" strokeWidth="1.8" /><polyline points="17 21 17 13 7 13 7 21" stroke="#fff" strokeWidth="1.8" /><polyline points="7 3 7 8 15 8" stroke="#fff" strokeWidth="1.8" /></svg>}
              {saved ? "Saved!" : "Save Attendance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
