
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/apiFetch";





export default function FeeCollectionPage({ onNavigate }) {
  const [classCollectionData, setClassCollectionData] =
  useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [dashboardData, setDashboardData] =
  useState({
    totalFeesDue: 0,
    feesCollected: 0,
    pendingAmount: 0,
    collectionRate: 0
  });
  const [receiptNumber, setReceiptNumber] = useState("");
  const [page, setPage] = useState(1);
  const [showCollect, setShowCollect] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [studentFeeId, setStudentFeeId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [remarks, setRemarks] = useState("");
  const [paymentHistory, setPaymentHistory] =
  useState([]);



  useEffect(() => {

  fetchClassCollection();

}, []);

const fetchClassCollection = async () => {

  try {

    const user =
      JSON.parse(localStorage.getItem("user"));

    const response = await apiFetch(
      `http://localhost:8089/api/fees/class-collection/${user.schoolId}`
    );

    const data = await response.json();

    const colors = [
      "#4361ee",
      "#7b61ff",
      "#2ec4b6",
      "#f4a261",
      "#ef4444",
      "#22c55e"
    ];

    const formatted = data.map((item, index) => ({
      ...item,
      color: colors[index % colors.length]
    }));

    setClassCollectionData(formatted);

  } catch (error) {

    console.error(
      "Error fetching class collection:",
      error
    );
  }
};

  useEffect(() => {

  fetchRecentPayments();

}, []);

const fetchRecentPayments = async () => {

  try {

    const user =
      JSON.parse(localStorage.getItem("user"));

    const response = await apiFetch(
      `http://localhost:8089/api/fees/recent-payments/${user.schoolId}`
    );

    const data = await response.json();

    setRecentPayments(data);

  } catch (error) {

    console.error(
      "Error fetching recent payments:",
      error
    );
  }
};
  

const fetchStudents = async (className) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const response = await apiFetch(
      `http://localhost:8089/api/students/by-class/${user.schoolId}/${className}`
    );

    const data = await response.json();

    setStudents(data);
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};


const fetchFeeDetails = async (studentId) => {

  try {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );



    // =========================
    // FETCH STUDENT FEE DETAILS
    // =========================

    const response = await apiFetch(
      `http://localhost:8089/api/fees/student/${user.schoolId}/${studentId}`
    );

    const data = await response.json();



    // =========================
    // SET FEE DATA
    // =========================

    setStudentFeeId(data.id);

    setTotalAmount(
      data.totalAmount || 0
    );

    setPaidAmount(
      data.paidAmount || 0
    );

    setDueAmount(
      data.dueAmount || 0
    );

    setReceiptNumber(
      data.receiptNumber || ""
    );



    // =========================
    // FETCH PREVIOUS PAYMENTS
    // =========================

    const historyResponse =
      await apiFetch(
        `http://localhost:8089/api/fees/payment-history/${user.schoolId}/${data.id}`
      );



    let historyData = [];

    try {

      historyData =
        await historyResponse.json();

    } catch {

      historyData = [];
    }



    // =========================
    // STORE HISTORY
    // =========================

    setPaymentHistory(
      historyData
    );



  } catch (error) {

    console.error(
      "Error fetching fee details:",
      error
    );

    setPaymentHistory([]);

  }
};




const handleCollectFee = async () => {

  try {

    console.log(studentFeeId);
    console.log("Student Fee ID:", studentFeeId);

    const payload = {

      studentFeeId: studentFeeId,

      amount: Number(newPaymentAmount),

      paymentDate: paymentDate,

      paymentMode: paymentMode.toUpperCase(),

      remarks: remarks

    };

    console.log(payload);

    const response = await apiFetch(
      "http://localhost:8089/api/fees/collect",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)
      }
    );

    const data = await response.text();

    if (response.ok) {

      alert(data);
   setReceiptNumber(data);

  alert("Payment submitted successfully");
 

      fetchFeeDetails(selectedStudent);

      setNewPaymentAmount("");

    } else {

      alert(data);
    }

  } catch (error) {

    console.error("Collect fee error:", error);

    alert("Error collecting fee");
  }
};

