# School Management System

A React-based login/signup UI for a School Management System.

## Project Structure

```
school-mgmt/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   └── InputField.jsx       # Reusable input with icon, validation, password toggle
    ├── pages/
    │   ├── LoginPage.jsx        # Login with mobile + password
    │   ├── SignupPage.jsx       # Admin signup with all fields
    │   └── Dashboard.jsx        # Post-login dashboard
    └── utils/
        └── validation.js        # Email, password, mobile validators
```

## Setup & Run

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Demo Login Credentials

- **Mobile:** 9876543210  
- **Password:** Admin@123

## Features

- ✅ Login page matching the design
- ✅ Signup page with all fields
- ✅ Email validation (format check)
- ✅ Strong password validation (uppercase, lowercase, number, special char, min 8 chars)
- ✅ Mobile number validation (10 digits)
- ✅ Password strength meter (5 levels)
- ✅ Password confirm matching
- ✅ Terms & conditions checkbox
- ✅ Show/hide password toggle
- ✅ Loading states on buttons
- ✅ Success screen after signup
- ✅ Dashboard after login
- ✅ Logout functionality

## Password Requirements

Passwords must have:
- At least 8 characters
- One uppercase letter (A-Z)
- One lowercase letter (a-z)
- One number (0-9)
- One special character (!@#$%^&*)
