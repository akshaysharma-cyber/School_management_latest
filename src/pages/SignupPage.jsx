import { useState } from "react";
import InputField from "../components/InputField";
import {
  validateEmail,
  validatePassword,
  validateMobile,
  getPasswordStrength
} from "../utils/validation";

export default function SignupPage({ onNavigate, onSignup }) {

  // ✅ States + Cities
  const statesData = {
    Rajasthan: [
      "Jaipur",
      "Alwar",
      "Bharatpur",
      "Kota",
      "Udaipur",
      "Jodhpur"
    ],
    Haryana: [
      "Gurgaon",
      "Faridabad",
      "Ambala",
      "Hisar"
    ],
    Delhi: [
      "New Delhi",
      "North Delhi",
      "South Delhi"
    ],
    Punjab: [
      "Amritsar",
      "Ludhiana",
      "Patiala"
    ],
    UttarPradesh: [
      "Noida",
      "Ghaziabad",
      "Agra",
      "Lucknow"
    ]
  };

  const states = Object.keys(statesData);

  // ✅ FORM STATE
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    school: "",
    state: "",
    city: "",
    email: "",
    password: "",
    confirm: ""
  });

  // ✅ NOW form EXISTS
  const cities = form.state
    ? statesData[form.state]
    : [];

  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key) => (val) =>
    setForm((f) => ({
      ...f,
      [key]: val
    }));

  // ✅ VALIDATION
  const validate = () => {

    const e = {};

    if (!form.name.trim())
      e.name = "Full name is required";

    const mErr = validateMobile(form.mobile);
    if (mErr)
      e.mobile = mErr;

    if (!form.school.trim())
      e.school = "School name is required";

    if (!form.state)
      e.state = "State is required";

    if (!form.city)
      e.city = "City is required";

    const emailErr = validateEmail(form.email);
    if (emailErr)
      e.email = emailErr;

    const pErr = validatePassword(form.password);
    if (pErr)
      e.password = pErr;

    if (!form.confirm)
      e.confirm = "Please confirm your password";

    else if (form.password !== form.confirm)
      e.confirm = "Passwords do not match";

    if (!agreed)
      e.terms = "You must agree to the terms";

    return e;
  };

  // ✅ SIGNUP
  const handleSignup = async () => {

  const e = validate();

  setErrors(e);

  if (Object.keys(e).length > 0)
    return;

  try {

    setLoading(true);

    // ✅ API CALL
    const response = await fetch(
      "http://localhost:8089/api/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          fullName: form.name,

          mobile: form.mobile,

          email: form.email,

          password: form.password,

          schoolName: form.school,

          city: form.city,

          state: form.state,

          schoolEmail: form.email,

          role: "SCHOOL_ADMIN"

        })
      }
    );

    // ✅ RESPONSE
    const data = await response.json();

    if (!response.ok) {

      throw new Error(
        data.message || "Signup failed"
      );
    }

    console.log("Signup Success:", data);

    setSuccess(true);

    // OPTIONAL LOCAL CALLBACK
    if (onSignup) {

      onSignup({
        mobile: form.mobile,
        password: form.password,
        name: form.name,
        school: form.school,
        state: form.state,
        city: form.city,
        role: "SCHOOL_ADMIN"
      });
    }

  } catch (err) {

    console.error(err);

    alert(err.message);

  } finally {

    setLoading(false);
  }
};

  const strength = getPasswordStrength(form.password);

  // ✅ SUCCESS SCREEN
  if (success) {

    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#e8eeff 0%,#f0f4ff 50%,#e4eaff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Plus Jakarta Sans',sans-serif"
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "56px 48px",
            boxShadow: "0 20px 80px rgba(44,82,200,0.15)",
            textAlign: "center",
            maxWidth: "420px"
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#d4edda",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px"
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2d7a46"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <h2
            style={{
              color: "#0f1f5c",
              fontSize: "24px",
              fontWeight: 800,
              margin: "0 0 8px"
            }}
          >
            Account Created!
          </h2>

          <p
            style={{
              color: "#8898b8",
              fontSize: "15px",
              marginBottom: "28px"
            }}
          >
            Welcome, <strong>{form.name}</strong>!
            Your admin account for
            <strong> {form.school}</strong> is ready.
          </p>

          <button
            onClick={() => onNavigate("login")}
            style={{
              background:
                "linear-gradient(135deg,#3b5bdb,#2d4fd6)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "13px 32px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ✅ MAIN SCREEN
  return (
    <>
      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *{
          box-sizing:border-box;
        }

        .sw{
          min-height:100vh;
          background:linear-gradient(135deg,#e8eeff 0%,#f0f4ff 50%,#e4eaff 100%);
          display:flex;
          align-items:center;
          justify-content:center;
          padding:20px;
          font-family:'Plus Jakarta Sans',sans-serif;
        }

        .sc{
          width:100%;
          max-width:960px;
          background:#fff;
          border-radius:28px;
          box-shadow:0 20px 80px rgba(44,82,200,0.15);
          display:flex;
          overflow:hidden;
        }

        .sl2{
          width:38%;
          background:linear-gradient(180deg,#3056d3,#1e3ea8);
          color:#fff;
          padding:40px 32px;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
        }

        .sr2{
          flex:1;
          padding:40px 48px;
        }

        .sr2 h1{
          font-size:28px;
          font-weight:800;
          color:#0f1f5c;
          margin-bottom:6px;
        }

        .sub{
          color:#8898b8;
          font-size:14px;
          margin-bottom:28px;
        }

        .grid2{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:20px;
        }

        .select-box{
          width:100%;
          height:52px;
          border:1px solid #d6deeb;
          border-radius:14px;
          padding:0 14px;
          font-size:14px;
          outline:none;
          background:#fff;
        }

        .sgbtn{
          width:100%;
          padding:15px;
          background:linear-gradient(135deg,#3b5bdb,#2d4fd6);
          color:#fff;
          border:none;
          border-radius:14px;
          font-size:15px;
          font-weight:700;
          cursor:pointer;
          margin-top:10px;
        }

        .sgbtn:disabled{
          opacity:0.6;
          cursor:not-allowed;
        }

        @media(max-width:680px){

          .sl2{
            display:none;
          }

          .sr2{
            padding:32px 24px;
          }

          .grid2{
            grid-template-columns:1fr;
            gap:0;
          }
        }

      `}</style>

      <div className="sw">

        <div className="sc">

          {/* LEFT */}
          <div className="sl2">

            <div>
              <SchoolSVG/>
            </div>

            <div>
              <h2
                style={{
                  fontSize:"28px",
                  fontWeight:800,
                  marginBottom:"14px"
                }}
              >
                School Management System
              </h2>

              <p
                style={{
                  opacity:0.9,
                  lineHeight:1.8,
                  fontSize:"14px"
                }}
              >
                Manage students, attendance,
                exams, fees and results
                in one platform.
              </p>
            </div>

          </div>

          {/* RIGHT */}
          <div className="sr2">

            <h1>Create Admin Account</h1>

            <p className="sub">
              Sign up to get started
            </p>

            <div className="grid2">

              <InputField
                label="Full Name"
                placeholder="Enter Full Name"
                value={form.name}
                onChange={set("name")}
                error={errors.name}
                icon={<PersonIcon/>}
                required
              />

              <InputField
                label="Mobile Number"
                type="tel"
                placeholder="Enter Mobile Number"
                value={form.mobile}
                onChange={set("mobile")}
                error={errors.mobile}
                icon={<PhoneIcon/>}
                required
              />

            </div>

            <InputField
              label="School Name"
              placeholder="Enter School Name"
              value={form.school}
              onChange={set("school")}
              error={errors.school}
              icon={<BuildingIcon/>}
              required
            />

            {/* STATE + CITY */}
            <div className="grid2">

              {/* STATE */}
              <div style={{marginBottom:"18px"}}>

                <label
                  style={{
                    display:"block",
                    marginBottom:"8px",
                    fontWeight:600,
                    fontSize:"14px"
                  }}
                >
                  State *
                </label>

                <select
                  value={form.state}
                  onChange={(e)=>
                    setForm(f=>({
                      ...f,
                      state:e.target.value,
                      city:""
                    }))
                  }
                  className="select-box"
                >
                  <option value="">
                    Select State
                  </option>

                  {states.map(state=>(
                    <option
                      key={state}
                      value={state}
                    >
                      {state}
                    </option>
                  ))}

                </select>

                {errors.state && (
                  <p
                    style={{
                      color:"#e53e3e",
                      fontSize:"12px",
                      marginTop:"5px"
                    }}
                  >
                    {errors.state}
                  </p>
                )}

              </div>

              {/* CITY */}
              <div style={{marginBottom:"18px"}}>

                <label
                  style={{
                    display:"block",
                    marginBottom:"8px",
                    fontWeight:600,
                    fontSize:"14px"
                  }}
                >
                  City *
                </label>

                <select
                  value={form.city}
                  onChange={(e)=>set("city")(e.target.value)}
                  disabled={!form.state}
                  className="select-box"
                >
                  <option value="">
                    Select City
                  </option>

                  {cities.map(city=>(
                    <option
                      key={city}
                      value={city}
                    >
                      {city}
                    </option>
                  ))}

                </select>

                {errors.city && (
                  <p
                    style={{
                      color:"#e53e3e",
                      fontSize:"12px",
                      marginTop:"5px"
                    }}
                  >
                    {errors.city}
                  </p>
                )}

              </div>

            </div>

            <InputField
              label="Email Address"
              type="email"
              placeholder="Enter Email Address"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
              icon={<MailIcon/>}
              required
            />

            <InputField
              label="Create Password"
              type="password"
              placeholder="Create Password"
              value={form.password}
              onChange={set("password")}
              error={errors.password}
              icon={<LockIcon/>}
              required
            />

            {/* PASSWORD STRENGTH */}
            {form.password && (

              <div
                style={{
                  marginTop:"-10px",
                  marginBottom:"16px"
                }}
              >

                <div
                  style={{
                    display:"flex",
                    gap:"4px",
                    marginBottom:"5px"
                  }}
                >
                  {[1,2,3,4,5].map(i=>(
                    <div
                      key={i}
                      style={{
                        flex:1,
                        height:"4px",
                        borderRadius:"4px",
                        background:
                          i <= strength.score
                          ? strength.color
                          : "#e2e8f0"
                      }}
                    />
                  ))}
                </div>

                <span
                  style={{
                    fontSize:"12px",
                    color:strength.color,
                    fontWeight:600
                  }}
                >
                  {strength.label}
                </span>

              </div>
            )}

            <InputField
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={set("confirm")}
              error={errors.confirm}
              icon={<LockIcon/>}
              required
            />

            {/* TERMS */}
            <div
              style={{
                display:"flex",
                alignItems:"center",
                gap:"10px",
                marginBottom:"20px"
              }}
            >

              <input
                type="checkbox"
                checked={agreed}
                onChange={(e)=>setAgreed(e.target.checked)}
              />

              <span
                style={{
                  fontSize:"14px",
                  color:"#4a5568"
                }}
              >
                I agree to Terms & Conditions
              </span>

            </div>

            {errors.terms && (
              <p
                style={{
                  color:"#e53e3e",
                  fontSize:"12px",
                  marginBottom:"10px"
                }}
              >
                {errors.terms}
              </p>
            )}

            {/* BUTTON */}
            <button
              className="sgbtn"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Sign Up"}
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

// ICONS

function SchoolSVG(){
  return(
    <div
      style={{
        width:"72px",
        height:"72px",
        borderRadius:"50%",
        background:"rgba(255,255,255,0.15)",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        fontSize:"30px"
      }}
    >
      🏫
    </div>
  );
}

function PersonIcon(){return <span>👤</span>}
function PhoneIcon(){return <span>📱</span>}
function BuildingIcon(){return <span>🏫</span>}
function MailIcon(){return <span>✉️</span>}
function LockIcon(){return <span>🔒</span>}