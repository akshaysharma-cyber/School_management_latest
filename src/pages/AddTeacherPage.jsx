import { useState, useEffect } from "react";
import { apiFetch } from "../utils/apiFetch";
import { validateMobile } from "../utils/validation";
const API_URL = import.meta.env.VITE_API_URL;
export default function AddTeacherPage({ onBack }) {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", dob: "", gender: "", address: "",
    employeeId: "", qualification: "", subject: "", joiningDate: "", password: "",
    sendCredentials: true
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showTeacherList, setShowTeacherList] = useState(false);

  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const teachersPerPage = 5;

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter valid email";
    const mobileError = validateMobile(form.phone);

    if (mobileError)
      e.phone = mobileError;
    if (!form.employeeId.trim()) e.employeeId = "Required";
    if (!form.qualification.trim()) e.qualification = "Required";
    if (!form.subject) e.subject = "Required";
    if (!form.joiningDate) e.joiningDate = "Required";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {
      // Get logged in user data
      const user = JSON.parse(localStorage.getItem("user"));

      const payload = {
        schoolId: user.schoolId, // same school id
        userId: user.id, // same logged in user id
        fullName: form.fullName,
        email: form.email,
        mobile: form.phone,
        password: form.password,
        dateOfBirth: form.dob,
        gender: form.gender,
        address: form.address,
        employeeId: form.employeeId,
        qualification: form.qualification,
        subject: form.subject,
        joiningDate: form.joiningDate
      };

      const response = await apiFetch(
        `${API_URL}/api/teachers/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message || "Failed to add teacher"
        );

      }

      console.log("Teacher Added:", data);

      alert(data.message);

      setSubmitted(true);

    } catch (error) {

      console.error(error);

      alert(error.message);

    }
  };

  const fetchTeachers = async () => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      const response = await apiFetch(
        `${API_URL}/api/teachers/all?schoolId=${user.schoolId}`
      );

      const data = await response.json();

      setTeachers(data);

    } catch (error) {

      console.error("Error fetching teachers", error);

    }
  };

  useEffect(() => {

    if (showTeacherList) {
      fetchTeachers();
    }

  }, [showTeacherList]);


  const deleteTeacher = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmDelete) return;

    try {

      await apiFetch(
        `${API_URL}/api/teachers/delete/${id}`,
        {
          method: "DELETE"
        }
      );

      fetchTeachers();

    } catch (error) {

      console.error("Delete error", error);

    }
  };

  const updateTeacher = async () => {

    try {

      await apiFetch(
        `${API_URL}/api/teachers/update/${selectedTeacher.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(selectedTeacher)
        }
      );

      setEditModal(false);

      fetchTeachers();

    } catch (error) {

      console.error("Update error", error);

    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    teacher.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
    teacher.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastTeacher = currentPage * teachersPerPage;

  const indexOfFirstTeacher =
    indexOfLastTeacher - teachersPerPage;

  const currentTeachers =
    filteredTeachers.slice(
      indexOfFirstTeacher,
      indexOfLastTeacher
    );

  const totalPages =
    Math.ceil(filteredTeachers.length / teachersPerPage);






  if (submitted) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 16
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#e8faf9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <polyline
              points="20 6 9 17 4 12"
              stroke="#2ec4b6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 800,
            color: "#1a2744"
          }}
        >
          Teacher Added Successfully!
        </h2>

        <p style={{ margin: 0, color: "#8898b8" }}>
          {form.fullName} has been added.
        </p>

        <div style={{ display: "flex", gap: 12 }}>

          <button
            onClick={() => {
              setSubmitted(false);
              setShowTeacherList(true);
            }}
            style={{
              background: "#4361ee",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 24px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            View Teachers
          </button>

          <button
            onClick={onBack}
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: "10px 24px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Back
          </button>

        </div>
      </div>
    );
  }

  const inputStyle = (err) => ({
    width: "100%", padding: "11px 14px", border: `1.5px solid ${err ? "#e53e3e" : "#e8ecf4"}`,
    borderRadius: 10, fontSize: 14, color: "#1a2744", fontFamily: "inherit", outline: "none",
    background: "#fff", boxSizing: "border-box"
  });
  const labelStyle = { fontSize: 13, fontWeight: 600, color: "#374162", marginBottom: 5, display: "block" };
  const errStyle = { color: "#e53e3e", fontSize: 12, marginTop: 3 };
  const selectStyle = (err) => ({ ...inputStyle(err), appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpolyline points='6 9 12 15 18 9' stroke='%238898b8' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 });
  const row = (children) => <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>{children}</div>;
  const field = (label, key, el, req) => (
    <div>
      <label style={labelStyle}>{label}{req && <span style={{ color: "#e53e3e" }}> *</span>}</label>
      {el}
      {errors[key] && <p style={errStyle}>{errors[key]}</p>}
    </div>
  );

  const thStyle = {
    textAlign: "left",
    padding: "14px",
    fontSize: 13,
    color: "#5a6783",
    fontWeight: 700,
    borderBottom: "1px solid #edf2f7"
  };

  const tdStyle = {
    padding: "14px",
    borderBottom: "1px solid #edf2f7",
    fontSize: 14,
    color: "#1a2744"
  };

  const viewBtn = {
    background: "#eef2ff",
    color: "#4361ee",
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700
  };

  const editBtn = {
    background: "#ecfdf3",
    color: "#16a34a",
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700
  };

  const deleteBtn = {
    background: "#fef2f2",
    color: "#dc2626",
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700
  };


  const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999
  };

  const modalBox = {
    background: "#fff",
    borderRadius: 20,
    padding: 30,
    width: 500,
    maxWidth: "90%"
  };

  const modalTitle = {
    marginTop: 0,
    marginBottom: 20,
    color: "#1a2744"
  };

  const modalInput = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
    fontSize: 14
  };

  const closeBtn = {
    background: "#f3f4f6",
    border: "none",
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700
  };

  const saveBtn = {
    background: "#4361ee",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700
  };

  return (
    <div>
      <style>{`.add-teacher-input:focus{border-color:#4361ee !important;box-shadow:0 0 0 3px rgba(67,97,238,0.1);}`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28, background: "#fff", borderRadius: 20, padding: "20px 28px", boxShadow: "0 2px 12px rgba(67,97,238,0.06)" }}>

        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="15 18 9 12 15 6" stroke="#8898b8" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "#eef0fd", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#4361ee" strokeWidth="1.8" /><circle cx="9" cy="7" r="4" stroke="#4361ee" strokeWidth="1.8" /><line x1="19" y1="8" x2="19" y2="14" stroke="#4361ee" strokeWidth="1.8" /><line x1="22" y1="11" x2="16" y2="11" stroke="#4361ee" strokeWidth="1.8" /></svg>
        </div>
        <div>

          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              color: "#1a2744"
            }}
          >
            Add Teacher
          </h2>

          <p
            style={{
              margin: 0,
              color: "#8898b8",
              fontSize: 13
            }}
          >
            Enter the details below to add a new teacher.
          </p>

        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 800, color: "#1a2744" }}>Personal Information</h3>
        {row(
          <>
            {field("Full Name", "fullName", <input className="add-teacher-input" style={inputStyle(errors.fullName)} placeholder="Enter full name" value={form.fullName} onChange={e => update("fullName", e.target.value)} />, true)}
            {field("Email Address", "email", <input className="add-teacher-input" style={inputStyle(errors.email)} placeholder="Enter email address" value={form.email} onChange={e => update("email", e.target.value)} />, true)}
          </>
        )}
        {row(
          <>
            {field("Phone Number", "phone", <input className="add-teacher-input" style={inputStyle(errors.phone)} placeholder="Enter phone number" value={form.phone} onChange={(e) => {
              const value = e.target.value
                .replace(/\D/g, "")
                .slice(0, 10);

              update("phone", value);

              setErrors(prev => ({
                ...prev,
                phone: validateMobile(value)
              }));
            }} />, true)}
            {field("Date of Birth", "dob", <input className="add-teacher-input" type="date" style={inputStyle(false)} value={form.dob} onChange={e => update("dob", e.target.value)} />)}
          </>
        )}
        {row(
          <>
            {field("Gender", "gender", <select className="add-teacher-input" style={selectStyle(false)} value={form.gender} onChange={e => update("gender", e.target.value)}>
              <option value="">Select Gender</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>)}
            {field("Address", "address", <textarea className="add-teacher-input" style={{ ...inputStyle(false), minHeight: 80, resize: "vertical" }} placeholder="Enter complete address" value={form.address} onChange={e => update("address", e.target.value)} />)}
          </>
        )}
      </div>

      <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 800, color: "#1a2744" }}>Professional Information</h3>
        {row(
          <>
            {field("Employee ID", "employeeId", <input className="add-teacher-input" style={inputStyle(errors.employeeId)} placeholder="Enter employee ID" value={form.employeeId} onChange={e => update("employeeId", e.target.value)} />, true)}
            {field("Qualification", "qualification", <input className="add-teacher-input" style={inputStyle(errors.qualification)} placeholder="Enter qualification" value={form.qualification} onChange={e => update("qualification", e.target.value)} />, true)}
          </>
        )}
        {row(
          <>
            {field("Subject Specialization", "subject", <select className="add-teacher-input" style={selectStyle(errors.subject)} value={form.subject} onChange={e => update("subject", e.target.value)}>
              <option value="">Select subject</option>
              {["Mathematics", "English", "Science", "Hindi", "Social Studies", "Computer Science", "Art & Craft", "Physical Education"].map(s => <option key={s}>{s}</option>)}
            </select>, true)}
            {field("Joining Date", "joiningDate", <input className="add-teacher-input" type="date" style={inputStyle(errors.joiningDate)} value={form.joiningDate} onChange={e => update("joiningDate", e.target.value)} />, true)}
          </>
        )}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Password<span style={{ color: "#e53e3e" }}> *</span></label>
          <div style={{ position: "relative" }}>
            <input className="add-teacher-input" type={showPass ? "text" : "password"} style={{ ...inputStyle(errors.password), paddingRight: 44 }} placeholder="Enter password" value={form.password} onChange={e => update("password", e.target.value)} />
            <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8898b8", padding: 4 }}>
              {showPass ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#8898b8" strokeWidth="1.8" /><line x1="1" y1="1" x2="23" y2="23" stroke="#8898b8" strokeWidth="1.8" /></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#8898b8" strokeWidth="1.8" /><circle cx="12" cy="12" r="3" stroke="#8898b8" strokeWidth="1.8" /></svg>}
            </button>
          </div>
          {errors.password && <p style={errStyle}>{errors.password}</p>}
        </div>
      
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          paddingBottom: 32
        }}
      >
        <button
          onClick={handleSubmit}
          style={{
            background: "#4361ee",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "11px 28px",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 4px 12px rgba(67,97,238,0.3)"
          }}
        >
          Add Teacher
        </button>

        <button
          onClick={() => {
            setShowTeacherList(!showTeacherList);
            fetchTeachers();
          }}
          style={{
            background: "#4361ee",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "11px 28px",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 4px 12px rgba(67,97,238,0.3)"
          }}
        >
          {showTeacherList ? "Hide Teachers" : "View Teachers"}
        </button>

        <button
          onClick={onBack}
          style={{
            background: "#fff",
            border: "1.5px solid #e8ecf4",
            color: "#5a6783",
            borderRadius: 10,
            padding: "11px 28px",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit"
          }}
        >
          Cancel
        </button>


      </div>
      {/* ================= TEACHER LIST ================= */}

      {showTeacherList && (

        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 24,
            boxShadow: "0 2px 12px rgba(67,97,238,0.06)",
            marginTop: 30
          }}
        >

          {/* Header */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20
            }}
          >

            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                color: "#1a2744"
              }}
            >
              Teachers List
            </h2>

            <input
              placeholder="Search teacher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "10px 14px",
                border: "1px solid #ddd",
                borderRadius: 10,
                width: 260,
                outline: "none"
              }}
            />

          </div>

          {/* TABLE */}

          <div style={{ overflowX: "auto" }}>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse"
              }}
            >

              <thead>

                <tr
                  style={{
                    background: "#f7f9fc"
                  }}
                >

                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Employee ID</th>
                  <th style={thStyle}>Subject</th>
                  <th style={thStyle}>Mobile</th>
                  <th style={thStyle}>Actions</th>

                </tr>

              </thead>

              <tbody>

                {currentTeachers.map((teacher) => (

                  <tr key={teacher.id}>

                    <td style={tdStyle}>{teacher.fullName}</td>

                    <td style={tdStyle}>
                      {teacher.employeeId}
                    </td>

                    <td style={tdStyle}>
                      {teacher.subject}
                    </td>

                    <td style={tdStyle}>
                      {teacher.mobile}
                    </td>

                    <td style={tdStyle}>

                      <div
                        style={{
                          display: "flex",
                          gap: 10
                        }}
                      >

                        {/* VIEW */}

                        <button
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setViewModal(true);
                          }}
                          style={viewBtn}
                        >
                          View
                        </button>

                        {/* EDIT */}



                        {/* DELETE */}

                        <button
                          onClick={() => deleteTeacher(teacher.id)}
                          style={deleteBtn}
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              marginTop: 24
            }}
          >

            {[...Array(totalPages)].map((_, index) => (

              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background:
                    currentPage === index + 1
                      ? "#4361ee"
                      : "#eef0fd",
                  color:
                    currentPage === index + 1
                      ? "#fff"
                      : "#1a2744",
                  fontWeight: 700
                }}
              >
                {index + 1}
              </button>

            ))}

          </div>

        </div>

      )}

      {/* VIEW MODAL */}

      {viewModal && selectedTeacher && (

        <div style={modalOverlay}>

          <div style={modalBox}>

            <h2 style={modalTitle}>
              Teacher Details
            </h2>

            <div style={{ lineHeight: 2 }}>

              <p><b>Name:</b> {selectedTeacher.fullName}</p>

              <p><b>Email:</b> {selectedTeacher.email}</p>

              <p><b>Mobile:</b> {selectedTeacher.mobile}</p>

              <p><b>Subject:</b> {selectedTeacher.subject}</p>

              <p><b>Qualification:</b> {selectedTeacher.qualification}</p>

              <p><b>Gender:</b> {selectedTeacher.gender}</p>

            </div>

            <button
              onClick={() => setViewModal(false)}
              style={closeBtn}
            >
              Close
            </button>

          </div>

        </div>

      )}
    </div>

  );
}
