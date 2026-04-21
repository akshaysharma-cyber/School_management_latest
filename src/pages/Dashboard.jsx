import { useState } from "react";
import AddStudentPage from "./AddStudentPage";
import AddTeacherPage from "./AddTeacherPage";
import AttendancePage from "./AttendancePage";
import FeeCollectionPage from "./FeeCollectionPage";
import FeeStructurePage from "./FeeStructurePage";
import ExaminationsPage from "./ExaminationsPage";
import ExamSetupPage from "./ExamSetupPage";
import MarksEntryPage from "./MarksEntryPage";
import ResultsPage from "./ResultsPage";

const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard", icon:<DashboardIcon/> },
  { id:"students",  label:"Students",  icon:<StudentsIcon/> },
  { id:"teachers",  label:"Teachers",  icon:<TeachersIcon/> },
  { id:"attendance",label:"Attendance",icon:<AttendanceIcon/> },
  { id:"classes",   label:"Classes",   icon:<ClassesIcon/> },
  { id:"fees",      label:"Fee Collection", icon:<FeesIcon/> },
  { id:"notices",   label:"Notices",   icon:<NoticesIcon/> },
  { id:"reports",   label:"Reports",   icon:<ReportsIcon/> },
  { id:"examinations", label:"Examinations", icon:<ExamIcon/>, hasChildren: true },
];

const STAT_CARDS = [
  { label:"Students",    value:"32",       icon:<StudentsStatIcon/>, color:"#4361ee", bg:"#eef0fd", lightBg:"#f0f4ff" },
  { label:"Teachers",    value:"5",        icon:<TeachersStatIcon/>, color:"#2ec4b6", bg:"#e8faf9", lightBg:"#e8faf9" },
  { label:"Present Today",value:"28",      icon:<CalendarStatIcon/>, color:"#7b61ff", bg:"#f0ecff", lightBg:"#f0ecff" },
  { label:"Fees Collected This Month", value:"₹ 12,450", icon:<WalletStatIcon/>, color:"#f4a261", bg:"#fff4eb", lightBg:"#fff4eb" },
];

const NOTICES = [
  { icon:"🔔", iconBg:"#eef0fd", title:"PTM Scheduled", desc:"Parent-Teacher Meeting on 15th June.", time:"2 days ago" },
  { icon:"☀️", iconBg:"#fff8e6", title:"Summer Vacation",  desc:"School will remain closed from 20th May.", time:"5 days ago" },
  { icon:"🏆", iconBg:"#e8faf9", title:"Sports Day",       desc:"Annual Sports Day on 28th June.", time:"1 week ago" },
];

const QUICK_ACTIONS = [
  { label:"Add Student",     icon:<AddStudentIcon/>, bg:"#f0f4ff", color:"#4361ee" },
  { label:"Mark Attendance", icon:<MarkAttIcon/>,    bg:"#e8faf9", color:"#2ec4b6" },
  { label:"Examinations",    icon:<ExamQAIcon/>,     bg:"#f0ecff", color:"#7b61ff" },
  { label:"Generate Report", icon:<GenReportIcon/>,  bg:"#fff4eb", color:"#e07b39" },
];

