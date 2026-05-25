import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

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

                const res =
                    await fetch(
                        `http://localhost:8089/api/students/by-class/${schoolId}/${selectedClass}`
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

        if (!studentId) {
            alert("Select Student");
            return;
        }

        try {

            const res =
                await fetch(
                    `http://localhost:8089/api/report-card/student/${studentId}`
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
                    scale: 2
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

        const height =
            canvas.height
            * width
            / canvas.width;

        pdf.addImage(
            imgData,
            "PNG",
            0,
            0,
            width,
            height
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

                        {/* Student */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between"
                            }}
                        >

                            <div>

                                <h2>
                                    {report.studentName}
                                </h2>

                                <p>
                                    Class :
                                    {report.className}
                                </p>

                                <p>
                                    Roll :
                                    {report.rollNumber}
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

                        <hr />

                        {/* Table */}

                        <table style={table}>

                            <thead>

                                <tr>

                                    <th style={cell}>
                                        Subject
                                    </th>

                                    <th style={cell}>
                                        Total
                                    </th>

                                    <th style={cell}>
                                        Obtained
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
                                    report.subjects?.map((x, index) => (

                                        <tr
                                            key={index}
                                            style={{
                                                borderBottom:
                                                    "1px solid #eceff7"
                                            }}
                                        >

                                            <td style={cell}>
                                                {x.subject}
                                            </td>

                                            <td style={cell}>
                                                {x.total}
                                            </td>

                                            <td style={cell}>
                                                {x.obtained}
                                            </td>

                                            <td style={cell}>
                                                {x.percentage}%
                                            </td>

                                            <td style={cell}>
                                                {x.grade}
                                            </td>

                                        </tr>

                                    ))
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
                            />

                            <Summary
                                label="Percentage"
                                value={`${report.percentage}%`}
                            />

                            <Summary
                                label="Grade"
                                value={report.grade}
                            />

                            <Summary
                                label="Rank"
                                value={report.rank}
                            />

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
    value
}) {

    return (
        <div
            style={{
                background: "#f5f7ff",
                padding: 20,
                borderRadius: 14,
                minWidth: 150
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
                    fontWeight: 700
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
    borderRadius: 20,
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
