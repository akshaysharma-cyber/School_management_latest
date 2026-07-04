import { useState, useEffect } from "react";
import { apiFetch } from "../utils/apiFetch";
const API_URL = import.meta.env.VITE_API_URL;

const RECENT_RESULTS = [
  { name: "Unit Test - 1", classVal: "Class 5", students: 32, avg: "78.6%", avgColor: "#2ec4b6", topper: "Priya Sharma (89.0%)", publishedOn: "5 June 2024\n10:30 AM", smsStatus: "SMS Sent", smsColor: "#2ec4b6", smsBg: "#e8faf9" },
  { name: "Final Exam 2023-24", classVal: "Class 4", students: 28, avg: "82.3%", avgColor: "#4361ee", topper: "Aman Singh (93.5%)", publishedOn: "28 March 2024\n02:15 PM", smsStatus: "Not Sent", smsColor: "#8898b8", smsBg: "#f5f6fc" },
  { name: "Half Yearly Exam", classVal: "Class 3", students: 30, avg: "76.9%", avgColor: "#f4a261", topper: "Ravi Kumar (88.0%)", publishedOn: "15 October 2023\n11:45 AM", smsStatus: "SMS Sent", smsColor: "#2ec4b6", smsBg: "#e8faf9" },
];

const EXAMS = ["Unit Test - 1 (2024-25)", "Half Yearly (2024-25)", "Final Exam (2024-25)"];
const CLASSES = ["Class 3", "Class 4", "Class 5"];
const SECTIONS = ["A", "B", "C"];

const STUDENTS = [
  { id: "GPS001", name: "Ravi Kumar", roll: "01", math: 78, english: 65, science: 80 },
  { id: "GPS002", name: "Aman Singh", roll: "02", math: 88, english: 70, science: 75 },
  { id: "GPS003", name: "Priya Sharma", roll: "03", math: 92, english: 85, science: 90 },
  { id: "GPS004", name: "Neha Patel", roll: "04", math: 65, english: 60, science: 70 },
  { id: "GPS005", name: "Arjun Verma", roll: "05", math: 76, english: 72, science: 68 },
];

const ACADEMIC_YEARS = [
  "2026-2027",
  "2027-2028",
  "2028-2029",
  "2029-2030"
];

const CURRENT_ACADEMIC_YEAR = ACADEMIC_YEARS[0];

