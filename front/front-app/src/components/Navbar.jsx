import MKDLogo from "../assets/MKDLogo.png";
import GUIDANCELogo from "../assets/GUIDANCELogo.png";
import GuidancePhoto from "../assets/2850940.png";



export default function Navbar() {
  return (
    <>
    <nav className="border-gray-200 fixed w-full top-0 left-0 z-50 bg-white">
      <div className="flex flex-wrap items-center justify-between p-4">
        <a href="#" className="flex items-center space-x-3">
          <div className="ml-4 flex gap-3">
            <img src={MKDLogo} className="h-10" alt="MKD Logo" />
            <img src={GUIDANCELogo} className="h-10" alt="GUIDANCE Logo" />
          </div>
          <span className="bungee-regular self-center text-[5vw] md:text-[2vw] font-bold text-blue-900">MKD - OPEN FORUM</span>
        </a>
        <div className="hidden md:block">
          <ul className="font-medium flex space-x-8">
            <li><a href="#" className="text-blue-700">Home</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-700">About</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-700">Services</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-700">Pricing</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-700">Contact</a></li>
          </ul>
        </div>
      </div>
    </nav>
    
    <div className="flex ml-10 mb-10 mt-20 items-center justify-center">
      <img src={GuidancePhoto} className="h-[20vw] mt-10 w-auto"></img>
      <div className="">
          <p className="dm-sans-italic font-bold text-[3vw] md:text-[1vw] text-white">Mindanao Kokusai Daigaku</p>
          <p className="boldonse-regular text-blue-100 text-[4vw] md:text-[6vw]">OPEN FORUM </p>
          <p className="boldonse-regular text-blue-100 text-[2vw] md:text-[0.8vw]">An open space for MKD's students. </p>
          
          <p className="cedarville text-blue-200 text-[3vw] md:text-[1.3vw]">Make sure to keep it safe, or else. 😉</p>
      </div>
    </div>
    </>
    
  );
}