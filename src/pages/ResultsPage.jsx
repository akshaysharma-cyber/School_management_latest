import { useEffect, useState } from "react";

const PAGE_SIZE = 10;
const CLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const SECTIONS = ["A", "B", "C"];
const PASSING_PCT = 33;

export default function ResultsPage({ onBack }) {
  const [exams, setExams] = useState([]);

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({});

  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("6");
  const [selectedSection, setSelectedSection] = useState("A");

  const [activeSubject, setActiveSubject] = useState(0);
  const [page, setPage] = useState(1);

  // FETCH RESULT API
  useEffect(() => {

    const fetchResults = async () => {

      try {

        const user = JSON.parse(localStorage.getItem("user"));

        const res = await fetch(
          `http://localhost:8089/api/results/full-result?schoolId=${user.schoolId}&examId=${selectedExam}&className=${selectedClass}`
        );

        const data = await res.json();

        console.log("RESULT DATA =", data);

        setSubjects(data.subjects || []);
        setStudents(data.students || []);
        setSummary(data.summary || {});

      } catch (err) {
        console.error(err);
      }
    };

    if (selectedExam) {
      fetchResults();
    }

  }, [selectedExam, selectedClass, selectedSection]);



  // SUBJECT MARKS
  const getSubjectMarks = (student) => {

    const subjectId = subjects[activeSubject]?.subjectId;

    const found = student.marks?.find(
      m => m.subjectId === subjectId
    );

    return found?.marks || 0;
  };



  const allMarks = students.map(s => getSubjectMarks(s));

  const subjectMax = subjects[activeSubject]?.maxMarks || 0;

  const highestMark =
    allMarks.length > 0 ? Math.max(...allMarks) : 0;

  const lowestMark =
    allMarks.length > 0 ? Math.min(...allMarks) : 0;

  const topperStudent =
    students.find(s => getSubjectMarks(s) === highestMark);

  const lowestStudent =
    students.find(s => getSubjectMarks(s) === lowestMark);



  const totalPages = Math.ceil(students.length / PAGE_SIZE);

  const pageStudents = students.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );


  useEffect(() => {

  const fetchExams = async () => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch(
        `http://localhost:8089/api/exams/All-Exam?schoolId=${user.schoolId}`
      );

      const data = await res.json();

      setExams(data || []);

      if (data.length > 0) {
        setSelectedExam(data[0].id);
      }

    } catch (err) {
      console.error(err);
    }
  };

  fetchExams();

}, []);


const passed = students.filter(
  s => s.result === "Passed"
).length;

const failed = students.length - passed;

const passPercent =
  students.length > 0
    ? ((passed / students.length) * 100).toFixed(2)
    : 0;


    function getGrade(pct) {

  if (pct >= 91)
    return {
      grade: "A1",
      color: "#2ec4b6",
      bg: "#e8faf9"
    };

  if (pct >= 81)
    return {
      grade: "A",
      color: "#4361ee",
      bg: "#eef0fd"
    };

  if (pct >= 71)
    return {
      grade: "B",
      color: "#7b61ff",
      bg: "#f0ecff"
    };

  if (pct >= 61)
    return {
      grade: "C",
      color: "#f4a261",
      bg: "#fff4eb"
    };

  if (pct >= 33)
    return {
      grade: "D",
      color: "#f4a261",
      bg: "#fff4eb"
    };

  return {
    grade: "F",
    color: "#e53e3e",
    bg: "#fff5f5"
  };
}

