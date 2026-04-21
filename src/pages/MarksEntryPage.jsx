import { useState } from "react";

const EXAMS = ["Unit Test - 1 (2024-25)", "Half Yearly (2024-25)", "Final Exam (2024-25)"];
const CLASSES = ["Class 3", "Class 4", "Class 5"];
const SECTIONS = ["A", "B", "C"];
const SUBJECTS = [
  { name: "Mathematics", max: 100, color: "#4361ee", bg: "#4361ee" },
  { name: "English", max: 100, color: "#2ec4b6", bg: "#2ec4b6" },
  { name: "Science", max: 100, color: "#7b61ff", bg: "#7b61ff" },
];

const ALL_STUDENTS = [
  { id: "GPS001", roll: "01", name: "Ravi Kumar", math: 78, english: 65, science: 80 },
  { id: "GPS002", roll: "02", name: "Aman Singh", math: 88, english: 70, science: 75 },
  { id: "GPS003", roll: "03", name: "Priya Sharma", math: 92, english: 85, science: 90 },
  { id: "GPS004", roll: "04", name: "Neha Patel", math: 65, english: 60, science: 70 },
  { id: "GPS005", roll: "05", name: "Arjun Verma", math: 76, english: 72, science: 68 },
  { id: "GPS006", roll: "06", name: "Sneha Iyer", math: 84, english: 80, science: 78 },
  { id: "GPS007", roll: "07", name: "Kabir Gupta", math: 90, english: 88, science: 85 },
  { id: "GPS008", roll: "08", name: "Ananya Das", math: 71, english: 68, science: 74 },
  { id: "GPS009", roll: "09", name: "Vivaan Shah", math: 86, english: 82, science: 79 },
  { id: "GPS010", roll: "10", name: "Diya Mehta", math: 79, english: 75, science: 77 },
];

const PAGE_SIZE = 10;

