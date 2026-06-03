export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!re.test(email)) return "Enter a valid email address";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8) return "At least 8 characters required";
  if (!/[A-Z]/.test(password)) return "Must include an uppercase letter";
  if (!/[a-z]/.test(password)) return "Must include a lowercase letter";
  if (!/[0-9]/.test(password)) return "Must include a number";
  if (!/[!@#$%^&*]/.test(password)) return "Must include a special character (!@#$%^&*)";
  return null;
}

export function validateMobile(mobile) {
  if (!mobile) return "Mobile number is required";
  if (!/^\d{10}$/.test(mobile.replace(/\s/g, ""))) return "Enter a valid 10-digit mobile number";
  return null;
}

export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*]/.test(password)) score++;
  const levels = [
    { label: "Very weak", color: "#e53e3e" },
    { label: "Weak", color: "#dd6b20" },
    { label: "Fair", color: "#d69e2e" },
    { label: "Good", color: "#38a169" },
    { label: "Strong", color: "#2b6cb0" },
  ];
  return { score, label: levels[score - 1]?.label || "", color: levels[score - 1]?.color || "" };
}

export function validateExamName(examName) {
  if (!examName || !examName.trim()) {
    return "Exam Name is required";
  }
  return null;
}

export function validateAcademicYear(academicYear) {
  if (!academicYear) {
    return "Academic Year is required";
  }
  return null;
}

export function validateExamType(examType) {
  if (!examType) {
    return "Exam Type is required";
  }
  return null;
}

export function validateClass(selectedClass) {
  if (!selectedClass) {
    return "Class is required";
  }
  return null;
}

export function validateSubjects(subjects) {
  if (!subjects || subjects.length === 0) {
    return "Select at least one subject";
  }
  return null;
}

export function validatePassingPercentage(value) {
  const percentage = Number(value);

  if (isNaN(percentage)) {
    return "Passing Percentage is required";
  }

  if (percentage < 1 || percentage > 100) {
    return "Passing Percentage must be between 1 and 100";
  }

  return null;
}

export function validateExamDates(startDate, endDate) {
  if (!startDate) {
    return "Start Date is required";
  }

  if (!endDate) {
    return "End Date is required";
  }

  if (new Date(startDate) > new Date(endDate)) {
    return "Start Date cannot be after End Date";
  }

  return null;
}
