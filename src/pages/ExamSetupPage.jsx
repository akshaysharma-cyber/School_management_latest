import { useEffect, useState } from "react";
import axios from "axios";
import { apiFetch } from "../utils/apiFetch";
import {
  validateExamName,
  validateAcademicYear,
  validateExamType,
  validateClass,
  validateSubjects,
  validatePassingPercentage,
  validateExamDates,
} from "../utils/validation";
const API_URL = import.meta.env.VITE_API_URL;

const EXAM_TYPES = [
  "Unit Test-1",
  "Unit Test-2",
  "Unit Test-3",
  "Half Yearly",
  "Final Exam",
  "Mid Term",
  "Pre Board",
];

const ACADEMIC_YEARS = [
  "2026 - 2027",
  "2027 - 2028",
  "2028 - 2029",
  "2029 - 2030",
];



const GRADE_SYSTEMS = [
  "CBSE (A1, A2, B1, B2, C1, C2, D)",
  "ICSE (A, B, C, D, E)",
  "Percentage Only",
  "GPA (4.0 Scale)",
];

const ALL_CLASSES = [
  "Nursery",
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
              "12"
];

export default function ExamSetupPage({ onBack }) {
  const [errors, setErrors] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const [academicYear, setAcademicYear] = useState("");
  const [
    showAcademicDropdown,
    setShowAcademicDropdown
  ] = useState(false);

  const [classSubjectsMap, setClassSubjectsMap] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState("");
  const [showExamTypeDropdown, setShowExamTypeDropdown] =
    useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [passingMarks, setPassingMarks] = useState("0");
  const [gradeSystem, setGradeSystem] = useState(GRADE_SYSTEMS[0]);
  const [totalMarks, setTotalMarks] = useState("0");
  const [publishDate, setPublishDate] = useState("");
  const [saved, setSaved] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const currentClass = selectedClass;
  const currentClassSubjects = classSubjectsMap[currentClass] || [];

  useEffect(() => {
    if (currentClass) {
      fetchSubjectsByClass(currentClass);
    }
  }, [currentClass]);

  const fetchSubjectsByClass = async (className) => {
  try {

    const res = await apiFetch(
      `${API_URL}/api/subjects-by-class?schoolId=${user.schoolId}&className=${className}`
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    console.log("Subjects API Response:", data);

    setClassSubjectsMap((prev) => ({
      ...prev,
      [className]: data || [],
    }));

  } catch (err) {

    console.error("Subject fetch failed", err);

    setClassSubjectsMap((prev) => ({
      ...prev,
      [className]: [],
    }));
  }
};

  const toggleClass = (cls) => {
    setSelectedClass(cls);

    setSelectedSubjects([]);

    setShowClassDropdown(false); // auto close dropdown
  };

  const toggleSubject = (subjectName) => {
    setSelectedSubjects((prev) => {

      if (prev.includes(subjectName)) {
        return prev.filter(
          (item) => item !== subjectName
        );
      }

      return [...prev, subjectName];
    });
  };

  const getSubjectId = (subjectName) => {
    const subjects = currentClassSubjects || [];

    const found = subjects.find(
      (s) => s.subjectName === subjectName
    );

    return found?.id;
  };


  const validateForm = () => {
    const newErrors = {};

    const examNameError =
      validateExamName(examName);

    if (examNameError)
      newErrors.examName = examNameError;

    const academicYearError =
      validateAcademicYear(academicYear);

    if (academicYearError)
      newErrors.academicYear = academicYearError;

    const examTypeError =
      validateExamType(examType);

    if (examTypeError)
      newErrors.examType = examTypeError;

    const classError =
      validateClass(selectedClass);

    if (classError)
      newErrors.className = classError;

    const subjectError =
      validateSubjects(selectedSubjects);

    if (subjectError)
      newErrors.subjects = subjectError;

    const passingError =
      validatePassingPercentage(passingMarks);

    if (passingError)
      newErrors.passingMarks = passingError;

    const dateError =
      validateExamDates(startDate, endDate);

    if (dateError)
      newErrors.dates = dateError;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveExam = async () => {

    if (!validateForm()) {
      return;
    }
    try {
      const payload = {
        schoolId: user.schoolId,
        userId: user.id,

        examName,
        examType,

        className: currentClass,

        academicYear,
        startDate,
        endDate,
        description,
        passingPercentage: Number(passingMarks),
        gradingSystem: gradeSystem,
        resultPublishDate: publishDate,
        subjects: selectedSubjects.map((subjectName) => ({
          subjectId: getSubjectId(subjectName),
          maxMarks: Number(totalMarks),
        })),
      };

      console.log("FINAL PAYLOAD", payload);

      const res = await apiFetch(
  `${API_URL}/api/exams/create`,
  {
    method: "POST",
    body: JSON.stringify(payload),
  }
);

const message = await res.text();

console.log("Exam Saved", message);

setSaved(true);

setTimeout(() => {
  setSaved(false);
}, 2000);

alert(message || "Exam created successfully");
    } catch (err) {
  console.error(err);
  alert("Failed to create exam");
}
  };

  return (
    <div style={{ padding: 20 }}>
      <style>{`
        .setup-card {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        }

        .setup-label {
          display: block;
          margin-bottom: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #666;
        }

        .setup-input,
        .setup-select {
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
        }

        .setup-input:focus,
        .setup-select:focus {
          border-color: #4361ee;
        }

        .setup-btn {
          border: none;
          border-radius: 10px;
          padding: 10px 18px;
          cursor: pointer;
          font-weight: 700;
        }

        .tag-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #eef2ff;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .tag-chip button {
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
        }

        .dropdown-list {
          position: absolute;
          top: calc(100% + 5px);
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 10px;
          z-index: 100;
          max-height: 220px;
          overflow-y: auto;
        }

        .dropdown-item {
          padding: 10px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dropdown-item:hover {
          background: #f5f7ff;
        }
      `}</style>

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Exam Setup</h2>

          <p style={{ marginTop: 5, color: "#777" }}>
            Create and configure exam
          </p>
        </div>


      </div>

      {/* BASIC INFO */}

      <div className="setup-card">
        <h3>Basic Information</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <label className="setup-label">
              Exam Name
            </label>

            <input
              className="setup-input"
              value={examName}
              onChange={(e) =>
                setExamName(e.target.value)
              }
              style={{
                border: errors.examName
                  ? "1px solid red"
                  : "1px solid #ddd"
              }}
            />

            {errors.examName && (
              <div
                style={{
                  color: "red",
                  fontSize: 12,
                  marginTop: 4
                }}
              >
                {errors.examName}
              </div>
            )}
          </div>

          <div>
            <label className="setup-label">
              Academic Year
            </label>

            <div
              style={{
                position: "relative"
              }}
            >

              <div
                onClick={() =>
                  setShowAcademicDropdown(
                    !showAcademicDropdown
                  )
                }
                style={{
                  border: errors.academicYear
                    ? "1px solid red"
                    : "1px solid #ddd",
                  borderRadius: 10,
                  height: 48,
                  padding: "0 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  background: "#fff"
                }}
              >
                <span
                  style={{
                    color: academicYear
                      ? "#111"
                      : "#94a3b8"
                  }}
                >
                  {academicYear ||
                    "Select Academic Year"}
                </span>

                <span>▼</span>
              </div>

              {errors.academicYear && (
                <div
                  style={{
                    color: "red",
                    fontSize: 12,
                    marginTop: 4
                  }}
                >
                  {errors.academicYear}
                </div>
              )}

              {showAcademicDropdown && (

                <div className="dropdown-list">

                  {[
                    "2026 - 2027",
                    "2027 - 2028",
                    "2028 - 2029",
                    "2029 - 2030",
                  ].map((year) => (

                    <div
                      key={year}
                      className="dropdown-item"
                      onClick={() => {
                        setAcademicYear(year);

                        setShowAcademicDropdown(
                          false
                        );
                      }}
                    >
                      {year}
                    </div>

                  ))}

                </div>

              )}

            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
          }}
        >
          <div>
            <label className="setup-label">
              Exam Type
            </label>

            <div style={{ position: "relative" }}>

              <div
                onClick={() =>
                  setShowExamTypeDropdown(
                    !showExamTypeDropdown
                  )
                }
                style={{
                  border: errors.examType
                    ? "1px solid red"
                    : "1px solid #ddd",
                  borderRadius: 10,
                  height: 48,
                  padding: "0 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  background: "#fff"
                }}
              >
                <span
                  style={{
                    color: examType
                      ? "#111"
                      : "#94a3b8"
                  }}
                >
                  {examType ||
                    "Select Exam Type"}
                </span>

                <span>▼</span>
              </div>

              {errors.examType && (
                <div
                  style={{
                    color: "red",
                    fontSize: 12,
                    marginTop: 4
                  }}
                >
                  {errors.examType}
                </div>
              )}

              {showExamTypeDropdown && (

                <div className="dropdown-list">

                  {EXAM_TYPES.map((type) => (

                    <div
                      key={type}
                      className="dropdown-item"
                      onClick={() => {

                        setExamType(type);

                        setShowExamTypeDropdown(
                          false
                        );

                      }}
                    >

                      {type}

                    </div>

                  ))}

                </div>

              )}

            </div>
          </div>

          <div>
            <label className="setup-label">
              Start Date
            </label>

            <input
              type="date"
              className="setup-input"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
            />
            {errors.dates && (
              <div
                style={{
                  color: "red",
                  fontSize: 12,
                  marginTop: 4
                }}
              >
                {errors.dates}
              </div>
            )}

          </div>

          <div>
            <label className="setup-label">
              End Date
            </label>

            <input
              type="date"
              className="setup-input"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
            />
            {errors.dates && (
              <div
                style={{
                  color: "red",
                  fontSize: 12,
                  marginTop: 4
                }}
              >
                {errors.dates}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* CLASS & SUBJECT */}

      <div className="setup-card">
        <h3>Select Class & Subjects</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >



          {/* CLASS */}

          <div>
            <label className="setup-label">
              Class
            </label>

            <div style={{ position: "relative" }}>

              {/* Selected Box */}
              <div
                onClick={() => {
                  setShowClassDropdown(!showClassDropdown);
                  setShowSubjectDropdown(false);
                }}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  height: 48,
                  padding: "0 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  background: "#fff"
                }}
              >

                <div
                  style={{
                    flex: 1,
                    color: selectedClass ? "#111827" : "#94a3b8",
                    fontSize: 14,
                    fontWeight: selectedClass ? 600 : 400
                  }}
                >
                  {selectedClass === ""
                    ? "Select Class"
                    : ["Nursery", "LKG", "UKG"].includes(selectedClass)
                      ? selectedClass
                      : `Class ${selectedClass}`}
                </div>

                <span>▼</span>

              </div>

              {errors.className && (
                <div
                  style={{
                    color: "red",
                    fontSize: 12,
                    marginTop: 4
                  }}
                >
                  {errors.className}
                </div>
              )}

              {/* Dropdown */}
              {showClassDropdown && (
                <div className="dropdown-list">

                  {ALL_CLASSES.map((cls) => (
                    <div
                      key={cls}
                      className="dropdown-item"
                      onClick={() => toggleClass(cls)}
                    >
                      {["Nursery", "LKG", "UKG"].includes(cls)
                        ? cls
                        : `Class ${cls}`}
                    </div>
                  ))}

                </div>
              )}

            </div>
          </div>

          {/* SUBJECT */}

          <div>
            <label className="setup-label">
              Subjects
            </label>

            <div style={{ position: "relative" }}>

              {/* Subject Select Box */}
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  minHeight: 48,
                  padding: "8px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#fff",
                  cursor: "pointer"
                }}
                onClick={() => {
                  if (!selectedClass) return;

                  setShowSubjectDropdown(
                    !showSubjectDropdown
                  );

                  setShowClassDropdown(false);
                }}
              >

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    flex: 1
                  }}
                >

                  {selectedSubjects.length === 0 ? (
                    <span
                      style={{
                        color: "#94a3b8"
                      }}
                    >
                      Select Subject
                    </span>
                  ) : (
                    selectedSubjects.map((s) => (
                      <span
                        key={s}
                        className="tag-chip"
                      >
                        {s}

                        <span
                          onClick={(e) => {
                            e.stopPropagation();

                            toggleSubject(s);
                          }}
                          style={{
                            cursor: "pointer",
                            marginLeft: 6
                          }}
                        >
                          ×
                        </span>
                      </span>
                    ))
                  )}

                </div>

                <span>
                  ▼
                </span>

              </div>

              {/* Subject Validation Error */}
              {errors.subjects && (
                <div
                  style={{
                    color: "red",
                    fontSize: 12,
                    marginTop: 4
                  }}
                >
                  {errors.subjects}
                </div>
              )}

              {/* Dropdown */}
              {/* Dropdown */}
              {showSubjectDropdown && (
                <div
                  className="dropdown-list"
                  style={{
                    zIndex: 9999
                  }}
                >

                  {currentClassSubjects.length > 0 ? (

                    currentClassSubjects.map((subject) => (

                      <div
                        key={subject.id}
                        className="dropdown-item"
                        onClick={() =>
                          toggleSubject(
                            subject.subjectName
                          )
                        }
                        style={{
                          justifyContent:
                            "space-between"
                        }}
                      >

                        <span>
                          {subject.subjectName}
                        </span>

                        <span>
                          {selectedSubjects.includes(
                            subject.subjectName
                          )
                            ? "✓"
                            : ""}
                        </span>

                      </div>

                    ))

                  ) : (

                    <div
                      className="dropdown-item"
                      style={{
                        color: "#999"
                      }}
                    >
                      No Subjects Found
                    </div>

                  )}

                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* GRADING */}

      <div className="setup-card">
        <h3>Grading & Marks</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <label className="setup-label">
              Passing %
            </label>

            <input
              className="setup-input"
              type="number"
              value={passingMarks}
              onChange={(e) =>
                setPassingMarks(e.target.value)
              }
            />

            {errors.passingMarks && (
              <div
                style={{
                  color: "red",
                  fontSize: 12,
                  marginTop: 4
                }}
              >
                {errors.passingMarks}
              </div>
            )}
          </div>

          <div>
            <label className="setup-label">
              Grade System
            </label>

            <select
              className="setup-select"
              value={gradeSystem}
              onChange={(e) =>
                setGradeSystem(e.target.value)
              }
            >
              {GRADE_SYSTEMS.map((g, index) => (
                <option
                  key={`grade-${index}`}
                  value={g}
                >
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="setup-label">
              Total Marks
            </label>

            <input
              className="setup-input"
              type="number"
              value={totalMarks}
              onChange={(e) =>
                setTotalMarks(e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* ADDITIONAL */}

      <div className="setup-card">
        <h3>Additional Settings</h3>

        <div>
          <label className="setup-label">
            Result Publish Date
          </label>

          <input
            type="date"
            className="setup-input"
            value={publishDate}
            onChange={(e) =>
              setPublishDate(e.target.value)
            }
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button
  className="setup-btn"
  onClick={handleSaveExam}
  style={{
    background: saved ? "#16a34a" : "#4361ee",
    color: "#fff",
  }}
>
  {saved ? "Saved ✓" : "Save Exam"}
</button>
        <button
          className="setup-btn"
          onClick={onBack}
          style={{
            background: "#f1f1f1",
          }}
        >
          Back
        </button>
      </div>

    </div>
  );
}