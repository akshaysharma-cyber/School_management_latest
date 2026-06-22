import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { apiFetch } from "../utils/apiFetch";
const API_URL = import.meta.env.VITE_API_URL;

export default function ReportCardsPage({ onBack }) {

    const reportRef = useRef(null);


    const [academicYear, setAcademicYear] = useState("");
    //const [className, setClassName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [students, setStudents] = useState([]);
    const [report, setReport] = useState(null);
    const [selectedClass, setSelectedClass] = useState("");

    const YEARS = [
        "2026-2027",
        "2025-2026",
        "2024-2025"
    ];

    const CLASSES = [
        "1", "2", "3", "4", "5",
        "6", "7", "8", "9", "10"
    ];

    const examTypes = [
        ...new Set(
            report?.subjects?.flatMap(
                subject =>
                    subject.exams.map(
                        exam => exam.examType
                    )
            ) || []
        )
    ];

    useEffect(() => {

        if (!selectedClass) {
            setStudents([]);
            return;
        }

        const fetchStudents = async () => {

            try {

                const user =
                    JSON.parse(
                        localStorage.getItem("user")
                    );

                const schoolId =
                    user?.schoolId;

                const res = await apiFetch(
                    `${API_URL}/api/students/by-class/${schoolId}/${selectedClass}`
                );

                const data =
                    await res.json();

                console.log("Students =", data);

                setStudents(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                console.log(err);

                setStudents([]);

            }

        };

        fetchStudents();

    }, [selectedClass]);

    const loadReport = async () => {

        if (
            !academicYear ||
            !selectedClass ||
            !studentId
        ) {
            alert(
                "Please select Academic Year, Class and Student"
            );
            return;
        }

        try {

            const user =
                JSON.parse(localStorage.getItem("user"));

            const res = await apiFetch(
                `${API_URL}/api/report-card/student?schoolId=${user.schoolId}&studentId=${studentId}&academicYear=${academicYear}&className=${selectedClass}`
            );

            if (!res.ok) {
                throw new Error("Report not found");
            }

            const data =
                await res.json();

            console.log("Report =", data);

            setReport(data);

        }
        catch (err) {

            console.log(err);

            alert("Unable to load report");

        }

    };

    const downloadPDF = async () => {

        try {

            const button =
                document.querySelector(".no-print");

            if (button) {
                button.style.display = "none";
            }

            await new Promise(
                r => setTimeout(r, 100)
            );

            const canvas =
                await html2canvas(
                    reportRef.current,
                    {
                        scale: 1
                    }
                );

            if (button) {
                button.style.display = "block";
            }

            const imgData =
                canvas.toDataURL(
                    "image/png"
                );

            const pdf =
                new jsPDF(
                    "p",
                    "mm",
                    "a4"
                );

            const width =
                pdf.internal.pageSize.getWidth();

            const pageHeight =
                pdf.internal.pageSize.getHeight();

            const imgHeight =
                (canvas.height * width) /
                canvas.width;

            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                width,
                Math.min(imgHeight, pageHeight)
            );

            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                width,
                imgHeight
            );

            pdf.save(
                `${report.studentName}_ReportCard.pdf`
            );

        }
        catch (err) {

            document
                .querySelector(".no-print")
                ?.style &&
                (
                    document.querySelector(
                        ".no-print"
                    ).style.display = "block"
                );

            console.log(err);

            alert(
                "PDF generation failed"
            );

        }

    };

    return (
        <div>

            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 25
                }}
            >

                <div>
                    <h2
                        style={{
                            margin: 0,
                            color: "#1a2744"
                        }}
                    >
                        Student Report Card
                    </h2>

                    <p style={{ color: "#8898b8" }}>
                        Download complete student report
                    </p>
                </div>

                <button
                    onClick={onBack}
                    style={btnSecondary}
                >
                    ← Back
                </button>

            </div>

            {/* Filters */}

            <div style={card}>

                <div style={grid}>

                    <Select
                        title="Academic Year"
                        value={academicYear}
                        setValue={setAcademicYear}
                        options={YEARS}
                    />

                    <div>

                        <label style={label}>
                            Class
                        </label>

                        <select
                            value={selectedClass}
                            onChange={(e) => {

                                setSelectedClass(
                                    e.target.value
                                );

                                setStudentId("");

                            }}

                            style={input}

                        >

                            <option value="">
                                Select Class
                            </option>

                            {CLASSES.map((cls) => (

                                <option
                                    key={cls}
                                    value={cls}
                                >

                                    Class {cls}

                                </option>

                            ))}

                        </select>

                    </div>

                    <div>

                        <label style={label}>
                            Student
                        </label>

                        <select
                            value={studentId}
                            onChange={(e) =>
                                setStudentId(e.target.value)
                            }
                            style={input}
                        >

                            <option value="">
                                Select Student
                            </option>

                            {
                                students.map(s => (
                                    <option
                                        key={s.id}
                                        value={s.id}
                                    >
                                        {s.fullName}
                                    </option>
                                ))
                            }

                        </select>

                    </div>

                    <button
                        onClick={loadReport}
                        style={btn}
                    >
                        Generate
                    </button>

                </div>

            </div>


            {
                report && (
                    <div
                        ref={reportRef}
                        style={card}
                    >

                        <div
                            style={{
                                textAlign: "center",
                                marginBottom: "25px"
                            }}
                        >
                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: "28px",
                                    fontWeight: "700",
                                    color: "#1E3A8A"
                                }}
                            >
                                {report.schoolName}
                            </h1>

                            <div
                                style={{
                                    marginTop: "6px",
                                    color: "#64748B",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}
                            >
                                {report.district}, {report.state}
                            </div>

                            <h2
                                style={{
                                    marginTop: "20px",
                                    marginBottom: "8px",
                                    color: "#0F172A",
                                    fontWeight: "700"
                                }}
                            >
                                ANNUAL REPORT CARD
                            </h2>
                            <div
                                style={{
                                    color: "#EA580C",
                                    fontSize: "16px",
                                    fontWeight: "600"
                                }}
                            >
                                Academic Year : {academicYear}
                            </div>
                        </div>




                        {/* Student */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: "20px"
                            }}
                        >

                            <div>

                                <h2
                                    style={{
                                        color: "#334155",
                                        fontSize: "24px",
                                        fontWeight: "700",
                                        marginBottom: "12px"
                                    }}
                                >
                                  Name : {report.studentName}
                                </h2>

                                <p
                                    style={{
                                        color: "#334155",
                                        fontWeight: "600",
                                        margin: "4px 0"
                                    }}
                                >
                                    Class : {report.className}
                                </p>

                                <p
                                    style={{
                                        color: "#334155",
                                        fontWeight: "600",
                                        margin: "4px 0"
                                    }}
                                >
                                    Roll No : {report.rollNumber}
                                </p>

                            </div>

                            <div className="no-print">

                                <button
                                    style={btn}
                                    onClick={downloadPDF}
                                >
                                    Download PDF
                                </button>

                            </div>

                        </div>

                        <hr
                            style={{
                                border: "none",
                                borderTop: "1px solid #d7dbea",
                                margin: "10px 0 25px"
                            }}
                        />

                        {/* Table */}

                        <table style={table}>

                            <thead>

                                <tr>

                                    <th style={cell}>
                                        Subject
                                    </th>

                                    {examTypes.map(exam => (

                                        <th
                                            key={exam}
                                            style={cell}
                                        >
                                            {exam}
                                        </th>

                                    ))}

                                    <th style={cell}>
                                        Total
                                    </th>

                                    <th style={cell}>
                                        %
                                    </th>

                                    <th style={cell}>
                                        Grade
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    report.subjects?.map(
                                        (subject, index) => (

                                            <tr
                                                key={index}
                                                style={{
                                                    borderBottom:
                                                        "1px solid #eceff7"
                                                }}
                                            >

                                                <td style={cell}>
                                                    {subject.subject}
                                                </td>

                                                {
                                                    examTypes.map(type => {

                                                        const exam =
                                                            subject.exams.find(
                                                                e =>
                                                                    e.examType === type
                                                            );

                                                        return (

                                                            <td
                                                                key={type}
                                                                style={cell}
                                                            >

                                                                {
                                                                    exam
                                                                        ? `${exam.obtained}/${exam.maxMarks}`
                                                                        : "-"
                                                                }

                                                            </td>

                                                        );

                                                    })
                                                }

                                                <td style={cell}>

                                                    {subject.totalObtained}
                                                    /
                                                    {subject.totalMax}

                                                </td>

                                                <td style={cell}>
                                                    {subject.percentage.toFixed(2)}%
                                                </td>

                                                <td style={cell}>
                                                    {subject.grade}
                                                </td>

                                            </tr>

                                        )
                                    )
                                }

                            </tbody>

                        </table>

                        <div
                            style={{
                                marginTop: 30,
                                display: "flex",
                                gap: 20
                            }}
                        >

                            <Summary
                                label="Total"
                                value={report.total}
                                color="#2563EB"
                            />

                            <Summary
                                label="Obtained"
                                value={report.obtained}
                                color="#059669"
                            />

                            <Summary
                                label="Percentage"
                                value={`${report.percentage}%`}
                                color="#EA580C"
                            />

                            <Summary
                                label="Grade"
                                value={report.grade}
                                color="#7C3AED"
                            />

                        </div>

                        <div
                            style={{
                                marginTop: "30px",
                                paddingTop: "12px",
                                borderTop: "1px solid #e2e8f0",
                                fontSize: "12px",
                                color: "#64748B",
                                textAlign: "center",
                                lineHeight: "1.6"
                            }}
                        >
                            <strong>Disclaimer:</strong> This is a computer-generated report card and
                            does not require a physical signature. In case of any discrepancy,
                            please contact the school administration.
                        </div>

                        

                    </div>

                )
            }

        </div>
    );
}


