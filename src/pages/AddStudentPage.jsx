import { useState } from "react";

export default function AddStudentPage({ onBack }) {
  const [form, setForm] = useState({
    admissionNo: "", fullName: "", dob: "", gender: "", bloodGroup: "",
    category: "", religion: "", nationality: "",
    parentName: "", relationship: "", mobile: "", email: "", address: "",
    classVal: "", section: ""
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
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter valid 10-digit number";
    if (!form.address.trim()) e.address = "Required";
    if (!form.classVal) e.classVal = "Required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
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
            {field("Admission Number", "admissionNo", <input className="add-student-input" style={inputStyle(errors.admissionNo)} placeholder="e.g., GPS2024001" value={form.admissionNo} onChange={e => update("admissionNo", e.target.value)} />, true)}
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
            {field("Mobile Number", "mobile", <input className="add-student-input" style={inputStyle(errors.mobile)} placeholder="Enter 10-digit mobile number" value={form.mobile} onChange={e => update("mobile", e.target.value)} />, true)}
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
              {["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"].map(c => <option key={c}>{c}</option>)}
            </select>, true)}
            {field("Section", "section", <input className="add-student-input" style={inputStyle(false)} placeholder="e.g., A" value={form.section} onChange={e => update("section", e.target.value)} />)}
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
              <div style={{ border: "2px dashed #e8ecf4", borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: "#fafbff" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 8px", display: "block" }}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#b0bbc9" strokeWidth="1.8" /><circle cx="12" cy="13" r="4" stroke="#b0bbc9" strokeWidth="1.8" /></svg>
                <span style={{ color: "#4361ee", fontWeight: 700, fontSize: 13 }}>Choose File</span>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Birth Certificate (Optional)</label>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "#b0bbc9" }}>PDF, JPG, PNG (Max 5MB)</p>
              <div style={{ border: "2px dashed #e8ecf4", borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: "#fafbff" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 8px", display: "block" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#b0bbc9" strokeWidth="1.8" /><polyline points="14 2 14 8 20 8" stroke="#b0bbc9" strokeWidth="1.8" /></svg>
                <span style={{ color: "#4361ee", fontWeight: 700, fontSize: 13 }}>Choose File</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingBottom: 32 }}>
        <button onClick={onBack} style={{ background: "#fff", border: "1.5px solid #e8ecf4", color: "#5a6783", borderRadius: 10, padding: "11px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        <button onClick={handleSubmit} style={{ background: "#4361ee", color: "#fff", border: "none", borderRadius: 10, padding: "11px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(67,97,238,0.3)" }}>Add Student</button>
      </div>
    </div>
  );
}
