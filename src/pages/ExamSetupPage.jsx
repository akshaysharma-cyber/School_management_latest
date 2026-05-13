import { useEffect, useState } from "react";
import axios from "axios";

const EXAM_TYPES = [
  "Unit Test",
  "Half Yearly",
  "Final Exam",
  "Mid Term",
  "Pre Board",
];

const ACADEMIC_YEARS = [
  "2024 - 2025",
  "2023 - 2024",
  "2022 - 2023",
];

const GRADE_SYSTEMS = [
  "CBSE (A1, A2, B1, B2, C1, C2, D)",
  "ICSE (A, B, C, D, E)",
  "Percentage Only",
  "GPA (4.0 Scale)",
];

const ALL_CLASSES = [
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
];

export default function ExamSetupPage({ onBack }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [classSubjectsMap, setClassSubjectsMap] = useState({});
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [examName, setExamName] = useState("");
  const [academicYear, setAcademicYear] = useState("2024 - 2025");
  const [examType, setExamType] = useState("Unit Test");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const [passingMarks, setPassingMarks] = useState("33");
  const [gradeSystem, setGradeSystem] = useState(GRADE_SYSTEMS[0]);
  const [totalMarks, setTotalMarks] = useState("100");

  const [publishDate, setPublishDate] = useState("");
  const [allowReExam, setAllowReExam] = useState(false);
  const [allowMarksEntry, setAllowMarksEntry] = useState(true);
  const [sendSMS, setSendSMS] = useState(false);

  const [saved, setSaved] = useState(false);

  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  const currentClass =
    selectedClasses.length > 0
      ? selectedClasses[0].replace("Class ", "")
      : "";

  const currentClassSubjects = classSubjectsMap[currentClass] || [];

  useEffect(() => {
    if (currentClass) {
      fetchSubjectsByClass(currentClass);
    }
  }, [currentClass]);

  const fetchSubjectsByClass = async (className) => {
    try {
      const res = await axios.get(
        "http://localhost:8089/api/subjects-by-class",
        {
          params: {
            schoolId: user.schoolId,
            className,
          },
        }
      );

      setClassSubjectsMap((prev) => ({
        ...prev,
        [className]: res.data || [],
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
    setSelectedClasses((prev) => {
      if (prev.includes(cls)) {
        return prev.filter((c) => c !== cls);
      }

      return [cls];
    });

    setSelectedSubjects([]);
  };

  const toggleSubject = (subjectName) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjectName)) {
        return prev.filter((s) => s !== subjectName);
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

  const handleSaveExam = async () => {
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

        allowReexam: allowReExam,
        allowMarksEntry,
        sendSms: sendSMS,

        subjects: selectedSubjects.map((subjectName) => ({
          subjectId: getSubjectId(subjectName),
          maxMarks: Number(totalMarks),
        })),
      };

      console.log("FINAL PAYLOAD", payload);

      const res = await axios.post(
        "http://localhost:8089/api/exams/create",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Exam Saved", res.data);

      setSaved(true);
    } catch (err) {
      console.error(
        "Save Exam Error",
        err.response?.data || err.message
      );
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

        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="setup-btn"
            onClick={onBack}
            style={{
              background: "#f1f1f1",
            }}
          >
            Back
          </button>

          <button
            className="setup-btn"
            onClick={handleSaveExam}
            style={{
              background: "#4361ee",
              color: "#fff",
            }}
          >
            {saved ? "Saved ✓" : "Save Exam"}
          </button>
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
            />
          </div>

          <div>
            <label className="setup-label">
              Academic Year
            </label>

            <select
              className="setup-select"
              value={academicYear}
              onChange={(e) =>
                setAcademicYear(e.target.value)
              }
            >
              {ACADEMIC_YEARS.map((y, index) => (
                <option
                  key={`year-${index}`}
                  value={y}
                >
                  {y}
                </option>
              ))}
            </select>
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

            <select
              className="setup-select"
              value={examType}
              onChange={(e) =>
                setExamType(e.target.value)
              }
            >
              {EXAM_TYPES.map((t, index) => (
                <option
                  key={`type-${index}`}
                  value={t}
                >
                  {t}
                </option>
              ))}
            </select>
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
              <div
                onClick={() => {
                  setShowClassDropdown(
                    !showClassDropdown
                  );

                  setShowSubjectDropdown(false);
                }}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  minHeight: 45,
                  padding: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  cursor: "pointer",
                }}
              >
                {selectedClasses.map((cls) => (
                  <span
                    key={cls}
                    className="tag-chip"
                  >
                    {cls}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleClass(cls);
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {showClassDropdown && (
                <div className="dropdown-list">
                  {ALL_CLASSES.map((cls) => (
                    <div
                      key={cls}
                      className="dropdown-item"
                      onClick={() =>
                        toggleClass(cls)
                      }
                    >
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(
                          cls
                        )}
                        readOnly
                      />

                      {cls}
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
              <div
                onClick={() => {
                  setShowSubjectDropdown(
                    !showSubjectDropdown
                  );

                  setShowClassDropdown(false);
                }}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  minHeight: 45,
                  padding: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  cursor: "pointer",
                }}
              >
                {selectedSubjects.map((s) => (
                  <span
                    key={s}
                    className="tag-chip"
                  >
                    {s}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubject(s);
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {showSubjectDropdown && (
                <div className="dropdown-list">
                  {currentClassSubjects.map((s) => (
                    <div
                      key={s.id}
                      className="dropdown-item"
                      onClick={() =>
                        toggleSubject(
                          s.subjectName
                        )
                      }
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(
                          s.subjectName
                        )}
                        readOnly
                      />

                      {s.subjectName}
                    </div>
                  ))}
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <div>
            <label className="setup-label">
              Publish Date
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

          <div>
            <label>
              <input
                type="checkbox"
                checked={allowReExam}
                onChange={(e) =>
                  setAllowReExam(
                    e.target.checked
                  )
                }
              />{" "}
              Allow Re-Exam
            </label>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={allowMarksEntry}
              onChange={(e) =>
                setAllowMarksEntry(
                  e.target.checked
                )
              }
            />{" "}
            Allow Marks Entry
          </label>

          <label>
            <input
              type="checkbox"
              checked={sendSMS}
              onChange={(e) =>
                setSendSMS(
                  e.target.checked
                )
              }
            />{" "}
            Send SMS
          </label>
        </div>
      </div>
    </div>
  );
}