const handleDownloadReceipt = async () => {

  try {

    const user =
      JSON.parse(localStorage.getItem("user"));

    const response = await fetch(
      `http://localhost:8089/api/fees/receipt/${user.schoolId}/${selectedStudent}/${studentFeeId}`,
      {
        method: "GET"
      }
    );

    if (!response.ok) {

      alert("Failed to download receipt");
      return;
    }

    const blob = await response.blob();

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = "Fee_Receipt.pdf";

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {

    console.error(error);

    alert("Error downloading receipt");
  }
};


useEffect(() => {

  fetchDashboardData();

}, []);

const fetchDashboardData = async () => {

  try {

    const user =
      JSON.parse(localStorage.getItem("user"));

    const response = await apiFetch(
      `http://localhost:8089/api/fees/dashboard/${user.schoolId}`
    );

    const data = await response.json();

    setDashboardData(data);

  } catch (error) {

    console.error(
      "Error fetching dashboard data:",
      error
    );
  }
};

   const labelStyle = {
    display: "block",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: 700,
    color: "#334155"
  };

  const inputStyle = {
    width: "100%",
    height: 56,
    border: "1.5px solid #dbe2ea",
    borderRadius: 14,
    padding: "0 16px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    background: "#fff"
  };

  const readonlyStyle = {
    ...inputStyle,
    background: "#f8fafc",
    color: "#475569"
  };

  // Simple donut chart using SVG
  const DonutChart = () => {

  const r = 60;

  const cx = 80;

  const cy = 80;

  const circ = 2 * Math.PI * r;

  let offset = 0;

  const total =
    classCollectionData.reduce(
      (sum, item) => sum + item.amount,
      0
    );

  return (
    <svg viewBox="0 0 160 160" width="140" height="140">

      {classCollectionData.map((d, i) => {

        const pct =
          total > 0
            ? (d.amount / total) * 100
            : 0;

        const dash = (pct / 100) * circ;

        const gap = circ - dash;

        const seg = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={d.color}
            strokeWidth="28"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center"
            }}
          />
        );

        offset += dash;

        return seg;
      })}

      <circle
        cx={cx}
        cy={cy}
        r={46}
        fill="#fff"
      />

      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fontSize="10"
        fill="#8898b8"
        fontFamily="inherit"
        fontWeight="600"
      >
        Total
      </text>

      <text
        x={cx}
        y={cy + 8}
        textAnchor="middle"
        fontSize="11"
        fill="#1a2744"
        fontFamily="inherit"
        fontWeight="800"
      >
        ₹{total.toLocaleString()}
      </text>
    </svg>
  );
};

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#1a2744" }}>Fee Collection</h2>
          <p style={{ margin: 0, color: "#8898b8", fontSize: 13.5 }}>Manage and track school fee collection.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {onNavigate && <button onClick={() => onNavigate("structure")} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", color: "#4361ee", border: "1.5px solid #4361ee", borderRadius: 12, padding: "11px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            Fee Structure
          </button>}
          <button onClick={() => setShowCollect(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "#4361ee", color: "#fff", border: "none", borderRadius: 12, padding: "11px 20px", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(67,97,238,0.3)" }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Collect Fee
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Fees Due", value: `₹ ${dashboardData.totalFeesDue?.toLocaleString()}`, icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#4361ee" strokeWidth="1.8" /><line x1="2" y1="10" x2="22" y2="10" stroke="#4361ee" strokeWidth="1.8" /></svg>, bg: "#eef0fd", color: "#4361ee" },
          { label: "Fees Collected", value: `₹ ${dashboardData.feesCollected?.toLocaleString()}`, icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#22c55e" strokeWidth="1.8" /><polyline points="9 12 11 14 15 10" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" /></svg>, bg: "#f0fdf4", color: "#22c55e" },
          { label: "Pending Amount", value: `₹ ${dashboardData.pendingAmount?.toLocaleString()}`, icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#7b61ff" strokeWidth="1.8" /><polyline points="12 6 12 12 16 14" stroke="#7b61ff" strokeWidth="1.8" strokeLinecap="round" /></svg>, bg: "#f0ecff", color: "#7b61ff" },
          { label: "Collection Rate", value: `${dashboardData.collectionRate}%`, icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><line x1="19" y1="5" x2="5" y2="19" stroke="#f4a261" strokeWidth="1.8" strokeLinecap="round" /><circle cx="6.5" cy="6.5" r="2.5" stroke="#f4a261" strokeWidth="1.8" /><circle cx="17.5" cy="17.5" r="2.5" stroke="#f4a261" strokeWidth="1.8" /></svg>, bg: "#fff8f0", color: "#f4a261" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 2px 12px rgba(67,97,238,0.06)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>{s.icon}</div>
            <p style={{ margin: "0 0 2px", fontSize: 13, color: "#8898b8", fontWeight: 500 }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a2744" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Recent Payments */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(67,97,238,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1a2744" }}>Recent Payments</h3>
            <button style={{ background: "none", border: "none", color: "#4361ee", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" }}>View All Payments</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px 80px", padding: "8px 0 12px", borderBottom: "1px solid #f5f6fc", gap: 8 }}>
            {["Student Name", "Class", "Amount", "Date", "Status"].map(h => (
              <span key={h} style={{ fontSize: 12.5, fontWeight: 700, color: "#8898b8" }}>{h}</span>
            ))}
          </div>
          {recentPayments.map((p, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px 80px", padding: "14px 0", borderBottom: i < recentPayments.length - 1 ? "1px solid #f5f6fc" : "none", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: p.textColor, flexShrink: 0 }}>{p.initials}</div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1a2744" }}>{p.studentName}</span>
              </div>
              <span style={{ fontSize: 13.5, color: "#5a6783" }}>{p.className}</span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1a2744" }}>{p.amount?.toLocaleString()}</span>
              <span style={{ fontSize: 13, color: "#8898b8" }}>{p.paymentDate}</span>
              <span style={{ display: "inline-flex", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: p.status === "Paid" ? "#f0fdf4" : "#fff8f0", color: p.status === "Paid" ? "#22c55e" : "#f4a261", width: "fit-content" }}>{p.status}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
            <span style={{ fontSize: 13, color: "#8898b8" }}>Showing 5 of 32 payments</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setPage(n)} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid", borderColor: page === n ? "#4361ee" : "#e8ecf4", background: page === n ? "#4361ee" : "#fff", color: page === n ? "#fff" : "#5a6783", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{n}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Donut Chart */}
          <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(67,97,238,0.06)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 800, color: "#1a2744" }}>Collection by Class</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <DonutChart />
              <div style={{ flex: 1 }}>
                {classCollectionData.map(d => (
                  <div key={d.className} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: "#5a6783", flex: 1 }}>{d.className}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1a2744" }}>₹ {d.amount?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {/* Collect Fee Modal */}
{showCollect && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,0.55)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      overflowY: "auto"
    }}
    onClick={() => setShowCollect(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxWidth: 1180,
        background: "#fff",
        borderRadius: 28,
        padding: 30,
        boxSizing: "border-box",
        maxHeight: "95vh",
        overflowY: "auto"
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 800,
              color: "#0f172a"
            }}
          >
            Collect Fee
          </h2>

          <p
            style={{
              marginTop: 6,
              color: "#64748b",
              fontSize: 14
            }}
          >
            Record student fee payment and generate receipt
          </p>
        </div>

        <button
          onClick={() => setShowCollect(false)}
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            background: "#fff",
            cursor: "pointer",
            fontSize: 20
          }}
        >
          ×
        </button>
      </div>

      {/* Student Information */}
      
