import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";

const SEED_USERS = [
  { mobile: "9876543210", password: "Admin@123", name: "Arun Kumar", school: "Greenfield Primary School", role: "Admin" }
];

export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState(SEED_USERS);

  const handleSignup = (userData) => {
    setRegisteredUsers(prev => [...prev, userData]);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setPage("dashboard");
  };

  if (page === "dashboard") return <Dashboard user={user} onLogout={() => { setUser(null); setPage("login"); }} />;
  if (page === "signup") return <SignupPage onNavigate={setPage} onSignup={handleSignup} />;
  return <LoginPage onNavigate={setPage} onLogin={handleLogin} registeredUsers={registeredUsers} />;
}
