import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";

export default function App() {

  // RESTORE USER FROM LOCAL STORAGE
  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [page, setPage] = useState(() => {

    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? "dashboard"
      : "login";
  });

  const handleLogin = (userData) => {

    // SAVE BACKEND USER
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);

    setPage("dashboard");
  };

  const handleLogout = () => {

  localStorage.removeItem("user");

  localStorage.removeItem("token");

  localStorage.removeItem("activePage");

  localStorage.removeItem("subPage");

  setUser(null);

  setPage("login");
};

  if (page === "dashboard") {

    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "signup") {

    return (
      <SignupPage
        onNavigate={setPage}
      />
    );
  }

  return (
    <LoginPage
      onNavigate={setPage}
      onLogin={handleLogin}
    />
  );
}