export default function MarksEntryPage({ onBack }) {
  const [selectedExam, setSelectedExam] = useState(EXAMS[0]);
  const [selectedClass, setSelectedClass] = useState(CLASSES[2]);
  const [selectedSection, setSelectedSection] = useState(SECTIONS[0]);
  const [activeSubject, setActiveSubject] = useState(0);
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState(false);
  const [marks, setMarks] = useState(
    ALL_STUDENTS.reduce((acc, s) => ({
      ...acc,
      [s.id]: { 0: s.math, 1: s.english, 2: s.science }
    }), {})
  );

  const handleMark = (id, val) => {
    const num = Math.min(SUBJECTS[activeSubject].max, Math.max(0, parseInt(val) || 0));
    setMarks(prev => ({ ...prev, [id]: { ...prev[id], [activeSubject]: num } }));
    setSaved(false);
  };

  const totalPages = Math.ceil(ALL_STUDENTS.length / PAGE_SIZE);
  const pageStudents = ALL_STUDENTS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const subjMarks = ALL_STUDENTS.map(s => marks[s.id]?.[activeSubject] || 0);
  const avg = (subjMarks.reduce((a, b) => a + b, 0) / subjMarks.length).toFixed(2);
  const highest = Math.max(...subjMarks);
  const lowest = Math.min(...subjMarks);

  const autoFill = () => {
    setMarks(prev => {
      const updated = { ...prev };
      ALL_STUDENTS.forEach(s => {
        updated[s.id] = { ...updated[s.id], [activeSubject]: Math.floor(Math.random() * 40) + 55 };
      });
      return updated;
    });
  };

  return (
    <div>
      <style>{`
        .me-select { border:1.5px solid #e8ecf4; border-radius:10px; padding:9px 36px 9px 12px; font-size:13.5px; font-weight:600; color:#1a2744; font-family:inherit; appearance:none; background:#fff url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238898b8' strokeWidth='1.5' strokeLinecap='round'/%3E%3C/svg%3E") no-repeat right 12px center; cursor:pointer; outline:none; min-width:150px; }
        .me-select:focus { border-color:#4361ee; }
        .me-btn { border:none; border-radius:10px; padding:9px 16px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:6px; transition:all 0.15s; }
        .me-btn:hover { transform:translateY(-1px); }
        .marks-input { border:1.5px solid #e8ecf4; border-radius:8px; padding:8px 10px; font-size:14px; font-weight:700; color:#1a2744; font-family:inherit; width:100%; text-align:center; outline:none; transition:all 0.15s; }
        .marks-input:focus { border-color:#4361ee; box-shadow:0 0 0 3px rgba(67,97,238,0.08); }
        .page-btn { width:34px; height:34px; border:1.5px solid #e8ecf4; border-radius:8px; background:#fff; font-size:13.5px; font-weight:700; cursor:pointer; font-family:inherit; transition:all 0.15s; display:flex; align-items:center; justify-content:center; color:#5a6783; }
        .page-btn:hover { background:#f0f4ff; border-color:#c7d2fe; color:#4361ee; }
        .page-btn.active { background:#4361ee; border-color:#4361ee; color:#fff; }
        .page-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .subj-tab { border:none; border-radius:10px; padding:9px 16px; font-size:13.5px; font-weight:700; cursor:pointer; font-family:inherit; transition:all 0.15s; }
        .trow:hover { background:#f8f9ff; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
        <span onClick={onBack} style={{ color: "#8898b8", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Dashboard</span>
        <span style={{ color: "#c0c8d8", fontSize: 13 }}>/</span>
        <span onClick={onBack} style={{ color: "#8898b8", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Examinations</span>
        <span style={{ color: "#c0c8d8", fontSize: 13 }}>/</span>
        <span style={{ color: "#1a2744", fontSize: 13, fontWeight: 600 }}>Marks Entry</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#1a2744" }}>Marks Entry</h2>
          <p style={{ margin: 0, color: "#8898b8", fontSize: 13.5 }}>Enter and manage student marks</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="me-btn" onClick={onBack} style={{ background: "#f5f6fc", color: "#5a6783", padding: "9px 18px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5" stroke="#5a6783" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 19l-7-7 7-7" stroke="#5a6783" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Examinations
          </button>
          <button className="me-btn" onClick={() => setSaved(true)} style={{ background: "#4361ee", color: "#fff", padding: "9px 18px", boxShadow: "0 4px 12px rgba(67,97,238,0.3)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="#fff" strokeWidth="1.8"/><polyline points="17 21 17 13 7 13 7 21" stroke="#fff" strokeWidth="1.8"/><polyline points="7 3 7 8 15 8" stroke="#fff" strokeWidth="1.8"/></svg>
            {saved ? "✓ Marks Saved" : "Save Marks"}
          </button>
        </div>
      </div>

      {/* Filters + Stats */}
      <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8898b8", marginBottom: 6 }}>Select Exam</label>
            <select className="me-select" value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
              {EXAMS.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8898b8", marginBottom: 6 }}>Select Class</label>
            <select className="me-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
              {CLASSES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8898b8", marginBottom: 6 }}>Select Section</label>
            <select className="me-select" style={{ minWidth: 110 }} value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
              {SECTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{ background: "#f0f4ff", borderRadius: 12, padding: "12px 18px", display: "flex", gap: 20 }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#8898b8", fontWeight: 600 }}>Total Students</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#4361ee" }}>{ALL_STUDENTS.length}</p>
              </div>
              <div style={{ width: 1, background: "#e8ecf4" }} />
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#8898b8", fontWeight: 600 }}>Subjects</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#4361ee" }}>{SUBJECTS.length}</p>
              </div>
              <div style={{ width: 1, background: "#e8ecf4" }} />
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#8898b8", fontWeight: 600 }}>Total Marks</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#4361ee" }}>300</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marks Table Card */}
      <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 20 }}>
        {/* Subject Tabs + Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {SUBJECTS.map((s, i) => (
              <button key={s.name} className="subj-tab" onClick={() => setActiveSubject(i)}
                style={{ background: activeSubject === i ? s.bg : "transparent", color: activeSubject === i ? "#fff" : s.color, boxShadow: activeSubject === i ? `0 4px 12px ${s.color}44` : "none", border: activeSubject === i ? "none" : `1.5px solid ${s.color}44` }}>
                {s.name} ({s.max})
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="me-btn" style={{ background: "#f0f4ff", color: "#4361ee" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#4361ee" strokeWidth="1.8" strokeLinecap="round"/><polyline points="7 10 12 15 17 10" stroke="#4361ee" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="#4361ee" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Download Template
            </button>
            <button className="me-btn" onClick={autoFill} style={{ background: "#f0ecff", color: "#7b61ff" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="#7b61ff" strokeWidth="1.8" strokeLinecap="round"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#7b61ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
              Auto Fill
            </button>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f0f2fb" }}>
              <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 12.5, fontWeight: 700, color: "#8898b8" }}>#</th>
              <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 12.5, fontWeight: 700, color: "#8898b8" }}>Admission No.</th>
              <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 12.5, fontWeight: 700, color: "#8898b8" }}>Roll No.</th>
              <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 12.5, fontWeight: 700, color: "#8898b8" }}>Student Name</th>
              <th style={{ padding: "10px 14px", textAlign: "center", fontSize: 12.5, fontWeight: 700, color: "#8898b8" }}>Marks Obtained (out of {SUBJECTS[activeSubject].max})</th>
            </tr>
          </thead>
          <tbody>
            {pageStudents.map((s, i) => (
              <tr key={s.id} className="trow" style={{ borderBottom: "1px solid #f5f6fc" }}>
                <td style={{ padding: "12px 12px", fontSize: 13.5, color: "#8898b8", fontWeight: 600 }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td style={{ padding: "12px 14px", fontSize: 13.5, color: "#4361ee", fontWeight: 700 }}>{s.id}</td>
                <td style={{ padding: "12px 14px", fontSize: 13.5, color: "#5a6783", fontWeight: 600 }}>{s.roll}</td>
                <td style={{ padding: "12px 14px", fontSize: 14, color: "#1a2744", fontWeight: 600 }}>{s.name}</td>
                <td style={{ padding: "8px 40px" }}>
                  <input className="marks-input" type="number" min="0" max={SUBJECTS[activeSubject].max}
                    value={marks[s.id]?.[activeSubject] ?? ""}
                    onChange={e => handleMark(s.id, e.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination + Stats */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#8898b8" }}>Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, ALL_STUDENTS.length)} of {ALL_STUDENTS.length} students</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} className={`page-btn${page === i + 1 ? " active" : ""}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div style={{ background: "#f0f4ff", borderRadius: 12, padding: "10px 16px", display: "flex", gap: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#4361ee" }}>Subject Average: <strong>{avg}</strong></span>
            <span style={{ fontSize: 13, color: "#5a6783" }}>Highest: <strong style={{ color: "#2ec4b6" }}>{highest}</strong></span>
            <span style={{ fontSize: 13, color: "#5a6783" }}>Lowest: <strong style={{ color: "#e53e3e" }}>{lowest}</strong></span>
          </div>
        </div>
      </div>

      {/* Note */}
      <div style={{ background: "#fff8e6", border: "1.5px solid #ffe5a0", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <p style={{ margin: 0, fontSize: 13, color: "#7a5c00", fontWeight: 500 }}>
          <strong>Note:</strong> Click on subject tabs to enter marks for different subjects. Don't forget to save your changes.
        </p>
      </div>

      <p style={{ textAlign: "center", color: "#c0c8d8", fontSize: "12px", marginTop: "24px" }}>© 2024 Greenfield Primary School. All Rights Reserved.</p>
    </div>
  );
}