export default function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [subPage, setSubPage] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const today = new Date().toLocaleDateString("en-US",{weekday:"long",day:"numeric",month:"long",year:"numeric"});

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#f0f2fb",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }
        .sidebar { width:260px; background:#fff; display:flex; flex-direction:column; border-right:1px solid #eef0f8; flex-shrink:0; }
        .nav-item { display:flex; align-items:center; gap:12px; padding:11px 20px; border-radius:12px; margin:2px 12px; cursor:pointer; font-size:14.5px; font-weight:600; color:#5a6783; transition:all 0.18s; text-decoration:none; }
        .nav-item:hover { background:#f0f4ff; color:#4361ee; }
        .nav-item.active { background:#4361ee; color:#fff; box-shadow:0 4px 12px rgba(67,97,238,0.3); }
        .nav-item.active svg path, .nav-item.active svg rect, .nav-item.active svg circle, .nav-item.active svg polyline { stroke:#fff !important; }
        .stat-card { background:#fff; border-radius:20px; padding:24px; box-shadow:0 2px 12px rgba(67,97,238,0.06); flex:1; min-width:0; }
        .notice-item { display:flex; align-items:flex-start; gap:14px; padding:16px 0; border-bottom:1px solid #f5f6fc; }
        .notice-item:last-child { border-bottom:none; }
        .qa-btn { flex:1; min-width:calc(50% - 8px); max-width:calc(50% - 8px); border:none; border-radius:16px; padding:20px 16px; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:10px; font-family:inherit; font-weight:700; font-size:13.5px; transition:all 0.18s; }
        .qa-btn:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(0,0,0,0.1); }
        .header-btn { background:none; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; border-radius:50%; padding:8px; transition:background 0.15s; }
        .header-btn:hover { background:#f0f2fb; }
        .notif-drop { position:absolute; top:52px; right:0; background:#fff; border-radius:16px; box-shadow:0 8px 32px rgba(67,97,238,0.15); padding:16px; width:280px; z-index:100; }
        .logout-btn { background:#fff5f5; border:1.5px solid #fcd5d5; color:#c53030; border-radius:10px; padding:8px 16px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; transition:all 0.15s; }
        .logout-btn:hover { background:#fde8e8; }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Logo */}
        <div style={{padding:"24px 20px 16px",borderBottom:"1px solid #eef0f8"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{width:42,height:42,borderRadius:"12px",background:"linear-gradient(135deg,#4361ee,#3a56d4)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <SchoolLogoIcon/>
            </div>
            <div>
              <p style={{margin:0,fontWeight:800,fontSize:"14px",color:"#1a2744",lineHeight:1.2}}>Greenfield Primary</p>
              <p style={{margin:0,fontWeight:600,fontSize:"12px",color:"#8898b8",lineHeight:1.3}}>School</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"16px 0",overflowY:"auto"}}>
          {NAV_ITEMS.map(item=>(
            <div key={item.id}>
              <div className={`nav-item${activePage===item.id?" active":""}`} onClick={()=>{setActivePage(item.id);setSubPage(null);}}>
                {item.icon}
                {item.label}
                {item.hasChildren && <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{marginLeft:"auto",opacity:0.5}}><path d={activePage===item.id?"M11 7L6 2L1 7":"M1 1l5 5 5-5"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              </div>
              {item.hasChildren && activePage===item.id && (
                <div style={{marginLeft:20,marginBottom:4}}>
                  {[{id:"setup",label:"Exam Setup"},{id:"marks",label:"Marks Entry"},{id:"results",label:"Results"},{id:"cards",label:"Report Cards"}].map(sub=>(
                    <div key={sub.id} onClick={()=>setSubPage(sub.id===subPage?null:sub.id)}
                      style={{padding:"7px 16px",fontSize:13,fontWeight:subPage===sub.id?700:500,color:subPage===sub.id?"#4361ee":"#8898b8",cursor:"pointer",borderRadius:8,background:subPage===sub.id?"#f0f4ff":"transparent",margin:"1px 0",transition:"all 0.15s"}}>
                      {sub.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Divider */}
        <div style={{borderTop:"1px solid #eef0f8",padding:"12px 0"}}>
          <div className={`nav-item${activePage==="settings"?" active":""}`} onClick={()=>setActivePage("settings")}>
            <SettingsIcon/>
            Settings
          </div>
        </div>

        {/* Help box */}
        <div style={{margin:"12px",background:"linear-gradient(135deg,#f0f4ff,#e8ecff)",borderRadius:"16px",padding:"16px",marginBottom:"20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"6px"}}>
            <span style={{fontSize:"22px"}}>📚</span>
            <div>
              <p style={{margin:0,fontWeight:800,fontSize:"13px",color:"#1a2744"}}>Need Help?</p>
              <p style={{margin:0,fontSize:"11.5px",color:"#8898b8"}}>Contact Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {/* Header */}
        <div style={{background:"#fff",padding:"16px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #eef0f8",boxShadow:"0 1px 8px rgba(67,97,238,0.05)"}}>
          <h2 style={{margin:0,fontSize:"20px",fontWeight:800,color:"#4361ee",letterSpacing:"-0.3px"}}>
            {activePage==="dashboard"?"Dashboard":activePage==="students"?"Students":activePage==="teachers"?"Teachers":activePage==="attendance"?"Attendance":activePage==="classes"?"Classes":activePage==="fees"?"Fee Collection":activePage==="notices"?"Notices":activePage==="reports"?"Reports":activePage==="examinations"?"Examinations":"Settings"}
          </h2>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            {/* Notification bell */}
            <div style={{position:"relative"}}>
              <button className="header-btn" onClick={()=>setShowNotif(v=>!v)}>
                <BellIcon/>
                <span style={{position:"absolute",top:4,right:4,width:18,height:18,background:"#e53e3e",borderRadius:"50%",fontSize:"10px",fontWeight:800,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff"}}>2</span>
              </button>
              {showNotif&&(
                <div className="notif-drop">
                  <p style={{margin:"0 0 12px",fontWeight:800,fontSize:"14px",color:"#1a2744"}}>Notifications</p>
                  {NOTICES.slice(0,2).map((n,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:10,paddingBottom:10,borderBottom:i<1?"1px solid #f5f6fc":"none"}}>
                      <span style={{fontSize:"18px"}}>{n.icon}</span>
                      <div><p style={{margin:"0 0 2px",fontWeight:700,fontSize:"13px",color:"#1a2744"}}>{n.title}</p><p style={{margin:0,fontSize:"12px",color:"#8898b8"}}>{n.time}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* User */}
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#c7d2fe,#a5b4fc)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"15px",color:"#4361ee"}}>
                {user?.name?.charAt(0)||"A"}
              </div>
              <div>
                <p style={{margin:0,fontWeight:700,fontSize:"14px",color:"#1a2744"}}>{user?.name||"Admin"}</p>
                <p style={{margin:0,fontSize:"12px",color:"#8898b8"}}>Admin</p>
              </div>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{flex:1,padding:"32px",overflowY:"auto"}}>

          {/* ── Page Router ── */}
          {activePage==="students" && subPage==="add" && (
            <AddStudentPage onBack={()=>setSubPage(null)} />
          )}

          {activePage==="teachers" && subPage==="add" && (
            <AddTeacherPage onBack={()=>setSubPage(null)} />
          )}

          {activePage==="attendance" && (
            <AttendancePage />
          )}

          {activePage==="fees" && subPage!=="structure" && (
            <FeeCollectionPage onNavigate={(p)=>setSubPage(p)} />
          )}

          {activePage==="fees" && subPage==="structure" && (
            <FeeStructurePage onBack={()=>setSubPage(null)} />
          )}

          {activePage==="examinations" && !subPage && (
            <ExaminationsPage onNavigate={(p)=>setSubPage(p)} />
          )}

          {activePage==="examinations" && subPage==="setup" && (
            <ExamSetupPage onBack={()=>setSubPage(null)} />
          )}

          {activePage==="examinations" && subPage==="marks" && (
            <MarksEntryPage onBack={()=>setSubPage(null)} />
          )}

          {activePage==="examinations" && subPage==="results" && (
            <ResultsPage onBack={()=>setSubPage(null)} />
          )}

          {activePage==="students" && !subPage && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
                <div>
                  <h2 style={{margin:"0 0 4px",fontSize:22,fontWeight:800,color:"#1a2744"}}>Students</h2>
                  <p style={{margin:0,color:"#8898b8",fontSize:13.5}}>Manage all students enrolled in the school.</p>
                </div>
                <button onClick={()=>setSubPage("add")} style={{background:"#4361ee",color:"#fff",border:"none",borderRadius:12,padding:"11px 20px",fontWeight:700,fontSize:13.5,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 12px rgba(67,97,238,0.3)"}}>
                  + Add Student
                </button>
              </div>
              <div style={{background:"#fff",borderRadius:20,padding:32,boxShadow:"0 2px 12px rgba(67,97,238,0.06)",textAlign:"center",color:"#8898b8"}}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{margin:"0 auto 14px",display:"block"}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#c0c8d8" strokeWidth="1.5"/><circle cx="9" cy="7" r="4" stroke="#c0c8d8" strokeWidth="1.5"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#c0c8d8" strokeWidth="1.5"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#c0c8d8" strokeWidth="1.5"/></svg>
                <p style={{fontSize:15,fontWeight:600,color:"#5a6783",margin:"0 0 6px"}}>No students yet</p>
                <p style={{fontSize:13,margin:0}}>Click "Add Student" to enroll the first student.</p>
              </div>
            </div>
          )}

          {activePage==="teachers" && !subPage && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
                <div>
                  <h2 style={{margin:"0 0 4px",fontSize:22,fontWeight:800,color:"#1a2744"}}>Teachers</h2>
                  <p style={{margin:0,color:"#8898b8",fontSize:13.5}}>Manage all teaching staff at the school.</p>
                </div>
                <button onClick={()=>setSubPage("add")} style={{background:"#4361ee",color:"#fff",border:"none",borderRadius:12,padding:"11px 20px",fontWeight:700,fontSize:13.5,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 12px rgba(67,97,238,0.3)"}}>
                  + Add Teacher
                </button>
              </div>
              <div style={{background:"#fff",borderRadius:20,padding:32,boxShadow:"0 2px 12px rgba(67,97,238,0.06)",textAlign:"center",color:"#8898b8"}}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{margin:"0 auto 14px",display:"block"}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#c0c8d8" strokeWidth="1.5"/><circle cx="9" cy="7" r="4" stroke="#c0c8d8" strokeWidth="1.5"/></svg>
                <p style={{fontSize:15,fontWeight:600,color:"#5a6783",margin:"0 0 6px"}}>No teachers yet</p>
                <p style={{fontSize:13,margin:0}}>Click "Add Teacher" to add the first staff member.</p>
              </div>
            </div>
          )}

          {(activePage==="classes"||activePage==="notices"||activePage==="reports"||activePage==="settings") && (
            <div style={{background:"#fff",borderRadius:20,padding:"48px 32px",boxShadow:"0 2px 12px rgba(67,97,238,0.06)",textAlign:"center",color:"#8898b8"}}>
              <div style={{fontSize:48,marginBottom:14}}>🚧</div>
              <p style={{fontSize:17,fontWeight:700,color:"#5a6783",margin:"0 0 6px"}}>Coming Soon</p>
              <p style={{fontSize:13.5,margin:0}}>This section is under development.</p>
            </div>
          )}

          {/* ── Dashboard Home ── */}
          {activePage==="dashboard" && (
            <div>
          {/* Welcome */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"28px"}}>
            <div>
              <h1 style={{margin:"0 0 4px",fontSize:"26px",fontWeight:800,color:"#1a2744"}}>Welcome back, {user?.name?.split(" ")[0]||"Admin"}!</h1>
              <p style={{margin:0,color:"#8898b8",fontSize:"14.5px"}}>Have a great day at {user?.school||"Greenfield Primary School"}.</p>
            </div>
            <p style={{margin:0,color:"#8898b8",fontSize:"14px",fontWeight:500,flexShrink:0}}>{today}</p>
          </div>

          {/* Stat cards */}
          <div style={{display:"flex",gap:"16px",marginBottom:"28px",flexWrap:"wrap"}}>
            {STAT_CARDS.map(c=>(
              <div className="stat-card" key={c.label}>
                <div style={{width:52,height:52,borderRadius:"16px",background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"16px"}}>
                  {c.icon}
                </div>
                <p style={{margin:"0 0 4px",fontSize:"32px",fontWeight:800,color:"#1a2744",lineHeight:1}}>{c.value}</p>
                <p style={{margin:0,fontSize:"14px",color:"#8898b8",fontWeight:500}}>{c.label}</p>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
            {/* Recent Notices */}
            <div style={{background:"#fff",borderRadius:"20px",padding:"24px",boxShadow:"0 2px 12px rgba(67,97,238,0.06)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}>
                <h3 style={{margin:0,fontSize:"16px",fontWeight:800,color:"#1a2744"}}>Recent Notices</h3>
                <button style={{background:"none",border:"none",color:"#4361ee",fontWeight:700,fontSize:"13.5px",cursor:"pointer",fontFamily:"inherit"}}>View All</button>
              </div>
              {NOTICES.map((n,i)=>(
                <div className="notice-item" key={i}>
                  <div style={{width:40,height:40,borderRadius:"12px",background:n.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",flexShrink:0}}>{n.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"3px"}}>
                      <p style={{margin:0,fontWeight:700,fontSize:"14px",color:"#1a2744"}}>{n.title}</p>
                      <span style={{fontSize:"12px",color:"#b0bbc9",fontWeight:500,flexShrink:0,marginLeft:8}}>{n.time}</span>
                    </div>
                    <p style={{margin:0,fontSize:"13px",color:"#8898b8"}}>{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{background:"#fff",borderRadius:"20px",padding:"24px",boxShadow:"0 2px 12px rgba(67,97,238,0.06)"}}>
              <h3 style={{margin:"0 0 18px",fontSize:"16px",fontWeight:800,color:"#1a2744"}}>Quick Actions</h3>
              <div style={{display:"flex",flexWrap:"wrap",gap:"12px"}}>
                {QUICK_ACTIONS.map(a=>(
                  <button key={a.label} className="qa-btn" style={{background:a.bg,color:a.color}}
                    onClick={()=>{
                      if(a.label==="Add Student"){setActivePage("students");setSubPage("add");}
                      else if(a.label==="Mark Attendance"){setActivePage("attendance");setSubPage(null);}
                      else if(a.label==="Examinations"){setActivePage("examinations");setSubPage(null);}
                      else alert(`${a.label} - Feature coming soon!`);
                    }}>
                    <div style={{width:44,height:44,borderRadius:"14px",background:"rgba(255,255,255,0.7)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {a.icon}
                    </div>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          </div>
          )}

          {/* Footer */}
          <p style={{textAlign:"center",color:"#c0c8d8",fontSize:"12px",marginTop:"28px"}}>© 2024 Greenfield Primary School. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}

/* ── Icons ── */
function SchoolLogoIcon(){return<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" fill="rgba(255,255,255,0.25)"/><path d="M3 9.5L12 3l9 6.5" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" fill="none"/><rect x="9" y="12" width="6" height="9" rx="1" fill="#fff"/><rect x="5" y="10" width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.7)"/><rect x="15" y="10" width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.7)"/></svg>;}
function DashboardIcon(){return<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#5a6783" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#5a6783" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#5a6783" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#5a6783" strokeWidth="1.8"/></svg>;}
function StudentsIcon(){return<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#5a6783" strokeWidth="1.8"/><circle cx="12" cy="7" r="4" stroke="#5a6783" strokeWidth="1.8"/></svg>;}
function TeachersIcon(){return<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#5a6783" strokeWidth="1.8"/><circle cx="9" cy="7" r="4" stroke="#5a6783" strokeWidth="1.8"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#5a6783" strokeWidth="1.8"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#5a6783" strokeWidth="1.8"/></svg>;}
function AttendanceIcon(){return<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#5a6783" strokeWidth="1.8"/><line x1="16" y1="2" x2="16" y2="6" stroke="#5a6783" strokeWidth="1.8"/><line x1="8" y1="2" x2="8" y2="6" stroke="#5a6783" strokeWidth="1.8"/><line x1="3" y1="10" x2="21" y2="10" stroke="#5a6783" strokeWidth="1.8"/></svg>;}
function ClassesIcon(){return<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#5a6783" strokeWidth="1.8"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#5a6783" strokeWidth="1.8"/></svg>;}
function FeesIcon(){return<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#5a6783" strokeWidth="1.8"/><line x1="2" y1="10" x2="22" y2="10" stroke="#5a6783" strokeWidth="1.8"/></svg>;}
function NoticesIcon(){return<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#5a6783" strokeWidth="1.8"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#5a6783" strokeWidth="1.8"/></svg>;}
function ReportsIcon(){return<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#5a6783" strokeWidth="1.8"/><polyline points="14 2 14 8 20 8" stroke="#5a6783" strokeWidth="1.8"/><line x1="16" y1="13" x2="8" y2="13" stroke="#5a6783" strokeWidth="1.8"/><line x1="16" y1="17" x2="8" y2="17" stroke="#5a6783" strokeWidth="1.8"/></svg>;}
function SettingsIcon(){return<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="#5a6783" strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="#5a6783" strokeWidth="1.8"/></svg>;}
function BellIcon(){return<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#5a6783" strokeWidth="1.8"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#5a6783" strokeWidth="1.8"/></svg>;}
function StudentsStatIcon(){return<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#4361ee" strokeWidth="1.8"/><circle cx="9" cy="7" r="4" stroke="#4361ee" strokeWidth="1.8"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#4361ee" strokeWidth="1.8"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#4361ee" strokeWidth="1.8"/></svg>;}
function TeachersStatIcon(){return<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="#2ec4b6" strokeWidth="1.8"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="#2ec4b6" strokeWidth="1.8"/></svg>;}
function CalendarStatIcon(){return<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#7b61ff" strokeWidth="1.8"/><line x1="16" y1="2" x2="16" y2="6" stroke="#7b61ff" strokeWidth="1.8"/><line x1="8" y1="2" x2="8" y2="6" stroke="#7b61ff" strokeWidth="1.8"/><line x1="3" y1="10" x2="21" y2="10" stroke="#7b61ff" strokeWidth="1.8"/><polyline points="9 16 11 18 15 14" stroke="#7b61ff" strokeWidth="1.8"/></svg>;}
function WalletStatIcon(){return<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" stroke="#f4a261" strokeWidth="1.8"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" stroke="#f4a261" strokeWidth="1.8"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" stroke="#f4a261" strokeWidth="1.8"/></svg>;}
function AddStudentIcon(){return<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#4361ee" strokeWidth="1.8"/><circle cx="9" cy="7" r="4" stroke="#4361ee" strokeWidth="1.8"/><line x1="19" y1="8" x2="19" y2="14" stroke="#4361ee" strokeWidth="1.8"/><line x1="22" y1="11" x2="16" y2="11" stroke="#4361ee" strokeWidth="1.8"/></svg>;}
function MarkAttIcon(){return<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#2ec4b6" strokeWidth="1.8"/><line x1="16" y1="2" x2="16" y2="6" stroke="#2ec4b6" strokeWidth="1.8"/><line x1="8" y1="2" x2="8" y2="6" stroke="#2ec4b6" strokeWidth="1.8"/><line x1="3" y1="10" x2="21" y2="10" stroke="#2ec4b6" strokeWidth="1.8"/><polyline points="9 16 11 18 15 14" stroke="#2ec4b6" strokeWidth="1.8"/></svg>;}
function SendNoticeIcon(){return<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#f4a261" strokeWidth="1.8"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#f4a261" strokeWidth="1.8"/></svg>;}
function GenReportIcon(){return<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#e07b39" strokeWidth="1.8"/><polyline points="14 2 14 8 20 8" stroke="#e07b39" strokeWidth="1.8"/><line x1="16" y1="13" x2="8" y2="13" stroke="#e07b39" strokeWidth="1.8"/><line x1="16" y1="17" x2="8" y2="17" stroke="#e07b39" strokeWidth="1.8"/></svg>;}
function ExamIcon(){return<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="#5a6783" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#5a6783" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function ExamQAIcon(){return<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="#7b61ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#7b61ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