const classAvg =
  summary?.average
    ? summary.average.toFixed(2)
    : 0;

  return (
    <div>
      <style>{`
        .res-select { border:1.5px solid #e8ecf4; border-radius:10px; padding:9px 36px 9px 12px; font-size:13.5px; font-weight:600; color:#1a2744; font-family:inherit; appearance:none; background:#fff url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238898b8' strokeWidth='1.5' strokeLinecap='round'/%3E%3C/svg%3E") no-repeat right 12px center; cursor:pointer; outline:none; min-width:150px; }
        .res-select:focus { border-color:#4361ee; }
        .res-btn { border:none; border-radius:10px; padding:9px 16px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:6px; transition:all 0.15s; }
        .res-btn:hover { transform:translateY(-1px); }
        .subj-tab { border:none; border-radius:10px; padding:9px 16px; font-size:13.5px; font-weight:700; cursor:pointer; font-family:inherit; transition:all 0.15s; }
        .trow:hover { background:#f8f9ff; }
        .page-btn { width:34px; height:34px; border:1.5px solid #e8ecf4; border-radius:8px; background:#fff; font-size:13.5px; font-weight:700; cursor:pointer; font-family:inherit; transition:all 0.15s; display:flex; align-items:center; justify-content:center; color:#5a6783; }
        .page-btn:hover { background:#f0f4ff; border-color:#c7d2fe; color:#4361ee; }
        .page-btn.active { background:#4361ee; border-color:#4361ee; color:#fff; }
        .page-btn:disabled { opacity:0.4; cursor:not-allowed; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
        <span onClick={onBack} style={{ color: "#8898b8", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Dashboard</span>
        <span style={{ color: "#c0c8d8", fontSize: 13 }}>/</span>
        <span onClick={onBack} style={{ color: "#8898b8", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Examinations</span>
        <span style={{ color: "#c0c8d8", fontSize: 13 }}>/</span>
        <span style={{ color: "#1a2744", fontSize: 13, fontWeight: 600 }}>Results</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#1a2744" }}>Results</h2>
          <p style={{ margin: 0, color: "#8898b8", fontSize: 13.5 }}>View and analyse exam results</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="res-btn" onClick={onBack} style={{ background: "#f5f6fc", color: "#5a6783", padding: "9px 18px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5" stroke="#5a6783" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 19l-7-7 7-7" stroke="#5a6783" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Examinations
          </button>
          <button className="res-btn" style={{ background: "#4361ee", color: "#fff", padding: "9px 18px", boxShadow: "0 4px 12px rgba(67,97,238,0.3)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/><polyline points="7 10 12 15 17 10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Download Results
          </button>
        </div>
      </div>

      {/* Filters + Stats */}
      <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8898b8", marginBottom: 6 }}>Select Exam</label>
            <select
  className="res-select"
  value={selectedExam}
  onChange={(e) => setSelectedExam(e.target.value)}
>

  {exams.map((exam) => (

  <option
    key={exam.id}
    value={exam.id}
  >
    {exam.examName}
  </option>

))}

</select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8898b8", marginBottom: 6 }}>Select Class</label>
            <select className="res-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
              {CLASSES.map(c => (
  <option key={c} value={c}>
    {c}
  </option>
))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8898b8", marginBottom: 6 }}>Select Section</label>
            <select className="res-select" style={{ minWidth: 110 }} value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
              {SECTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{ background: "#f0f4ff", borderRadius: 12, padding: "12px 18px", display: "flex", gap: 20 }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#8898b8", fontWeight: 600 }}>Total Students</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#4361ee" }}>{students.length}</p>
              </div>
              <div style={{ width: 1, background: "#e8ecf4" }} />
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#8898b8", fontWeight: 600 }}>Passed</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#2ec4b6" }}>{passed}</p>
              </div>
              <div style={{ width: 1, background: "#e8ecf4" }} />
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#8898b8", fontWeight: 600 }}>Failed</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#e53e3e" }}>{failed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: "20px 22px", boxShadow: "0 2px 12px rgba(67,97,238,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#4361ee" strokeWidth="1.8"/><circle cx="9" cy="7" r="4" stroke="#4361ee" strokeWidth="1.8"/></svg>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "#8898b8", fontWeight: 600 }}>Class Average</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#4361ee" }}>{classAvg}</p>
          </div>
        </div>
        <div style={{ background: "#e8faf9", borderRadius: 18, padding: "20px 22px", boxShadow: "0 2px 12px rgba(46,196,182,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#2ec4b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <p style={{ margin: 0, fontSize: 12, color: "#2ec4b6", fontWeight: 700 }}>Highest Marks</p>
          </div>
          <p style={{ margin: "0 0 2px", fontSize: 28, fontWeight: 800, color: "#2ec4b6" }}>{highestMark}</p>
          <p style={{ margin: 0, fontSize: 12.5, color: "#4a9e98", fontWeight: 600 }}>{topperStudent?.name}</p>
        </div>
        <div style={{ background: "#fff5f5", borderRadius: 18, padding: "20px 22px", boxShadow: "0 2px 12px rgba(229,62,62,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#e53e3e" strokeWidth="1.8"/><line x1="12" y1="8" x2="12" y2="12" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round"/></svg>
            <p style={{ margin: 0, fontSize: 12, color: "#e53e3e", fontWeight: 700 }}>Lowest Marks</p>
          </div>
          <p style={{ margin: "0 0 2px", fontSize: 28, fontWeight: 800, color: "#e53e3e" }}>{lowestMark}</p>
          <p style={{ margin: 0, fontSize: 12.5, color: "#c05454", fontWeight: 600 }}>{lowestStudent?.name}</p>
        </div>
        <div style={{ background: "#f0ecff", borderRadius: 18, padding: "20px 22px", boxShadow: "0 2px 12px rgba(123,97,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 21l4-7 4 7M12 3l-3 7h6L12 3z" stroke="#7b61ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
            <p style={{ margin: 0, fontSize: 12, color: "#7b61ff", fontWeight: 700 }}>Pass Percentage</p>
          </div>
          <p style={{ margin: "0 0 2px", fontSize: 28, fontWeight: 800, color: "#7b61ff" }}>{passPercent}%</p>
          <p style={{ margin: 0, fontSize: 12.5, color: "#7b61ff", fontWeight: 600 }}>{passed} of {students.length} students</p>
        </div>
      </div>

      {/* Results Table */}
      <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 20 }}>
        {/* Subject Tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {subjects.map((s, i) => (
              <button key={s.subjectId} className="subj-tab" onClick={() => setActiveSubject(i)}
                style={{ background: activeSubject === i ? s.color : "transparent", color: activeSubject === i ? "#fff" : s.color, boxShadow: activeSubject === i ? `0 4px 12px ${s.color}44` : "none", border: activeSubject === i ? "none" : `1.5px solid ${s.color}44` }}>
                {s.subjectName} ({s.maxMarks})
              </button>
            ))}
          </div>
          <button className="res-btn" style={{ background: "#f5f6fc", color: "#5a6783" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="6 9 6 2 18 2 18 9" stroke="#5a6783" strokeWidth="1.8"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="#5a6783" strokeWidth="1.8"/><rect x="6" y="14" width="12" height="8" stroke="#5a6783" strokeWidth="1.8"/></svg>
            Print
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f0f2fb" }}>
              {["#", "Admission No.", "Roll No.", "Student Name", "Marks Obtained", "Percentage", "Grade", "Result"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12.5, fontWeight: 700, color: "#8898b8", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageStudents.map((s, i) => {
              const markObtained = getSubjectMarks(s);
              const pct = ((markObtained / subjectMax) * 100).toFixed(2);
              const gradeInfo = getGrade(parseFloat(pct));
              const isPassed = parseFloat(pct) >= PASSING_PCT;
              return (
                <tr key={s.studentId} className="trow" style={{ borderBottom: "1px solid #f5f6fc" }}>
                  <td style={{ padding: "13px 14px", fontSize: 13.5, color: "#8898b8", fontWeight: 600 }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td style={{ padding: "13px 14px", fontSize: 13.5, color: "#4361ee", fontWeight: 700 }}>{s.studentId}</td>
                  <td style={{ padding: "13px 14px", fontSize: 13.5, color: "#5a6783", fontWeight: 600 }}>{s.rollNo}</td>
                  <td style={{ padding: "13px 14px", fontSize: 14, color: "#1a2744", fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: "13px 14px", fontSize: 14, color: "#1a2744", fontWeight: 700 }}>{markObtained}</td>
                  <td style={{ padding: "13px 14px", fontSize: 13.5, color: "#5a6783", fontWeight: 600 }}>{pct}%</td>
                  <td style={{ padding: "13px 14px" }}>
                    <span style={{ background: gradeInfo.bg, color: gradeInfo.color, fontWeight: 700, fontSize: 12.5, borderRadius: 8, padding: "4px 12px" }}>{gradeInfo.grade}</span>
                  </td>
                  <td style={{ padding: "13px 14px" }}>
                    <span style={{ background: isPassed ? "#e8faf9" : "#fff5f5", color: isPassed ? "#2ec4b6" : "#e53e3e", fontWeight: 700, fontSize: 12.5, borderRadius: 8, padding: "4px 12px" }}>
                      {isPassed ? "Passed" : "Failed"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 13, color: "#8898b8" }}>Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, students.length)} of {students.length} students</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
           {Array.from({ length: totalPages }, (_, i) => (

  <button
    key={i + 1} className={`page-btn${page === i + 1 ? " active" : ""}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Note */}
      <div style={{ background: "#fff8e6", border: "1.5px solid #ffe5a0", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <p style={{ margin: 0, fontSize: 13, color: "#7a5c00", fontWeight: 500 }}>
          <strong>Note:</strong> Results are calculated based on the marks entered. Please verify the marks before publishing final results.
        </p>
      </div>

      <p style={{ textAlign: "center", color: "#c0c8d8", fontSize: "12px", marginTop: "24px" }}>© 2024 Greenfield Primary School. All Rights Reserved.</p>
    </div>
  );
}
