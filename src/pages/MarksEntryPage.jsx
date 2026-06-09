import { useState, useEffect } from "react";
import { apiFetch } from "../utils/apiFetch";


const CLASSES = ["Nursery",
  "LKG",
  "UKG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12"];

const ACADEMIC_YEARS = [
  "2026-2027",
  "2027-2028",
  "2028-2029",
  "2029-2030",
];



const PAGE_SIZE = 10;

export default function MarksEntryPage({ onBack }) {
  
  const [examSetupMissing, setExamSetupMissing] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState("");
  const [examTypes, setExamTypes] = useState([]);
  const [selectedExamType, setSelectedExamType] =
    useState("");

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);


  const [selectedClass, setSelectedClass] = useState("");
  const [activeSubject, setActiveSubject] = useState(0);
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState(false);
  const [marks, setMarks] = useState({});

  const handleMark = (studentId, subjectId, value) => {
    const num = Math.max(0, parseInt(value) || 0);

    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subjectId]: num
      }
    }));
  };

  const pageStudents = students.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalPages = Math.ceil(students.length / PAGE_SIZE);


  const currentSubjectId =
  subjects[activeSubject]?.subjectId;

const subjMarks = students.map(
  s => Number(
    marks[s.id]?.[currentSubjectId] || 0
  )
);

const enteredMarks = subjMarks.filter(
  m => m > 0
);

  const avg =
  enteredMarks.length > 0
    ? (
        enteredMarks.reduce(
          (a, b) => a + b,
          0
        ) / enteredMarks.length
      ).toFixed(2)
    : 0;

  const highest =
    subjMarks.length > 0
      ? Math.max(...subjMarks)
      : 0;

  