<div
  style={{
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24
  }}
>
  <h3
    style={{
      margin: "0 0 22px",
      fontSize: 18,
      fontWeight: 700,
      color: "#0f172a"
    }}
  >
    Student Information
  </h3>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20
    }}
  >
    {/* Class */}
    {/* Class */}
<div>
  <label style={labelStyle}>Class *</label>

  <select
    value={selectedClass}
    onChange={(e) => {
      setSelectedClass(e.target.value);
      fetchStudents(e.target.value);
    }}
    style={{
      ...inputStyle,
      border: "none",
      outline: "none",
      fontSize: 13,
      fontWeight: 600,
      color: "#1a2744",
      background: "#fff",
      cursor: "pointer",
      fontFamily: "inherit",
      padding: "0 16px",
      borderRadius: 14,
      boxShadow: "0 2px 8px rgba(67,97,238,0.07)"
    }}
  >
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
  </select>
</div>

    {/* Student */}
    <div>
      <label style={labelStyle}>Student *</label>

    <select
  style={inputStyle}
  value={selectedStudent}
  onChange={(e) => {
    const studentId = e.target.value;

    setSelectedStudent(studentId);

    const student = students.find(
      (s) => s.id == studentId
    );

    if (student) {
  setFatherName(student.parentName || "");
  setMobileNumber(student.parentMobile || "");

  fetchFeeDetails(studentId);
}
  }}
