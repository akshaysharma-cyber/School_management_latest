import { useState, useEffect } from "react";
import { apiFetch } from "../utils/apiFetch";
import { validateMobile } from "../utils/validation";

const API_URL = import.meta.env.VITE_API_URL;

export default function AddStudentPage({ onBack }) {
  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const schoolId = loggedUser?.schoolId;

  const [page, setPage] = useState("add");
  // add | list | view | edit

  const [students, setStudents] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [classFilter, setClassFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  const [form, setForm] = useState({
    id: null,
    admissionNo: "", fullName: "", dob: "", gender: "", bloodGroup: "",
    category: "", religion: "", nationality: "",
    parentName: "", relationship: "", mobile: "", email: "", address: "",
    classVal: "", studentPhoto: null, academicYear: "",
    birthCertificate: null
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.admissionNo.trim()) e.admissionNo = "Required";
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.dob) e.dob = "Required";
    if (!form.gender) e.gender = "Required";
    if (!form.parentName.trim()) e.parentName = "Required";
    if (!form.relationship) e.relationship = "Required";
    const mobileError = validateMobile(form.mobile);

if (mobileError) {
  e.mobile = mobileError;
}
    if (!form.address.trim()) e.address = "Required";
    if (!form.classVal) e.classVal = "Required";
    return e;
  };

  const handleSubmit = async () => {

    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {

      const payload = {

        schoolId: schoolId,

        admissionNumber: form.admissionNo,
        fullName: form.fullName,
        dateOfBirth: form.dob,
        gender: form.gender,
        bloodGroup: form.bloodGroup,

        category: form.category,
        religion: form.religion,
        nationality: form.nationality,

        parentName: form.parentName,
        relationship: form.relationship,
        parentMobile: form.mobile,
        parentEmail: form.email,
        address: form.address,

        className: form.classVal,

        academicYear: form.academicYear
      };

      const formData = new FormData();

      // SEND JSON OBJECT
      formData.append(
        "student",
        JSON.stringify(payload)
      );

      // SEND PHOTO
      if (form.studentPhoto) {

        formData.append(
          "studentPhoto",
          form.studentPhoto
        );
      }

      // SEND CERTIFICATE
      if (form.birthCertificate) {

        formData.append(
          "birthCertificate",
          form.birthCertificate
        );
      }

      let response;

      if (form.id) {

        // UPDATE
        response = await apiFetch(
          `${API_URL}/api/students/update/${form.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)
          }
        );

      } else {

        // ADD NEW
        const formData = new FormData();

        formData.append(
          "student",
          JSON.stringify(payload)
        );

        if (form.studentPhoto) {
          formData.append(
            "studentPhoto",
            form.studentPhoto
          );
        }

        if (form.birthCertificate) {
          formData.append(
            "birthCertificate",
            form.birthCertificate
          );
        }

        response = await apiFetch(
          `${API_URL}/api/students/add`,
          {
            method: "POST",
            body: formData
          }
        );

      }

      const data = await response.json();

      if (response.ok) {

        if (form.id) {

          alert("Student updated successfully");

          setPage("list");

        } else {

          alert("Student added successfully");

          setSubmitted(true);

        }

        fetchStudents();

      } else {

        alert(data.message || "Failed");

      }

    } catch (error) {

      console.error(error);

      alert("Server error");

    }
  };

  const fetchStudents = async () => {

    try {

      const response = await apiFetch(
        `${API_URL}/api/students/all?schoolId=${schoolId}`
      );

      const data = await response.json();

      console.log("Students =", data);

      setStudents(data);

    } catch (error) {

      console.error("Fetch student error:", error);

    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleView = (student) => {

    setSelectedStudent(student);

    setPage("view");
  };


  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {

      const response = await apiFetch(
        `${API_URL}/api/students/delete/${id}`,
        {
          method: "DELETE"
        }
      );

      if (response.ok) {

        alert("Student deleted successfully");

        fetchStudents();

      } else {

        alert("Failed to delete student");

      }

    } catch (error) {

      console.error(error);

    }
  };


  const handleEdit = (student) => {

    setForm({
      id: student.id,

      admissionNo: student.admissionNumber || "",
      fullName: student.fullName || "",
      dob: student.dateOfBirth || "",
      gender: student.gender || "",
      bloodGroup: student.bloodGroup || "",
      category: student.category || "",
      religion: student.religion || "",
      nationality: student.nationality || "",
      parentName: student.parentName || "",
      relationship: student.relationship || "",
      mobile: student.parentMobile || "",
      email: student.parentEmail || "",
      address: student.address || "",
      classVal: student.className || "",
      academicYear: student.academicYear || ""

    });

    setPage("edit");
  };

  if (submitted) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#e8faf9", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#2ec4b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a2744" }}>Student Added Successfully!</h2>
      <p style={{ margin: 0, color: "#8898b8" }}>{form.fullName} has been added to the school.</p>
      <button onClick={onBack} style={{ marginTop: 8, background: "#4361ee", color: "#fff", border: "none", borderRadius: 10, padding: "10px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Back to Students</button>
    </div>
  );

  const inputStyle = (err) => ({
    width: "100%", padding: "11px 14px", border: `1.5px solid ${err ? "#e53e3e" : "#e8ecf4"}`,
    borderRadius: 10, fontSize: 14, color: "#1a2744", fontFamily: "inherit", outline: "none",
    background: "#fff", boxSizing: "border-box", transition: "border 0.15s"
  });
  const labelStyle = { fontSize: 13, fontWeight: 600, color: "#374162", marginBottom: 5, display: "block" };
  const errStyle = { color: "#e53e3e", fontSize: 12, marginTop: 3 };
  const selectStyle = (err) => ({ ...inputStyle(err), appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpolyline points='6 9 12 15 18 9' stroke='%238898b8' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 });

  const sectionTitle = (t) => <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 800, color: "#1a2744" }}>{t}</h3>;
  const row = (children) => <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>{children}</div>;
  const row3 = (children) => <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>{children}</div>;
  const field = (label, key, el, req) => (
    <div>
      <label style={labelStyle}>{label}{req && <span style={{ color: "#e53e3e" }}> *</span>}</label>
      {el}
      {errors[key] && <p style={errStyle}>{errors[key]}</p>}
    </div>
  );

  const th = {
    padding: 16,
    textAlign: "left"
  };

  const td = {
    padding: 16,
    borderTop: "1px solid #eee"
  };

  const viewBtn = {
    background: "#e0f2fe",
    color: "#0369a1",
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700
  };

  const editBtn = {
    background: "#fef3c7",
    color: "#92400e",
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700
  };

  const deleteBtn = {
    background: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700
  };

  if (page === "list") {

    const filteredStudents = students.filter((s) => {

      const matchesSearch =
        s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass =
        classFilter === "" || s.className === classFilter;

      return matchesSearch && matchesClass;
    });

    const indexOfLast = currentPage * studentsPerPage;

    const indexOfFirst = indexOfLast - studentsPerPage;

    const currentStudents = filteredStudents.slice(
      indexOfFirst,
      indexOfLast
    );

    const totalPages = Math.ceil(
      filteredStudents.length / studentsPerPage
    );

    return (

      <div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20
          }}
        >
          <h2>Student List</h2>

          <button
            onClick={() => setPage("add")}
            style={{
              background: "#4361ee",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 20px",
              fontWeight: 700
            }}
          >
           {form.id ? "Update Student" : "Add Student"}
          </button>
        </div>

        {/* SEARCH */}

        <div
          style={{
            display: "flex",
            gap: 15,
            marginBottom: 20
          }}
        >

          <input
            placeholder="Search student"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              border: "1px solid #ddd"
            }}
          />

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 10,
              border: "1px solid #ddd"
            }}
          >
            <option value="">All Classes</option>

            {[
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
            ].map((c) => (
              <option key={c} value={c}>
                {["Nursery", "LKG", "UKG"].includes(c)
                  ? c
                  : `Class ${c}`}
              </option>
            ))}
          </select>

        </div>

        {/* TABLE */}

        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            overflow: "hidden"
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >

            <thead
              style={{
                background: "#f5f7ff"
              }}
            >
              <tr>

                <th style={th}>Admission No</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Name
                </th>
                <th style={th}>Class</th>
                <th style={th}>Mobile</th>
                <th style={th}>Actions</th>

              </tr>
            </thead>

            <tbody>

              {currentStudents.map((student) => (

                <tr key={student.id}>

                  <td style={td}>
                    {student.admissionNumber}
                  </td>

                  <td style={td}>
                    {student.fullName}
                  </td>

                  <td style={td}>
                    {student.className}
                  </td>

                  <td style={td}>
                    {student.parentMobile}
                  </td>

                  <td style={td}>

                    <div
                      style={{
                        display: "flex",
                        gap: 10
                      }}
                    >

                      <button
                        onClick={() => handleView(student)}
                        style={viewBtn}
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleEdit(student)}
                        style={editBtn}
                      >
                        Update
                      </button>

                      <button
                        onClick={() => handleDelete(student.id)}
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
            marginTop: 20,
            display: "flex",
            justifyContent: "center",
            gap: 10
          }}
        >

          {[...Array(totalPages)].map((_, index) => (

            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background:
                  currentPage === index + 1
                    ? "#4361ee"
                    : "#eef2ff",
                color:
                  currentPage === index + 1
                    ? "#fff"
                    : "#000"
              }}
            >
              {index + 1}
            </button>

          ))}

        </div>

      </div>
    );
  }


  if (page === "view" && selectedStudent) {

    return (

      <div
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 20
        }}
      >

        <h2>Student Details</h2>

        <div style={{ lineHeight: 2 }}>

          <p>
            <b>Name:</b> {selectedStudent.fullName}
          </p>

          <p>
            <b>Admission No:</b> {selectedStudent.admissionNumber}
          </p>

          <p>
            <b>Class:</b> {selectedStudent.className}
          </p>

          <p>
            <b>Academic Year:</b>
            {selectedStudent.academicYear}
          </p>

          <p>
            <b>Parent:</b> {selectedStudent.parentName}
          </p>

          <p>
            <b>Mobile:</b> {selectedStudent.parentMobile}
          </p>

        </div>

        <button
          onClick={() => setPage("list")}
          style={{
            background: "#4361ee",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            marginTop: 20
          }}
        >
          Back
        </button>

      </div>
    );
  }





  return (
    <div>
      <style>{`.add-student-input:focus{border-color:#4361ee !important;box-shadow:0 0 0 3px rgba(67,97,238,0.1);}`}</style>
      {/* Breadcrumb + Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#8898b8", padding: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="15 18 9 12 15 6" stroke="#8898b8" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a2744" }}>Add New Student</h2>
          <p style={{ margin: 0, color: "#8898b8", fontSize: 13.5 }}>Fill in the details to add a new student to the school.</p>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 24 }}>
        {sectionTitle("Personal Information")}
        {row(
          <>
            {field("Admission Number", "admissionNo", <input className="add-student-input" style={inputStyle(errors.admissionNo)} placeholder="e.g., GPS2024001" value={form.admissionNo}  readOnly={!!form.id} onChange={e => update("admissionNo", e.target.value)} />, true)}
            {field("Student Full Name", "fullName", <input className="add-student-input" style={inputStyle(errors.fullName)} placeholder="Enter full name" value={form.fullName} onChange={e => update("fullName", e.target.value)} />, true)}
          </>
        )}
        {row3(
          <>
            {field("Date of Birth", "dob", <input className="add-student-input" type="date" style={inputStyle(errors.dob)} value={form.dob} onChange={e => update("dob", e.target.value)} />, true)}
            {field("Gender", "gender", <select className="add-student-input" style={selectStyle(errors.gender)} value={form.gender} onChange={e => update("gender", e.target.value)}>
              <option value="">Select Gender</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>, true)}
            {field("Blood Group", "bloodGroup", <select className="add-student-input" style={selectStyle(false)} value={form.bloodGroup} onChange={e => update("bloodGroup", e.target.value)}>
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g}>{g}</option>)}
            </select>)}
          </>
        )}
        {row3(
          <>
            {field("Category", "category", <select className="add-student-input" style={selectStyle(false)} value={form.category} onChange={e => update("category", e.target.value)}>
              <option value="">Select Category</option>
              <option>General</option><option>OBC</option><option>SC</option><option>ST</option>
            </select>)}
            {field("Religion", "religion", <input className="add-student-input" style={inputStyle(false)} placeholder="Enter Religion" value={form.religion} onChange={e => update("religion", e.target.value)} />)}
            {field("Nationality", "nationality", <input className="add-student-input" style={inputStyle(false)} placeholder="Enter Nationality" value={form.nationality} onChange={e => update("nationality", e.target.value)} />)}
          </>
        )}
      </div>

      <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 24 }}>
        {sectionTitle("Contact Information")}
        {row(
          <>
            {field("Parent/Guardian Name", "parentName", <input className="add-student-input" style={inputStyle(errors.parentName)} placeholder="Enter parent or guardian name" value={form.parentName} onChange={e => update("parentName", e.target.value)} />, true)}
            {field("Relationship", "relationship", <select className="add-student-input" style={selectStyle(errors.relationship)} value={form.relationship} onChange={e => update("relationship", e.target.value)}>
              <option value="">Select Relationship</option>
              <option>Father</option><option>Mother</option><option>Guardian</option>
            </select>, true)}
          </>
        )}
        {row(
          <>
            {field("Mobile Number", "mobile", <input className="add-student-input" style={inputStyle(errors.mobile)} placeholder="Enter 10-digit mobile number" value={form.mobile} onChange={(e) => {
  const value = e.target.value;

  update("mobile", value);

  setErrors(prev => ({
    ...prev,
    mobile: validateMobile(value)
  }));
}} />, true)}
            {field("Email", "email", <input className="add-student-input" style={inputStyle(false)} placeholder="Enter email address (optional)" value={form.email} onChange={e => update("email", e.target.value)} />)}
          </>
        )}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Address<span style={{ color: "#e53e3e" }}> *</span></label>
          <textarea className="add-student-input" style={{ ...inputStyle(errors.address), minHeight: 80, resize: "vertical" }} placeholder="Enter complete address" value={form.address} onChange={e => update("address", e.target.value)} />
          {errors.address && <p style={errStyle}>{errors.address}</p>}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 24 }}>
        {sectionTitle("Academic Information")}
        {row(
          <>
            {field("Class", "classVal", <select className="add-student-input" style={selectStyle(errors.classVal)} value={form.classVal} onChange={e => update("classVal", e.target.value)}>
              <option value="">Select Class</option>
              {[
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
              ].map((c) => (
                <option key={c} value={c}>
                  {["Nursery", "LKG", "UKG"].includes(c)
                    ? c
                    : `Class ${c}`}
                </option>
              ))}
            </select>, true)}
            {field(
              "Academic Year",
              "academicYear",

              <select
                className="add-student-input"
                style={selectStyle(errors.academicYear)}
                value={form.academicYear}
                onChange={(e) =>
                  update(
                    "academicYear",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select Academic Year
                </option>

                <option value="2025-26">
                  2025-26
                </option>

                <option value="2026-27">
                  2026-27
                </option>

                <option value="2027-28">
                  2027-28
                </option>

              </select>,
              true
            )}
          </>
        )}
      </div>

      <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 2px 12px rgba(67,97,238,0.06)", marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 800, color: "#1a2744" }}>Upload Documents</h3>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#8898b8" }}>Upload student photo and any required documents.</p>
        {row(
          <>
            <div>
              <label style={labelStyle}>Student Photo</label>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "#b0bbc9" }}>JPG, PNG (Max 2MB)</p>
              <div
                style={{
                  border: "2px dashed #e8ecf4",
                  borderRadius: 12,
                  padding: "28px 20px",
                  textAlign: "center",
                  background: "#fafbff"
                }}
              >

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    update(
                      "studentPhoto",
                      e.target.files[0]
                    )
                  }
                />

                {form.studentPhoto && (
                  <p style={{ marginTop: 10 }}>
                    {form.studentPhoto.name}
                  </p>
                )}

              </div>
            </div>
            <div>
              <label style={labelStyle}>Birth Certificate (Optional)</label>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "#b0bbc9" }}>PDF, JPG, PNG (Max 5MB)</p>
              <div
                style={{
                  border: "2px dashed #e8ecf4",
                  borderRadius: 12,
                  padding: "28px 20px",
                  textAlign: "center",
                  background: "#fafbff"
                }}
              >

                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) =>
                    update(
                      "birthCertificate",
                      e.target.files[0]
                    )
                  }
                />

                {form.birthCertificate && (
                  <p style={{ marginTop: 10 }}>
                    {form.birthCertificate.name}
                  </p>
                )}

              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingBottom: 32 }}>
        <button onClick={handleSubmit} style={{ background: "#4361ee", color: "#fff", border: "none", borderRadius: 10, padding: "11px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(67,97,238,0.3)" }}>Add Student</button>
        <button
          onClick={() => setPage("list")}
          style={{
            background: "#4361ee",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "11px 28px",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          View Students
        </button>
        <button onClick={onBack} style={{ background: "#fff", border: "1.5px solid #e8ecf4", color: "#5a6783", borderRadius: 10, padding: "11px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>

      </div>
    </div>
  );
}
