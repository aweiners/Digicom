import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Notepad from "./components/Notepad";
import RoleSwitcher from "./components/RoleSwitcher";
import Forum from "./components/forum";
import BulletinBoard from "./components/BulletinBoard";
import bulletin from "./assets/bulletin.png";

export default function App() {
  const [userRole, setUserRole] = useState("student");

  const handleRoleChange = (role) => {
    setUserRole(role);
    localStorage.setItem("userRole", role);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<BulletinBoard />} />
          <Route path="/forum" element={<Forum />} />
        </Routes>
      </div>
    </Router>
  );
}