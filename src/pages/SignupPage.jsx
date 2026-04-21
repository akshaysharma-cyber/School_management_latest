import { useState } from "react";
import InputField from "../components/InputField";
import { validateEmail, validatePassword, validateMobile, getPasswordStrength } from "../utils/validation";

export default function SignupPage({ onNavigate, onSignup }) {
  const [form, setForm] = useState({ name:"", mobile:"", school:"", email:"", password:"", confirm:"" });
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key) => (val) => setForm(f=>({...f,[key]:val}));

  const validate = () => {
    const e = {};
    if(!form.name.trim()) e.name="Full name is required";
    const mErr=validateMobile(form.mobile); if(mErr) e.mobile=mErr;
    if(!form.school.trim()) e.school="School name is required";
    const emailErr=validateEmail(form.email); if(emailErr) e.email=emailErr;
    const pErr=validatePassword(form.password); if(pErr) e.password=pErr;
    if(!form.confirm) e.confirm="Please confirm your password";
    else if(form.password!==form.confirm) e.confirm="Passwords do not match";
    if(!agreed) e.terms="You must agree to the terms";
    return e;
  };

  const handleSignup = () => {
    const e=validate(); setErrors(e);
    if(Object.keys(e).length>0) return;
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      setSuccess(true);
      if(onSignup) onSignup({ mobile: form.mobile, password: form.password, name: form.name, school: form.school, role: "Admin" });
    },1000);
  };

  const strength=getPasswordStrength(form.password);

  if(success){
    return(
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#e8eeff 0%,#f0f4ff 50%,#e4eaff 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
        <div style={{background:"#fff",borderRadius:"24px",padding:"56px 48px",boxShadow:"0 20px 80px rgba(44,82,200,0.15)",textAlign:"center",maxWidth:"420px"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"#d4edda",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2d7a46" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{color:"#0f1f5c",fontSize:"24px",fontWeight:800,margin:"0 0 8px"}}>Account Created!</h2>
          <p style={{color:"#8898b8",fontSize:"15px",marginBottom:"28px"}}>Welcome, <strong>{form.name}</strong>! Your admin account for <strong>{form.school}</strong> is ready. You can now login with your mobile number and password.</p>
          <button onClick={()=>onNavigate("login")} style={{background:"linear-gradient(135deg,#3b5bdb,#2d4fd6)",color:"#fff",border:"none",borderRadius:"12px",padding:"13px 32px",fontSize:"15px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 6px 20px rgba(59,91,219,0.35)"}}>Go to Login</button>
        </div>
      </div>
    );
  }

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .sw { min-height:100vh; background:linear-gradient(135deg,#e8eeff 0%,#f0f4ff 50%,#e4eaff 100%); display:flex; align-items:center; justify-content:center; font-family:'Plus Jakarta Sans',sans-serif; padding:20px; }
        .sc { width:100%; max-width:960px; background:#fff; border-radius:28px; box-shadow:0 20px 80px rgba(44,82,200,0.15),0 4px 20px rgba(0,0,0,0.06); display:flex; overflow:hidden; }
        .sl2 { width:38%; position:relative; overflow:hidden; flex-shrink:0; min-height:600px; }
        .sl2-bg { position:absolute; inset:0; background-image:url('https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&q=80'); background-size:cover; background-position:center top; }
        .sl2-ov { position:absolute; inset:0; background:linear-gradient(180deg,rgba(20,50,170,0.5) 0%,rgba(12,32,120,0.82) 60%,rgba(8,22,100,0.95) 100%); }
        .sl2-con { position:relative; z-index:2; height:100%; display:flex; flex-direction:column; justify-content:space-between; padding:36px 32px; }
        .slc2 { width:72px; height:72px; border-radius:50%; background:rgba(255,255,255,0.18); backdrop-filter:blur(8px); border:1.5px solid rgba(255,255,255,0.3); display:flex; align-items:center; justify-content:center; }
        .slt h2 { color:#fff; font-size:22px; font-weight:800; margin:0 0 10px; line-height:1.35; letter-spacing:-0.3px; }
        .slt p { color:rgba(255,255,255,0.75); font-size:13.5px; line-height:1.7; margin:0 0 22px; }
        .feat { display:flex; flex-direction:column; gap:10px; }
        .feat-item { display:flex; align-items:center; gap:10px; }
        .feat-dot { width:28px; height:28px; border-radius:8px; background:rgba(255,255,255,0.15); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .feat-item span { color:rgba(255,255,255,0.85); font-size:13px; font-weight:500; }
        .sr2 { flex:1; padding:40px 48px; overflow-y:auto; }
        .sr2 h1 { font-size:28px; font-weight:800; color:#0f1f5c; margin:0 0 6px; letter-spacing:-0.5px; }
        .sr2 .sub { color:#8898b8; font-size:14px; margin:0 0 28px; }
        .sgbtn { width:100%; padding:15px; background:linear-gradient(135deg,#3b5bdb,#2d4fd6); color:#fff; border:none; border-radius:14px; font-size:15.5px; font-weight:700; cursor:pointer; transition:all 0.2s; font-family:inherit; letter-spacing:0.3px; box-shadow:0 6px 20px rgba(59,91,219,0.35); }
        .sgbtn:hover:not(:disabled){background:linear-gradient(135deg,#2d4fd6,#2240c0);box-shadow:0 8px 24px rgba(59,91,219,0.45);transform:translateY(-1px)}
        .sgbtn:disabled{opacity:0.65;cursor:not-allowed}
        @media(max-width:680px){.sl2{display:none}.sc{max-width:520px}.sr2{padding:36px 28px}}
      `}</style>
      <div className="sw">
        <div className="sc">
          <div className="sl2">
            <div className="sl2-bg"/>
            <div className="sl2-ov"/>
            <div className="sl2-con">
              <div className="slc2"><SchoolSVG/></div>
              <div className="slt">
                <h2>School Management System</h2>
                <p>Everything you need to run your school — in one powerful dashboard.</p>
                <div className="feat">
                  {[["📊","Student Analytics"],["📅","Attendance Tracking"],["📝","Exam Management"],["💳","Fee Collection"]].map(([ic,tx])=>(
                    <div className="feat-item" key={tx}>
                      <div className="feat-dot"><span style={{fontSize:"13px"}}>{ic}</span></div>
                      <span>{tx}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="sr2">
            <h1>Create Admin Account</h1>
            <p className="sub">Sign up to get started with your School Management System</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>
              <InputField label="Full Name" placeholder="Enter Full Name" value={form.name} onChange={set("name")} error={errors.name} icon={<PersonIcon/>} required/>
              <InputField label="Mobile Number" type="tel" placeholder="Enter Mobile Number" value={form.mobile} onChange={set("mobile")} error={errors.mobile} icon={<PhoneIcon/>} required/>
            </div>
            <InputField label="School Name" placeholder="Enter School Name" value={form.school} onChange={set("school")} error={errors.school} icon={<BuildingIcon/>} required/>
            <InputField label="Email Address" type="email" placeholder="Enter Email Address" value={form.email} onChange={set("email")} error={errors.email} icon={<MailIcon/>} required/>
            <InputField label="Create Password" type="password" placeholder="Create Password" value={form.password} onChange={set("password")} error={errors.password} icon={<LockIcon/>} required/>
            {form.password&&(
              <div style={{marginTop:"-10px",marginBottom:"16px"}}>
                <div style={{display:"flex",gap:"4px",marginBottom:"5px"}}>
                  {[1,2,3,4,5].map(i=>(<div key={i} style={{flex:1,height:"4px",borderRadius:"4px",background:i<=strength.score?strength.color:"#e2e8f0",transition:"background 0.3s"}}/>))}
                </div>
                <span style={{fontSize:"12px",color:strength.color,fontWeight:600}}>{strength.label}</span>
              </div>
            )}
            <InputField label="Confirm Password" type="password" placeholder="Confirm Password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} icon={<LockIcon/>} required/>
            <div style={{display:"flex",alignItems:"flex-start",gap:"10px",marginBottom:"20px"}}>
              <input type="checkbox" id="terms" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:"2px",accentColor:"#3b5bdb",width:16,height:16,cursor:"pointer"}}/>
              <label htmlFor="terms" style={{fontSize:"14px",color:"#4a5568",cursor:"pointer",lineHeight:1.5}}>
                I agree to the{" "}<button onClick={()=>alert("Terms & Conditions")} style={{background:"none",border:"none",color:"#3b5bdb",fontWeight:600,cursor:"pointer",fontSize:"14px",padding:0}}>Terms &amp; Conditions</button>{" "}and{" "}<button onClick={()=>alert("Privacy Policy")} style={{background:"none",border:"none",color:"#3b5bdb",fontWeight:600,cursor:"pointer",fontSize:"14px",padding:0}}>Privacy Policy</button>
              </label>
            </div>
            {errors.terms&&<p style={{color:"#e53e3e",fontSize:"12px",marginTop:"-14px",marginBottom:"12px"}}>{errors.terms}</p>}
            <button className="sgbtn" onClick={handleSignup} disabled={loading}>{loading?"Creating Account...":"Sign Up"}</button>
            <p style={{textAlign:"center",color:"#8898b8",fontSize:"13.5px",marginTop:"18px"}}>
              Already have an account?{" "}<button onClick={()=>onNavigate("login")} style={{background:"none",border:"none",color:"#3b5bdb",fontWeight:700,cursor:"pointer",fontSize:"13.5px",padding:0,fontFamily:"inherit"}}>Login Here</button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function SchoolSVG(){return(<svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" opacity="0.25"/><path d="M3 9.5L12 3l9 6.5" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><rect x="9" y="12" width="6" height="9" rx="1" fill="white"/><rect x="5" y="10" width="4" height="4" rx="0.5" fill="white" opacity="0.7"/><rect x="15" y="10" width="4" height="4" rx="0.5" fill="white" opacity="0.7"/></svg>);}
function PersonIcon(){return<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;}
function PhoneIcon(){return<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>;}
function BuildingIcon(){return<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;}
function MailIcon(){return<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;}
function LockIcon(){return<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;}