>
  <option value="">Select Student</option>

  {students.map((student) => (
    <option key={student.id} value={student.id}>
      {student.fullName}
    </option>
  ))}
</select>
    </div>

    {/* Father Name */}
    <div>
      <label style={labelStyle}>Father Name</label>

      <input
  readOnly
  value={fatherName}
  style={readonlyStyle}
/>
    </div>

    {/* Mobile */}
    <div>
      <label style={labelStyle}>Mobile Number</label>

      <input
  readOnly
  value={mobileNumber}
  style={readonlyStyle}
/>
    </div>
  </div>
</div>

      {/* Fee Details */}
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          padding: 24,
          marginBottom: 24
        }}
      >
        <h3
          style={{
            margin: "0 0 22px",
            fontSize: 18,
            fontWeight: 700,
            color: "#0f172a"
          }}
        >
          Fee Details
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20
          }}
        >
          <div>
            <label style={labelStyle}>Fee Type *</label>
            <select style={inputStyle}>
              <option>Select Fee Type</option>
              <option>Tuition Fee</option>
              <option>Transport Fee</option>
              <option>Exam Fee</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Payment Date *</label>
            <input
  type="date"
  value={paymentDate}
  onChange={(e) =>
    setPaymentDate(e.target.value)
  }
  style={inputStyle}
/>
          </div>

          <div>
            <label style={labelStyle}>Total Amount</label>
            <input
              value={`₹ ${totalAmount}`}
              readOnly
              style={readonlyStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Paid Amount *</label>
            <input
              value={`₹ ${paidAmount}`}
              readOnly
              style={readonlyStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Due Amount</label>
            <input
              value={`₹ ${dueAmount}`}
              readOnly
              style={readonlyStyle}
            />
          </div>

          {/* Enter Amount */}
<div>
  <label style={labelStyle}>Enter Amount *</label>

  <input
    type="number"
    placeholder="Enter amount"
    value={newPaymentAmount}
    onChange={(e) =>
      setNewPaymentAmount(e.target.value)
    }
    style={inputStyle}
  />
</div>
        </div>
      </div>

      {/* Payment Details */}
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          padding: 24,
          marginBottom: 24
        }}
      >
        <h3
          style={{
            margin: "0 0 22px",
            fontSize: 18,
            fontWeight: 700,
            color: "#0f172a"
          }}
        >
          Payment Details
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20
          }}
        >
          <div>
            <label style={labelStyle}>Payment Method *</label>
            <select
  style={inputStyle}
  value={paymentMode}
  onChange={(e) =>
    setPaymentMode(e.target.value)
  }
>
              <option>Select Method</option>
              <option value="CASH">Cash</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Receipt Number</label>
            <input
  value={receiptNumber}
  readOnly
  style={readonlyStyle}
/>
          </div>

          <div style={{ gridColumn: "1 / span 2" }}>
            <label style={labelStyle}>Remarks</label>
            <textarea
  value={remarks}
  onChange={(e) =>
    setRemarks(e.target.value)
  }
              placeholder="Additional notes..."
              style={{
                ...inputStyle,
                height: 110,
                paddingTop: 14,
                resize: "none"
              }}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      
{/* Buttons */}

<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: 14,
    flexWrap: "wrap"
  }}
>

  {/* Download Receipt Button */}
  {receiptNumber && (
    <button
      onClick={handleDownloadReceipt}
      style={{
        padding: "14px 26px",
        borderRadius: 12,
        border: "none",
        background: "#16a34a",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow:
          "0 10px 20px rgba(22,163,74,0.25)"
      }}
    >
      Download Receipt
    </button>
  )}

  {/* Cancel Button */}
  <button
    onClick={() => setShowCollect(false)}
    style={{
      padding: "14px 26px",
      borderRadius: 12,
      border: "1px solid #cbd5e1",
      background: "#fff",
      color: "#334155",
      fontWeight: 700,
      cursor: "pointer"
    }}
  >
    Cancel
  </button>

  {/* Collect Fee Button */}
  <button
    onClick={handleCollectFee}
    style={{
      padding: "14px 26px",
      borderRadius: 12,
      border: "none",
      background: "#2563eb",
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow:
        "0 10px 20px rgba(37,99,235,0.25)"
    }}
  >
    Collect Fee
  </button>

</div>
    </div>
  </div>
)}
    </div>
  );
}
