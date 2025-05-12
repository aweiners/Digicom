import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MKDLogo from "../assets/MKDLogo.png";
import GUIDANCELogo from "../assets/GUIDANCELogo.png";
import bulletin from "../assets/bulletin.png";
import bulletin_bg from "../assets/bulletin_bg.jpg";
import AnnouncementSection from "./AnnouncementSection";
import ResourceSection from "./ResourceSection";

function BulletinBoard() {
  const [userRole, setUserRole] = useState("student");
  const [username, setUsername] = useState("student");  
  const [authToken, setAuthToken] = useState("");
  
  // Toggle between student and admin roles
  const toggleRole = async () => {
    const newUsername = username === "student" ? "admin" : "student";
    await loginUser(newUsername);
  };
  
  // Login user and get auth token
  const loginUser = async (user) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsername(user);
        setUserRole(data.user.role);
        setAuthToken(data.token);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  // Login on component mount
  useEffect(() => {
    loginUser(username);
  }, []);

  return (
    <div className="bg-white pb-10">
      <nav className="border-gray-200 fixed w-full top-0 left-0 z-50 bg-white">
        <div className="flex flex-wrap items-center justify-between p-4">
          <a href="#" className="flex items-center space-x-3">
            <div className="ml-4 flex gap-3">
              <img src={MKDLogo} className="h-10" alt="MKD Logo" />
              <img src={GUIDANCELogo} className="h-10" alt="GUIDANCE Logo" />
            </div>
            <span className="bungee-regular self-center text-[4vw] font-bold text-blue-900 lg:text-[2vw]">
              Mindanao Kokusai Daigaku
            </span>
          </a>
          <div className="hidden md:block">
            <ul className="font-medium flex space-x-8">
              <li>
                <a href="#" className="text-blue-700">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-700">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-700">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-700">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-700">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-0.5"></hr>
      </nav>

      {/* below navbar */}
      <div>
        <div 
          className="mt-20 flex justify-center gap-5 shadow-2xl border-1"
          style={{ backgroundImage: `url(${bulletin_bg})`, backgroundRepeat: 'no-repeat' }}
        >
          <div>
            <img src={bulletin} className="mt-15 w-auto h-[15vw]" alt="Bulletin" />
          </div>

          <div className="mt-10 text-white">
            <p className="hover:animate-jump-in hover:animate-once bungee-regular text-[3vw] text-blue-300">
              Guidance Office
            </p>
            <p className="boldonse-regular text-[6vw] text-blue-500">
              Bulletin Board
            </p>
          </div>
        </div>
      </div>

      {/* Role switcher and buttons */}
      <div className="flex items-center justify-between mx-10 mt-6">
        <Link to="/forum">
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
            <span className="flex text-blue-400 hover:text-white relative h-[3vw] w-auto boldonse-regular text-[1vw] text-center items-center px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-white rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Open Forum
            </span>
          </button>
        </Link>
        
        <div className="flex items-center gap-4">
          <span className="text-gray-800 font-medium">Current Role: {userRole}</span>
          <button 
            onClick={toggleRole} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm"
          >
            Switch to {username === "student" ? "Admin" : "Student"}
          </button>
        </div>
      </div>

      {/* Content sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="border-2 shadow-2xl border-gray-400 bg-no-repeat rounded-xl bg-white h-auto min-h-[50vw] p-10 m-10">
          <AnnouncementSection userRole={userRole} authToken={authToken} />
        </div>
        <div className="border-2 shadow-2xl border-gray-400 rounded-xl bg-white h-auto min-h-[50vw] p-10 m-10">
          <ResourceSection userRole={userRole} authToken={authToken} />
        </div>
      </div>
    </div>
  );
}

export default BulletinBoard;