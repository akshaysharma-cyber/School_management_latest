import { useState } from "react";

export default function AddTeacherPage({ onBack }) {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", dob: "", gender: "", address: "",
    employeeId: "", qualification: "", subject: "", joiningDate: "", password: "",
    sendCredentials: true
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter valid email";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter valid 10-digit number";
    if (!form.employeeId.trim()) e.employeeId = "Required";
    if (!form.qualification.trim()) e.qualification = "Required";
    if (!form.subject) e.subject = "Required";
    if (!form.joiningDate) e.joiningDate = "Required";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
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
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a2744" }}>Teacher Added Successfully!</h2>
      <p style={{ margin: 0, color: "#8898b8" }}>{form.fullName} has been added to the staff.</p>
      <button onClick={onBack} style={{ marginTop: 8, background: "#4361ee", color: "#fff", border: "none", borderRadius: 10, padding: "10px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Back to Teachers</button>
    </div>
  );

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
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1a2744" }}>Add Teacher</h2>
          <p style={{ margin: 0, color: "#8898b8", fontSize: 13 }}>Enter the details below to add a new teacher.</p>
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
            {field("Phone Number", "phone", <input className="add-teacher-input" style={inputStyle(errors.phone)} placeholder="Enter phone number" value={form.phone} onChange={e => update("phone", e.target.value)} />, true)}
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
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input type="checkbox" checked={form.sendCredentials} onChange={e => update("sendCredentials", e.target.checked)} style={{ width: 16, height: 16, accentColor: "#4361ee" }} />
          <span style={{ fontSize: 13.5, color: "#374162", fontWeight: 500 }}>Send login credentials to teacher's email</span>
        </label>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingBottom: 32 }}>
        <button onClick={onBack} style={{ background: "#fff", border: "1.5px solid #e8ecf4", color: "#5a6783", borderRadius: 10, padding: "11px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        <button onClick={handleSubmit} style={{ background: "#4361ee", color: "#fff", border: "none", borderRadius: 10, padding: "11px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(67,97,238,0.3)" }}>Add Teacher</button>
      </div>
    </div>
  );
}
