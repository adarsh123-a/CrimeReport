import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthServices/AuthContext";
import { Menu, X } from "lucide-react"; // Import icons for mobile menu

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <img
            src="https://www.kingsporttn.gov/wp-content/uploads/Crime-Report.jpg"
            alt="Crime Report Logo"
            className="h-12 w-auto object-contain"
          />
          <h1 className="text-2xl font-bold">Crime Report</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/Home" className="text-lg hover:text-gray-300 transition">
            Home
          </Link>
          <Link
            to="/IncidentReporting"
            className="text-lg hover:text-gray-300 transition"
          >
            Incident Reporting
          </Link>
          <Link
            to="/witness"
            className="text-lg hover:text-gray-300 transition"
          >
            Witness
          </Link>
          {/* <Link
            to="/Hearing"
            className="text-lg hover:text-gray-300 transition"
          >
            Hearing Report
          </Link>
          <Link
            to="/cashTracking"
            className="text-lg hover:text-gray-300 transition"
          >
            Case Tracking
          </Link> */}
          <Link to="/search" className="text-lg hover:text-gray-300 transition">
            SearchCrime
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 mt-4 bg-blue-700 p-4">
          <Link to="/Home" className="text-lg hover:text-gray-300 transition">
            Home
          </Link>
          <Link
            to="/IncidentReporting"
            className="text-lg hover:text-gray-300 transition"
          >
            Incident Reporting
          </Link>
          <Link
            to="/witness"
            className="text-lg hover:text-gray-300 transition"
          >
            Witness
          </Link>
          <Link to="/search" className="text-lg hover:text-gray-300 transition">
            SearchCrime
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
