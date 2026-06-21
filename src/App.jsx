import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";

export default function App() {

  const isTokenValid = () => {

  const token =
    localStorage.getItem("accessToken");

  if (!token) return false;

  try {

    const decoded =
      jwtDecode(token);

    return (
      decoded.exp >
      Date.now() / 1000
    );

  } catch {

    return false;
  }
};

  // RESTORE USER FROM LOCAL STORAGE
  const [user, setUser] = useState(() => {

  if (!isTokenValid()) {

    localStorage.clear();

    return null;
  }

  const savedUser =
    localStorage.getItem("user");

  return savedUser
    ? JSON.parse(savedUser)
    : null;
});

  const [page, setPage] = useState(() => {

  if (!isTokenValid()) {

    localStorage.clear();

    return "login";
  }

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

  localStorage.removeItem("accessToken");

  localStorage.removeItem("refreshToken");

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