export default function ExaminationsPage({ onNavigate }) {
  const [recentResults, setRecentResults] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    upcomingExams: 0,
    ongoingExam: 0,
    students: 0,
    averageResult: 0,
  });
  const [selectedExam, setSelectedExam] = useState(EXAMS[0]);
  const [selectedClass, setSelectedClass] = useState(CLASSES[2]);
  const [selectedSection, setSelectedSection] = useState(SECTIONS[0]);
  const [marks, setMarks] = useState(
    STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: { math: s.math, english: s.english, science: s.science } }), {})
  );
  const [smsSentAll, setSmsSentAll] = useState(true);
  const [smsFailed, setSmsFailed] = useState(false);
  const [smsTopper, setSmsTopper] = useState(false);
  const [saved, setSaved] = useState(false);
  const [published, setPublished] = useState(false);

  const handleMarkChange = (id, subj, val) => {
    const num = Math.min(100, Math.max(0, parseInt(val) || 0));
    setMarks(prev => ({ ...prev, [id]: { ...prev[id], [subj]: num } }));
  };

  const getTotal = (id) => (marks[id]?.math || 0) + (marks[id]?.english || 0) + (marks[id]?.science || 0);

  useEffect(() => {

    fetchDashboardStats();

    fetchRecentResults();

  }, []);

  const fetchDashboardStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await apiFetch(
        `${API_URL}/api/exams/dashboard-stat?schoolId=${user.schoolId}`
      );

      const data = await res.json();

      console.log("Dashboard =", data);

      setDashboardStats({
        upcomingExams: data.upcomingExams ?? 0,

        // FIXED
        ongoingExam: data.ongoingExams ?? 0,

        // FIXED
        students: data.totalStudents ?? 0,

        // FIXED
        averageResult: data.averageLastResult ?? 0,
      });

    } catch (err) {
      console.error("Dashboard Error", err);
    }
  };

  const fetchRecentResults = async () => {
    try {
      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      const academicYear =
  localStorage.getItem("academicYear");

const res = await apiFetch(
  `${API_URL}/api/exams/recent-results?schoolId=${user.schoolId}&academicYear=${CURRENT_ACADEMIC_YEAR}`
);

      const data =
        await res.json();

      console.log(
        "Recent Results =",
        data
      );

      setRecentResults(
        data || []
      );

    } catch (err) {

      console.error(
        "Recent Results Error",
        err
      );

      setRecentResults([]);

    }
  };

  return (
    <div>
      <style>{`
        .exam-btn { border:none; border-radius:12px; padding:10px 18px; font-size:13.5px; font-weight:700; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:7px; transition:all 0.15s; }
        .exam-btn:hover { transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,0.12); }
        .exam-stat-card { background:#fff; border-radius:18px; padding:22px 24px; box-shadow:0 2px 12px rgba(67,97,238,0.06); flex:1; min-width:0; }
        .exam-select { border:1.5px solid #e8ecf4; border-radius:10px; padding:8px 32px 8px 12px; font-size:13.5px; font-weight:600; color:#1a2744; font-family:inherit; appearance:none; background:#fff url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238898b8' strokeWidth='1.5' strokeLinecap='round'/%3E%3C/svg%3E") no-repeat right 12px center; cursor:pointer; outline:none; }
        .exam-select:focus { border-color:#4361ee; }
        .marks-input { border:1.5px solid #e8ecf4; border-radius:8px; padding:7px 10px; font-size:14px; font-weight:600; color:#1a2744; font-family:inherit; width:80px; text-align:center; outline:none; transition:border 0.15s; }
        .marks-input:focus { border-color:#4361ee; }
        .sms-check { width:16px; height:16px; accent-color:#4361ee; cursor:pointer; }
        .result-row:hover { background:#f8f9ff; }
        .breadcrumb-link { color:#8898b8; font-size:13px; font-weight:500; cursor:pointer; }
        .breadcrumb-link:hover { color:#4361ee; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
        <span className="breadcrumb-link">Dashboard</span>
        <span style={{ color: "#c0c8d8", fontSize: 13 }}>/</span>
        <span style={{ color: "#1a2744", fontSize: 13, fontWeight: 600 }}>Examinations</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#1a2744" }}>Examinations</h2>
          <p style={{ margin: 0, color: "#8898b8", fontSize: 13.5 }}>Manage exams, enter marks and view results</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="exam-btn" onClick={() => onNavigate("setup")} style={{ background: "#f0f4ff", color: "#4361ee" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" /><line x1="5" y1="12" x2="19" y2="12" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" /></svg>
            Add Exam
          </button>
          <button className="exam-btn" onClick={() => onNavigate("marks")} style={{ background: "#f0ecff", color: "#7b61ff" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="#7b61ff" strokeWidth="1.8" strokeLinecap="round" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#7b61ff" strokeWidth="1.8" strokeLinejoin="round" /></svg>
            Enter Marks
          </button>
          <button className="exam-btn" onClick={() => onNavigate("results")} style={{ background: "#fff4eb", color: "#f4a261" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 20V10" stroke="#f4a261" strokeWidth="1.8" strokeLinecap="round" /><path d="M12 20V4" stroke="#f4a261" strokeWidth="1.8" strokeLinecap="round" /><path d="M6 20v-6" stroke="#f4a261" strokeWidth="1.8" strokeLinecap="round" /></svg>
            View Results
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {[
          {
            icon: "📅",
            val: dashboardStats.upcomingExams,
            label: "Upcoming Exams",
            bg: "#f0f4ff",
            iconBg: "#dde5ff",
          },
          {
            icon: "✅",
            val: dashboardStats.ongoingExam,
            label: "Ongoing Exam",
            bg: "#e8faf9",
            iconBg: "#c3f0eb",
          },
          {
            icon: "👥",
            val: dashboardStats.students,
            label: "Students",
            bg: "#f0ecff",
            iconBg: "#ddd6fe",
          },
          {
            icon: "📊",
            val: `${dashboardStats.averageResult}%`,
            label: "Average Last Result",
            bg: "#fff4eb",
            iconBg: "#ffe5c8",
            isPercent: true,
          },
        ].map((c, i) => (
          <div
            key={i}
            className="exam-stat-card"
            style={{ background: c.bg }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: c.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                marginBottom: 12,
              }}
            >
              {c.icon}
            </div>

            <p
              style={{
                margin: "0 0 3px",
                fontSize: c.isPercent ? 26 : 30,
                fontWeight: 800,
                color: "#1a2744",
              }}
            >
              {c.val}
            </p>

            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#8898b8",
              }}
            >
              {c.label}
            </p>
          </div>
        ))}
      </div>






      {/* Recent Results */}


      <div style={{ background: "#fff", borderRadius: 20, padding: 28, marginBottom: 24, boxShadow: "0 2px 12px rgba(67,97,238,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1a2744" }}>Recent Results</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0f2fb" }}>
                {["Exam Name", "Class", "Students", "Average %", "Topper", "Published On"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12.5, fontWeight: 700, color: "#8898b8", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {
                recentResults.length > 0
                  ?

                  recentResults.map((r, i) => (

                    <tr
                      key={i}
                      className="result-row"
                      style={{
                        borderBottom:
                          "1px solid #f5f6fc"
                      }}
                    >

                      <td
                        style={{
                          padding: "14px"
                        }}
                      >
                        {r.examType}
                      </td>

                      <td
                        style={{
                          padding: "14px"
                        }}
                      >
                        Class {r.className}
                      </td>

                      <td
                        style={{
                          padding: "14px"
                        }}
                      >
                        {r.students}
                      </td>

                      <td
                        style={{
                          padding: "14px"
                        }}
                      >

                        <span
                          style={{
                            background:
                              "#e8faf9",

                            color:
                              "#2ec4b6",

                            padding:
                              "4px 10px",

                            borderRadius:
                              8,

                            fontWeight:
                              700
                          }}
                        >

                          {Number(
                            r.average
                          ).toFixed(1)}%

                        </span>

                      </td>

                      <td
                        style={{
                          padding: "14px"
                        }}
                      >

                        {r.topperName}

                        {" "}

                        (
                        {Number(
                          r.topperPercentage
                        ).toFixed(1)}%)

                      </td>

                      <td
                        style={{
                          padding: "14px"
                        }}
                      >

                        {r.publishedOn}

                      </td>

                    </tr>

                  ))

                  :

                  <tr>

                    <td
                      colSpan="8"
                      style={{
                        padding:
                          30,
                        textAlign:
                          "center",
                        color:
                          "#8898b8"
                      }}
                    >

                      No Results Found

                    </td>

                  </tr>

              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Send SMS Section */}
      <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#e8faf9", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#2ec4b6" strokeWidth="1.8" strokeLinejoin="round" /></svg>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1a2744" }}>Send Result SMS to Parents</h3>
            <p style={{ margin: 0, fontSize: 12.5, color: "#8898b8" }}>Notify parents about their child's results via SMS</p>
          </div>
        </div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div style={{ background: "#f8faff", border: "1.5px solid #e8ecf4", borderRadius: 12, padding: "14px 18px", maxWidth: 340 }}>
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "#4361ee" }}>SMS Preview:</p>
           
          </div>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 600, color: "#1a2744" }}>
              <input type="checkbox" className="sms-check" checked={smsSentAll} onChange={e => setSmsSentAll(e.target.checked)} />
              Send SMS to All Students (32)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 600, color: "#1a2744" }}>
              <input type="checkbox" className="sms-check" checked={smsFailed} onChange={e => setSmsFailed(e.target.checked)} />
              Send Only Failed Students
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, cursor: "pointer", fontSize: 13.5, fontWeight: 600, color: "#1a2744" }}>
              <input type="checkbox" className="sms-check" checked={smsTopper} onChange={e => setSmsTopper(e.target.checked)} />
              Send Topper Information Too
            </label>
            <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "#8898b8" }}>
              Total SMS: <strong style={{ color: "#1a2744" }}>32</strong> &nbsp; Estimated Cost: <strong style={{ color: "#4361ee" }}>₹6.40</strong>
            </p>
            <button className="exam-btn" style={{ background: "#2ec4b6", color: "#fff", boxShadow: "0 4px 12px rgba(46,196,182,0.3)", width: "100%", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /><path d="M22 2L15 22 11 13 2 9l20-7z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" /></svg>
              Send SMS Now
            </button>
          </div>
        </div>
      </div>

      <p style={{ textAlign: "center", color: "#c0c8d8", fontSize: "12px", marginTop: "28px" }}>© 2024 Greenfield Primary School. All Rights Reserved.</p>
    </div>
  );
}
