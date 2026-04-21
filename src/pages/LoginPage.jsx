import { useState } from "react";
import InputField from "../components/InputField";
import { validateMobile, validatePassword } from "../utils/validation";

export default function LoginPage({ onNavigate, onLogin, registeredUsers }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const validate = () => {
    const e = {};
    const mErr = validateMobile(mobile);
    const pErr = validatePassword(password);
    if (mErr) e.mobile = mErr;
    if (pErr) e.password = pErr;
    return e;
  };

  const handleLogin = () => {
    const e = validate();
    setErrors(e);
    setAuthError("");
    if (Object.keys(e).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      const found = (registeredUsers || []).find(u => u.mobile === mobile && u.password === password);
      setLoading(false);
      if (found) { onLogin(found); } else { setAuthError("Invalid mobile number or password. Please check your credentials."); }
    }, 900);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .lw { min-height:100vh; background:linear-gradient(135deg,#e8eeff 0%,#f0f4ff 50%,#e4eaff 100%); display:flex; align-items:center; justify-content:center; font-family:'Plus Jakarta Sans',sans-serif; padding:20px; }
        .lc { width:100%; max-width:960px; background:#fff; border-radius:28px; box-shadow:0 20px 80px rgba(44,82,200,0.15),0 4px 20px rgba(0,0,0,0.06); display:flex; overflow:hidden; }
        .ll { width:38%; position:relative; overflow:hidden; flex-shrink:0; min-height:600px; }
        .ll-bg { position:absolute; inset:0; background-image:url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80'); background-size:cover; background-position:center; }
        .ll-ov { position:absolute; inset:0; background:linear-gradient(180deg,rgba(20,50,170,0.5) 0%,rgba(12,32,120,0.82) 60%,rgba(8,22,100,0.95) 100%); }
        .ll-con { position:relative; z-index:2; height:100%; display:flex; flex-direction:column; justify-content:space-between; padding:36px 32px; }
        .slc { width:72px; height:72px; border-radius:50%; background:rgba(255,255,255,0.18); backdrop-filter:blur(8px); border:1.5px solid rgba(255,255,255,0.3); display:flex; align-items:center; justify-content:center; }
        .lbt h2 { color:#fff; font-size:22px; font-weight:800; margin:0 0 10px; line-height:1.35; letter-spacing:-0.3px; }
        .lbt p { color:rgba(255,255,255,0.75); font-size:13.5px; line-height:1.7; margin:0 0 22px; }
        .feat { display:flex; flex-direction:column; gap:10px; }
        .feat-item { display:flex; align-items:center; gap:10px; }
        .feat-dot { width:28px; height:28px; border-radius:8px; background:rgba(255,255,255,0.15); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .feat-item span { color:rgba(255,255,255,0.85); font-size:13px; font-weight:500; }
        .lr { flex:1; padding:40px 48px; overflow-y:auto; display:flex; flex-direction:column; justify-content:center; }
        .lh { margin-bottom:28px; }
        .lh h1 { font-size:28px; font-weight:800; color:#0f1f5c; margin:0 0 6px; letter-spacing:-0.5px; }
        .lh p { color:#8898b8; font-size:14px; margin:0; }
        .aerr { background:#fff5f5; border:1.5px solid #fecaca; border-radius:12px; padding:12px 16px; color:#c53030; font-size:13.5px; margin-bottom:18px; display:flex; align-items:center; gap:8px; }
        .fb { background:none; border:none; color:#3b5bdb; font-size:13.5px; font-weight:600; cursor:pointer; padding:0; font-family:inherit; }
        .lbtn { width:100%; padding:15px; background:linear-gradient(135deg,#3b5bdb 0%,#2d4fd6 100%); color:#fff; border:none; border-radius:14px; font-size:15.5px; font-weight:700; cursor:pointer; transition:all 0.2s; letter-spacing:0.3px; font-family:inherit; box-shadow:0 6px 20px rgba(59,91,219,0.35); }
        .lbtn:hover:not(:disabled) { background:linear-gradient(135deg,#2d4fd6 0%,#2240c0 100%); box-shadow:0 8px 24px rgba(59,91,219,0.45); transform:translateY(-1px); }
        .lbtn:active:not(:disabled) { transform:translateY(0) scale(0.99); }
        .lbtn:disabled { opacity:0.65; cursor:not-allowed; }
        .div { display:flex; align-items:center; margin:20px 0; }
        .dl { flex:1; height:1px; background:#edf0f7; }
        .div span { color:#adb8cc; font-size:12.5px; padding:0 14px; font-weight:500; }
        .sb { background:linear-gradient(135deg,#f5f8ff,#eff3ff); border:1.5px solid #e0e8ff; border-radius:14px; padding:14px 18px; display:flex; align-items:center; gap:14px; }
        .bi { width:42px; height:42px; border-radius:11px; background:linear-gradient(135deg,#3b5bdb,#2d4fd6); display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 4px 12px rgba(59,91,219,0.3); }
        .sl { text-align:center; color:#8898b8; font-size:13.5px; margin-top:20px; }
        .sl button { background:none; border:none; color:#3b5bdb; font-weight:700; cursor:pointer; font-size:13.5px; padding:0; font-family:inherit; }
        .fc { text-align:center; color:#c0c8d8; font-size:11.5px; margin-top:14px; }
        .db { background:#f8faff; border:1.5px dashed #c5d0f0; border-radius:10px; padding:10px 14px; margin-top:14px; font-size:12px; color:#5a6e9a; text-align:center; }
        @media(max-width:680px){.ll{display:none}.lc{max-width:520px}.lr{padding:36px 28px}}
      `}</style>
      <div className="lw">
        <div className="lc">
          <div className="ll">
            <div className="ll-bg"/>
            <div className="ll-ov"/>
            <div className="ll-con">
              <div className="slc"><SchoolSVG size={36} color="#fff"/></div>
              <div className="lbt">
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
          <div className="lr">
            <div className="lh">
              <h1>Welcome Back!</h1>
              <p>Sign in to your admin account to continue</p>
            </div>
            {authError && (
              <div className="aerr">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {authError}
              </div>
            )}
            <InputField label="Mobile Number" type="tel" placeholder="Enter your mobile number" value={mobile} onChange={setMobile} error={errors.mobile} icon={<PhoneIcon/>} required/>
            <InputField label="Password" type="password" placeholder="Enter your password" value={password} onChange={setPassword} error={errors.password} icon={<LockIcon/>} required/>
            <div style={{textAlign:"right",marginTop:"-10px",marginBottom:"22px"}}>
              <button className="fb" onClick={()=>alert("Password reset link would be sent to your registered email.")}>Forgot Password?</button>
            </div>
            <button className="lbtn" onClick={handleLogin} disabled={loading}>{loading?"Signing in...":"Login to Dashboard"}</button>
            <div className="div"><div className="dl"/><span>OR</span><div className="dl"/></div>
            <div className="sb">
              <div className="bi"><LockIcon color="#fff" size={18}/></div>
              <div>
                <p style={{fontWeight:700,fontSize:"13.5px",color:"#0f1f5c",margin:"0 0 2px"}}>Secure &amp; Simple Login</p>
                <p style={{color:"#8898b8",fontSize:"12.5px",margin:0}}>Your school data is protected.</p>
              </div>
            </div>
            <div className="sl">Don't have an account? <button onClick={()=>onNavigate("signup")}>Sign Up</button></div>
            <p className="fc">© 2024 School Management System. All Rights Reserved.</p>
            <div className="db"><strong>Demo:</strong> Mobile: 9876543210 | Password: Admin@123</div>
          </div>
        </div>
      </div>
    </>
  );
}

function SchoolSVG({size=32,color="#3b5bdb"}){
  return(<svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" opacity="0.25"/><path d="M3 9.5L12 3l9 6.5" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><rect x="9" y="12" width="6" height="9" rx="1" fill={color}/><rect x="5" y="10" width="4" height="4" rx="0.5" fill={color} opacity="0.7"/><rect x="15" y="10" width="4" height="4" rx="0.5" fill={color} opacity="0.7"/></svg>);
}
function PhoneIcon(){return(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>);}
function LockIcon({color="currentColor",size=16}){return(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);}