function Select({
    title,
    value,
    setValue,
    options
}) {

    return (
        <div>

            <label style={label}>
                {title}
            </label>

            <select
                value={value}
                onChange={(e) =>
                    setValue(e.target.value)
                }
                style={input}
            >

                <option>
                    Select
                </option>

                {
                    options.map(v => (
                        <option key={v}>
                            {v}
                        </option>
                    ))
                }

            </select>

        </div>
    );
}

function Summary({
    label,
    value,
    color = "#24324a"
}) {
    return (
        <div
            style={{
                background: "#f5f7ff",
                padding: 20,
                borderRadius: 14,
                minWidth: 150,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
        >
            <div
                style={{
                    color: "#8898b8"
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color
                }}
            >
                {value}
            </div>
        </div>
    );
}

const card = {
    background: "#fff",
    padding: 30,
    borderRadius: 0,
    marginBottom: 20
};

const grid = {
    display: "grid",
    gridTemplateColumns:
        "1fr 1fr 1fr 220px",
    gap: "24px",
    alignItems: "end"
};

const label = {
    display: "block",
    marginBottom: 8
};

const input = {
    width: "100%",
    height: "52px",
    padding: "0 16px",
    borderRadius: "14px",
    border: "1px solid #d7dbea",
    background: "#fff",
    fontSize: "15px",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box"
};

const btn = {
    width: "100%",
    height: "52px",
    marginTop: "24px",
    background: "#4361ee",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    cursor: "pointer"
};

const btnSecondary = {
    padding: "10px 16px",
    borderRadius: 12,
    border: "1px solid #ddd",
    background: "#fff"
};

const table = {
    width: "100%",

    marginTop: 30,

    borderCollapse: "collapse",

    background: "#fff"
};
const cell = {

    padding: "16px",

    textAlign: "center",

    fontSize: "15px",

    color: "#24324a"

};
