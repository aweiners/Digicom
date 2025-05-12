import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Notepad from "./Notepad";
import RoleSwitcher from "./RoleSwitcher";

export default function Forum() {
  const [userRole, setUserRole] = useState("student");

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, []);

  const handleRoleChange = (role) => {
    setUserRole(role);
    localStorage.setItem("userRole", role);
  };

  return (
    <div className="min-h-screen bg-transparent mt-25">
      <Navbar />
      <div className="-mt-25 flex justify-center">
        <Notepad userRole={userRole} />
      </div>
      <RoleSwitcher onRoleChange={handleRoleChange} />
    </div>
  );
}