const lowest =
  enteredMarks.length > 0
    ? Math.min(...enteredMarks)
    : 0;

      const totalMarks =
  subjects.length > 0
    ? subjects[0].totalMarks
    : 0;



  useEffect(() => {

    if (
      !selectedClass ||
      !selectedAcademicYear ||
      !selectedExamType
    ) {
      return;
    }

    const fetchSubjects = async () => {

      try {

        const user = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        const schoolId = user?.schoolId;

        const res = await apiFetch(
          `http://localhost:8089/api/exams/subjects?schoolId=${schoolId}&academicYear=${selectedAcademicYear}&examType=${encodeURIComponent(selectedExamType)}&className=${selectedClass}`
        );

        if (!res.ok) {

          const error = await res.json();

          alert(
            error.message ||
            "Exam is not setup for selected Class / Academic Year / Exam Type"
          );

          setSubjects([]);
          setExamSetupMissing(true);

          return;
        }

        const data = await res.json();

        setSubjects(data || []);
        setExamSetupMissing(false);

        setActiveSubject(0);

      } catch (err) {

        console.error(err);

        setSubjects([]);
      }
    };

    fetchSubjects();

  }, [
    selectedClass,
    selectedExamType,
    selectedAcademicYear
  ]);



  useEffect(() => {

    if (!selectedClass) return;

    const fetchStudents = async () => {

      try {

        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const schoolId = user?.schoolId;

        console.log("selectedClass =", selectedClass);
        console.log("schoolId =", schoolId);

        const res = await apiFetch(
          `http://localhost:8089/api/students/class/${encodeURIComponent(selectedClass)}?schoolId=${schoolId}`
        );

        console.log("status =", res.status);

        const data = await res.json();

        console.log("students data =", data);

        const studentList = Array.isArray(data) ? data : [];

        setStudents(studentList);

        setPage(1);

        const initMarks = {};

        studentList.forEach(s => {
          initMarks[s.id] = {};
        });

        setMarks(initMarks);

      } catch (err) {

        console.error("Error fetching students:", err);

        setStudents([]);
      }
    };

    fetchStudents();

  }, [selectedClass]);



  useEffect(() => {

    if (!selectedAcademicYear) return;

    const fetchExamTypes = async () => {

      try {

        const user = JSON.parse(
          localStorage.getItem("user")
        );

        const res = await apiFetch(
          `http://localhost:8089/api/exams/types?schoolId=${user.schoolId}&academicYear=${selectedAcademicYear}`
        );

        if (!res.ok) {
          console.error("API Error:", res.status);
          return;
        }

        const data = await res.json();
        setExamTypes(data || []);

        setSelectedExamType("");

      } catch (err) {

        console.error(err);
      }
    };

    fetchExamTypes();

  }, [selectedAcademicYear]);



  const saveMarks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const activeSub = subjects[activeSubject];

      if (!activeSub) {
        alert("No subject available");
        return;
      }

      const payload = {
        schoolId: user.schoolId,
        examId: activeSub.examId,
        className: selectedClass,
        subjectId: activeSub.subjectId,

        marks: students.map((s) => ({
          studentId: s.id,
          marksObtained:
            marks[s.id]?.[activeSub.subjectId] || 0,
        })),
      };

      console.log("SAVE PAYLOAD =", payload);
      console.log("ACTIVE SUBJECT =", activeSub);
      console.log("PAYLOAD =", payload);
      const res = await apiFetch(
        "http://localhost:8089/api/marks/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.text();

      console.log(data);

      if (res.ok) {
        alert("Marks saved successfully");
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
        }, 3000);
      } else {
        alert("Failed to save marks");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving marks");
    }
  };

  useEffect(() => {

  if (
    subjects.length === 0 ||
    !subjects[activeSubject]
  ) {
    return;
  }

  const loadSavedMarks = async () => {

    try {

      const user =
        JSON.parse(localStorage.getItem("user") || "{}");

      const activeSub = subjects[activeSubject];

      const res = await apiFetch(
  `http://localhost:8089/api/marks/saved?schoolId=${user.schoolId}&examId=${activeSub.examId}&subjectId=${activeSub.subjectId}&className=${selectedClass}`
);

      if (!res.ok) return;

      const data = await res.json();

      const loadedMarks = {};

      data.forEach(item => {

        loadedMarks[item.studentId] = {
          [activeSub.subjectId]:
            item.marksObtained
        };
      });

      setMarks(prev => ({
        ...prev,
        ...loadedMarks
      }));

    } catch (err) {

      console.error(err);
    }
  };

  loadSavedMarks();

}, [subjects, activeSubject]);

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

      </div>

      {/* Filters + Stats */}
      <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 700,
                color: "#8898b8",
                marginBottom: 6
              }}
            >
              Academic Year
            </label>

            <select
              className="me-select"
              value={selectedAcademicYear}
              onChange={(e) => {
                setSelectedAcademicYear(e.target.value);
                setExamSetupMissing(false);
              }}
            >
              <option value="">Select Academic Year</option>

              {ACADEMIC_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 700,
                color: "#8898b8",
                marginBottom: 6
              }}
            >
              Exam Type
            </label>

            <select
              className="me-select"
              value={selectedExamType}
              onChange={(e) => {
                setSelectedExamType(e.target.value);
                setExamSetupMissing(false);
              }}
            >
              <option value="">
                Select Exam Type
              </option>

              {examTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8898b8", marginBottom: 6 }}>Select Class</label>
            <select
              className="me-select"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setExamSetupMissing(false);
              }}
            >
              <option value="">Select Class</option>

              {CLASSES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
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
                <p style={{ margin: 0, fontSize: 12, color: "#8898b8", fontWeight: 600 }}>Subjects</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#4361ee" }}>{subjects.length}</p>
              </div>
              <div style={{ width: 1, background: "#e8ecf4" }} />
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#8898b8", fontWeight: 600 }}>Total Marks</p>
                <p
  style={{
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    color: "#4361ee"
  }}
>
  {totalMarks}
</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marks Table Card */}
      <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 20 }}>
        {/* Subject Tabs + Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 10
          }}
        >
          {!examSetupMissing && subjects.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {subjects.map((s, i) => (
                <button
                  key={s.subjectId}
                  className="subj-tab"
                  onClick={() => setActiveSubject(i)}
                  style={{
                    background: activeSubject === i ? "#4361ee" : "#f5f6fc",
                    color: activeSubject === i ? "#fff" : "#1a2744",
                    border:
                      activeSubject === i
                        ? "1.5px solid #4361ee"
                        : "1.5px solid #e8ecf4",
                  }}
                >
                  {s.name} ({s.marks})
                </button>
              ))}
            </div>
          )}

        </div>



        {/* Table */}
        {examSetupMissing ? (

          <div
            style={{
              textAlign: "center",
              padding: "50px",
              background: "#fff7ed",
              border: "1px solid #fdba74",
              borderRadius: "12px",
              color: "#c2410c",
              fontWeight: "700",
              fontSize: "15px"
            }}
          >
            Exam is not setup for this Class, Academic Year and Exam Type.
            <br />
            Please create exam setup first.
          </div>

        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0f2fb" }}>
                <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 12.5, fontWeight: 700, color: "#8898b8" }}>#</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 12.5, fontWeight: 700, color: "#8898b8" }}>Admission No.</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 12.5, fontWeight: 700, color: "#8898b8" }}>Roll No.</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 12.5, fontWeight: 700, color: "#8898b8" }}>Student Name</th>
                <th style={{ padding: "10px 14px", textAlign: "center", fontSize: 12.5, fontWeight: 700, color: "#8898b8" }}>Marks Obtained (out of {subjects[activeSubject]?.marks || 0})</th>
              </tr>
            </thead>
            <tbody>
              {pageStudents.length > 0 ? (

                pageStudents.map((s, i) => (

                  <tr
                    key={s.id}
                    className="trow"
                    style={{ borderBottom: "1px solid #f5f6fc" }}
                  >

                    <td
                      style={{
                        padding: "12px 12px",
                        fontSize: 13.5,
                        color: "#8898b8",
                        fontWeight: 600
                      }}
                    >
                      {(page - 1) * PAGE_SIZE + i + 1}
                    </td>

                    <td
                      style={{
                        padding: "12px 14px",
                        fontSize: 13.5,
                        color: "#4361ee",
                        fontWeight: 700
                      }}
                    >
                      {s.admissionNo}
                    </td>

                    <td
                      style={{
                        padding: "12px 14px",
                        fontSize: 13.5,
                        color: "#5a6783",
                        fontWeight: 600
                      }}
                    >
                      {s.id}
                    </td>

                    <td
                      style={{
                        padding: "12px 14px",
                        fontSize: 14,
                        color: "#1a2744",
                        fontWeight: 600
                      }}
                    >
                      {s.studentName}
                    </td>

                    <td style={{ padding: "8px 40px" }}>

                      <input
                        className="marks-input"
                        type="number"
                        value={
                          marks[s.id]?.[subjects[activeSubject]?.subjectId] ?? ""
                        }
                        onChange={(e) =>
                          handleMark(
                            s.id,
                            subjects[activeSubject]?.subjectId,
                            e.target.value
                          )
                        }
                      />

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#8898b8",
                      fontWeight: 600
                    }}
                  >
                    No students found
                  </td>
                </tr>

              )}
            </tbody>
          </table>
        )}

        {/* Pagination + Stats */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#8898b8" }}>Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, students.length)} of {students.length} students</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} className={`page-btn${page === i + 1 ? " active" : ""}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
          <div style={{ background: "#f0f4ff", borderRadius: 12, padding: "10px 16px", display: "flex", gap: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#4361ee" }}>Subject Average: <strong>{avg}</strong></span>
            <span style={{ fontSize: 13, color: "#5a6783" }}>Highest: <strong style={{ color: "#2ec4b6" }}>{highest}</strong></span>
            <span style={{ fontSize: 13, color: "#5a6783" }}>Lowest: <strong style={{ color: "#e53e3e" }}>{lowest}</strong></span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          className="me-btn"
          onClick={saveMarks}
          disabled={examSetupMissing || subjects.length === 0} style={{
            background: "#4361ee",
            color: "#fff",
            padding: "9px 18px",
            opacity:
              examSetupMissing || subjects.length === 0
                ? 0.5
                : 1
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="#fff" strokeWidth="1.8" /><polyline points="17 21 17 13 7 13 7 21" stroke="#fff" strokeWidth="1.8" /><polyline points="7 3 7 8 15 8" stroke="#fff" strokeWidth="1.8" /></svg>
          {saved ? "✓ Marks Saved" : "Save Marks"}
        </button>
        <button className="me-btn" onClick={onBack} style={{ background: "#f5f6fc", color: "#5a6783", padding: "9px 18px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5" stroke="#5a6783" strokeWidth="1.8" strokeLinecap="round" /><path d="M12 19l-7-7 7-7" stroke="#5a6783" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Back to Examinations
        </button>
      </div>

      <p style={{ textAlign: "center", color: "#c0c8d8", fontSize: "12px", marginTop: "24px" }}>© 2024 Greenfield Primary School. All Rights Reserved.</p>
    </div>
  );
}
