import { useState } from "react";

const EXAM_TYPES = ["Unit Test", "Half Yearly", "Final Exam", "Mid Term", "Pre Board"];
const ACADEMIC_YEARS = ["2024 - 2025", "2023 - 2024", "2022 - 2023"];
const GRADE_SYSTEMS = ["CBSE (A1, A2, B1, B2, C1, C2, D)", "ICSE (A, B, C, D, E)", "Percentage Only", "GPA (4.0 Scale)"];
const ALL_CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
const ALL_SUBJECTS = ["Mathematics", "English", "Science", "Social Studies", "Hindi", "Computer", "Art", "Physical Education"];

export default function ExamSetupPage({ onBack }) {
  const [examName, setExamName] = useState("Unit Test - 1 (2024-25)");
  const [academicYear, setAcademicYear] = useState("2024 - 2025");
  const [examType, setExamType] = useState("Unit Test");
  const [startDate, setStartDate] = useState("2024-06-10");
  const [endDate, setEndDate] = useState("2024-06-15");
  const [description, setDescription] = useState("First unit test covering syllabus from April to June.");
  const [selectedClasses, setSelectedClasses] = useState(["Class 5", "Class 4", "Class 3"]);
  const [selectedSubjects, setSelectedSubjects] = useState(["Mathematics", "English", "Science"]);
  const [passingMarks, setPassingMarks] = useState("33");
  const [gradeSystem, setGradeSystem] = useState(GRADE_SYSTEMS[0]);
  const [totalMarks, setTotalMarks] = useState("300");
  const [sectionWise, setSectionWise] = useState(true);
  const [sections, setSections] = useState([
    { section: "A", subject: "Mathematics", marks: "100" },
    { section: "B", subject: "English", marks: "100" },
    { section: "C", subject: "Science", marks: "100" },
  ]);
  const [publishDate, setPublishDate] = useState("2024-06-20");
  const [allowReExam, setAllowReExam] = useState(false);
  const [allowMarksEntry, setAllowMarksEntry] = useState(true);
  const [sendSMS, setSendSMS] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  const toggleClass = (cls) => {
    setSelectedClasses(prev => prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]);
  };
  const toggleSubject = (subj) => {
    setSelectedSubjects(prev => prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]);
  };
  const addSection = () => {
    setSections(prev => [...prev, { section: String.fromCharCode(65 + prev.length), subject: "", marks: "100" }]);
  };
  const updateSection = (i, field, val) => {
    setSections(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  };

  return (
    <div>
      <style>{`
        .setup-input { border:1.5px solid #e8ecf4; border-radius:10px; padding:10px 14px; font-size:13.5px; font-weight:600; color:#1a2744; font-family:inherit; width:100%; outline:none; transition:border 0.15s; background:#fff; }
        .setup-input:focus { border-color:#4361ee; box-shadow:0 0 0 3px rgba(67,97,238,0.08); }
        .setup-select { border:1.5px solid #e8ecf4; border-radius:10px; padding:10px 36px 10px 14px; font-size:13.5px; font-weight:600; color:#1a2744; font-family:inherit; width:100%; appearance:none; background:#fff url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238898b8' strokeWidth='1.5' strokeLinecap='round'/%3E%3C/svg%3E") no-repeat right 12px center; cursor:pointer; outline:none; }
        .setup-select:focus { border-color:#4361ee; }
        .setup-label { display:block; font-size:12px; font-weight:700; color:#8898b8; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.4px; }
        .setup-card { background:#fff; border-radius:20px; padding:28px; box-shadow:0 2px 12px rgba(67,97,238,0.06); margin-bottom:20px; }
        .card-title { display:flex; align-items:center; gap:10px; margin-bottom:22px; }
        .tag-chip { display:inline-flex; align-items:center; gap:5px; background:#f0f4ff; color:#4361ee; border-radius:20px; padding:5px 12px; font-size:12.5px; font-weight:700; margin:3px; }
        .tag-chip button { background:none; border:none; cursor:pointer; color:#4361ee; font-size:14px; line-height:1; padding:0; display:flex; align-items:center; }
        .setup-btn { border:none; border-radius:12px; padding:10px 20px; font-size:13.5px; font-weight:700; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:7px; transition:all 0.15s; }
        .setup-btn:hover { transform:translateY(-1px); }
        .toggle-track { width:42px; height:24px; border-radius:12px; background:#e8ecf4; border:none; cursor:pointer; position:relative; transition:background 0.2s; padding:0; }
        .toggle-track.on { background:#4361ee; }
        .toggle-thumb { position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; transition:left 0.2s; box-shadow:0 1px 4px rgba(0,0,0,0.15); }
        .toggle-track.on .toggle-thumb { left:21px; }
        .dropdown-list { position:absolute; top:calc(100% + 4px); left:0; right:0; background:#fff; border:1.5px solid #e8ecf4; border-radius:12px; box-shadow:0 8px 24px rgba(67,97,238,0.12); z-index:50; max-height:200px; overflow-y:auto; }
        .dropdown-item { padding:9px 14px; font-size:13.5px; font-weight:600; color:#1a2744; cursor:pointer; display:flex; align-items:center; gap:8px; }
        .dropdown-item:hover { background:#f0f4ff; }
        .section-table { width:100%; border-collapse:collapse; margin-top:8px; }
        .section-table th { padding:8px 14px; text-align:left; font-size:12px; font-weight:700; color:#8898b8; border-bottom:2px solid #f0f2fb; }
        .section-table td { padding:8px 14px; border-bottom:1px solid #f5f6fc; }
        .section-input { border:1.5px solid #e8ecf4; border-radius:8px; padding:7px 12px; font-size:13.5px; font-weight:600; color:#1a2744; font-family:inherit; outline:none; }
        .section-input:focus { border-color:#4361ee; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
        <span onClick={onBack} style={{ color: "#8898b8", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Dashboard</span>
        <span style={{ color: "#c0c8d8", fontSize: 13 }}>/</span>
        <span onClick={onBack} style={{ color: "#8898b8", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Examinations</span>
        <span style={{ color: "#c0c8d8", fontSize: 13 }}>/</span>
        <span style={{ color: "#1a2744", fontSize: 13, fontWeight: 600 }}>Exam Setup</span>
      </div>

      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#1a2744" }}>Exam Setup</h2>
          <p style={{ margin: 0, color: "#8898b8", fontSize: 13.5 }}>Create and configure a new exam</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="setup-btn" onClick={onBack} style={{ background: "#f5f6fc", color: "#5a6783" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5" stroke="#5a6783" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 19l-7-7 7-7" stroke="#5a6783" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Examinations
          </button>
          <button className="setup-btn" onClick={() => setSaved(true)} style={{ background: "#4361ee", color: "#fff", boxShadow: "0 4px 12px rgba(67,97,238,0.3)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="#fff" strokeWidth="1.8"/><polyline points="17 21 17 13 7 13 7 21" stroke="#fff" strokeWidth="1.8"/><polyline points="7 3 7 8 15 8" stroke="#fff" strokeWidth="1.8"/></svg>
            {saved ? "✓ Saved!" : "Save Exam"}
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="setup-card">
        <div className="card-title">
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#4361ee" strokeWidth="1.8"/><line x1="16" y1="2" x2="16" y2="6" stroke="#4361ee" strokeWidth="1.8"/><line x1="8" y1="2" x2="8" y2="6" stroke="#4361ee" strokeWidth="1.8"/><line x1="3" y1="10" x2="21" y2="10" stroke="#4361ee" strokeWidth="1.8"/></svg>
          </div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1a2744" }}>Basic Information</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label className="setup-label">Exam Name *</label>
            <input className="setup-input" value={examName} onChange={e => setExamName(e.target.value)} placeholder="Enter exam name" />
          </div>
          <div>
            <label className="setup-label">Academic Year *</label>
            <div style={{ position: "relative" }}>
              <select className="setup-select" value={academicYear} onChange={e => setAcademicYear(e.target.value)}>
                {ACADEMIC_YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label className="setup-label">Exam Type *</label>
            <select className="setup-select" value={examType} onChange={e => setExamType(e.target.value)}>
              {EXAM_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="setup-label">Start Date *</label>
            <input className="setup-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="setup-label">End Date *</label>
            <input className="setup-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="setup-label">Description</label>
          <textarea className="setup-input" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter exam description..." style={{ resize: "vertical", lineHeight: 1.5 }} />
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#c0c8d8", textAlign: "right" }}>{description.length}/500</p>
        </div>
      </div>

      {/* Select Classes & Subjects */}
      <div className="setup-card">
        <div className="card-title">
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#e8faf9", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#2ec4b6" strokeWidth="1.8"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="#2ec4b6" strokeWidth="1.8"/></svg>
          </div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1a2744" }}>Select Classes & Subjects</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Classes */}
          <div>
            <label className="setup-label">Classes *</label>
            <div style={{ position: "relative" }}>
              <div onClick={() => { setShowClassDropdown(v => !v); setShowSubjectDropdown(false); }}
                style={{ border: "1.5px solid #e8ecf4", borderRadius: 10, padding: "8px 12px", minHeight: 42, cursor: "pointer", display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", background: "#fff" }}>
                {selectedClasses.map(cls => (
                  <span className="tag-chip" key={cls}>{cls}
                    <button onClick={e => { e.stopPropagation(); toggleClass(cls); }}>×</button>
                  </span>
                ))}
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ marginLeft: "auto" }}><path d="M1 1l5 5 5-5" stroke="#8898b8" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              {showClassDropdown && (
                <div className="dropdown-list">
                  {ALL_CLASSES.map(cls => (
                    <div key={cls} className="dropdown-item" onClick={() => toggleClass(cls)}>
                      <input type="checkbox" readOnly checked={selectedClasses.includes(cls)} style={{ accentColor: "#4361ee" }} />
                      {cls}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Subjects */}
          <div>
            <label className="setup-label">Subjects *</label>
            <div style={{ position: "relative" }}>
              <div onClick={() => { setShowSubjectDropdown(v => !v); setShowClassDropdown(false); }}
                style={{ border: "1.5px solid #e8ecf4", borderRadius: 10, padding: "8px 12px", minHeight: 42, cursor: "pointer", display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", background: "#fff" }}>
                {selectedSubjects.map(s => (
                  <span className="tag-chip" key={s} style={{ background: "#fff4eb", color: "#f4a261" }}>{s}
                    <button onClick={e => { e.stopPropagation(); toggleSubject(s); }} style={{ color: "#f4a261" }}>×</button>
                  </span>
                ))}
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ marginLeft: "auto" }}><path d="M1 1l5 5 5-5" stroke="#8898b8" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              {showSubjectDropdown && (
                <div className="dropdown-list">
                  {ALL_SUBJECTS.map(s => (
                    <div key={s} className="dropdown-item" onClick={() => toggleSubject(s)}>
                      <input type="checkbox" readOnly checked={selectedSubjects.includes(s)} style={{ accentColor: "#4361ee" }} />
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grading & Marks */}
      <div className="setup-card">
        <div className="card-title">
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fff8e6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⭐</div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1a2744" }}>Grading & Marks</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 16, marginBottom: 18 }}>
          <div>
            <label className="setup-label">Passing Marks (%) *</label>
            <input className="setup-input" type="number" value={passingMarks} onChange={e => setPassingMarks(e.target.value)} />
          </div>
          <div>
            <label className="setup-label">Grade System</label>
            <select className="setup-select" value={gradeSystem} onChange={e => setGradeSystem(e.target.value)}>
              {GRADE_SYSTEMS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="setup-label">Total Marks *</label>
            <input className="setup-input" type="number" value={totalMarks} onChange={e => setTotalMarks(e.target.value)} />
          </div>
        </div>

        {/* Section wise toggle */}
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 16 }}>
          <button className={`toggle-track${sectionWise ? " on" : ""}`} onClick={() => setSectionWise(v => !v)}>
            <div className="toggle-thumb" />
          </button>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1a2744" }}>Enable Section Wise Marks</span>
        </label>

        {sectionWise && (
          <div>
            <table className="section-table">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Subjects</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((sec, i) => (
                  <tr key={i}>
                    <td style={{ fontSize: 14, fontWeight: 600, color: "#1a2744" }}>{sec.section}</td>
                    <td>
                      <select className="section-input" style={{ minWidth: 160 }} value={sec.subject} onChange={e => updateSection(i, "subject", e.target.value)}>
                        <option value="">Select Subject</option>
                        {ALL_SUBJECTS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <input className="section-input" type="number" value={sec.marks} onChange={e => updateSection(i, "marks", e.target.value)} style={{ width: 100 }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addSection} style={{ background: "none", border: "none", color: "#4361ee", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, padding: "12px 0 0" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="#4361ee" strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="#4361ee" strokeWidth="2" strokeLinecap="round"/></svg>
              Add Section
            </button>
          </div>
        )}
      </div>

      {/* Additional Settings */}
      <div className="setup-card">
        <div className="card-title">
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f0ecff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="#7b61ff" strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="#7b61ff" strokeWidth="1.8"/></svg>
          </div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1a2744" }}>Additional Settings</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18 }}>
          <div>
            <label className="setup-label">Result Publish Date</label>
            <input className="setup-input" type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} />
          </div>
          <div>
            <label className="setup-label">Allow Re-Exam</label>
            <div style={{ marginTop: 8 }}>
              <button className={`toggle-track${allowReExam ? " on" : ""}`} onClick={() => setAllowReExam(v => !v)}>
                <div className="toggle-thumb" />
              </button>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 600, color: "#1a2744" }}>
            <input type="checkbox" checked={allowMarksEntry} onChange={e => setAllowMarksEntry(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#4361ee", cursor: "pointer" }} />
            Allow Marks Entry
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 600, color: "#1a2744" }}>
            <input type="checkbox" checked={sendSMS} onChange={e => setSendSMS(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#4361ee", cursor: "pointer" }} />
            Send SMS to Parents
          </label>
        </div>
      </div>

      <p style={{ textAlign: "center", color: "#c0c8d8", fontSize: "12px", marginTop: "8px", marginBottom: 28 }}>© 2024 Greenfield Primary School. All Rights Reserved.</p>
    </div>
  );
}
