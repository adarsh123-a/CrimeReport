import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useAuth } from "../AuthServices/AuthContext";
import { Menu, X, LogOut, LayoutDashboard, Bot, FilePlus, Eye, Search, Home as HomeIcon } from "lucide-react";
import logoImg from "../assets/logaster-2019-02-0231-h-crime-report-logo-13.png";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const reduxUser = useSelector((state) => state.auth?.user);
  const { user: contextUser, logout: contextLogout } = useAuth();
  const user = reduxUser || contextUser;
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    if (contextLogout) contextLogout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "SUPER_ADMIN":
        return "/dashboard/super-admin";
      case "STATION_ADMIN":
        return "/dashboard/station-admin";
      case "POLICE_OFFICER":
        return "/dashboard/police";
      default:
        return "/dashboard/citizen";
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 text-white sticky top-0 z-50 shadow-lg">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex justify-between items-center gap-4">
        {/* Left Section: Logo & Brand */}
        <Link to="/Home" className="flex items-center space-x-3 shrink-0 group">
          <div className="flex items-center justify-center">
            <img
              src={logoImg}
              alt="Crime Report"
              className="h-10 w-auto object-contain mix-blend-lighten"
            />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1 whitespace-nowrap">
              Crime <span className="text-blue-500">Report</span>
            </h1>
          </div>
        </Link>

        {/* Middle Section: Navigation Routes */}
        <div className="hidden md:flex items-center justify-center space-x-1 lg:space-x-2 flex-1 mx-2 overflow-x-auto no-scrollbar">
          <Link
            to="/Home"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition duration-200 whitespace-nowrap shrink-0 ${isActive("/Home")
              ? "bg-blue-600/15 text-blue-400 font-semibold"
              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
          >
            <HomeIcon size={16} />
            <span>Home</span>
          </Link>

          <Link
            to="/IncidentReporting"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition duration-200 whitespace-nowrap shrink-0 ${isActive("/IncidentReporting")
              ? "bg-blue-600/15 text-blue-400 font-semibold"
              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
          >
            <FilePlus size={16} />
            <span>Incident Reporting</span>
          </Link>

          <Link
            to="/witness"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition duration-200 whitespace-nowrap shrink-0 ${isActive("/witness")
              ? "bg-blue-600/15 text-blue-400 font-semibold"
              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
          >
            <Eye size={16} />
            <span>Witness Submission</span>
          </Link>
        </div>

        {/* Right Section: Search / AI Assistant / Login / Register / Dashboard */}
        <div className="hidden md:flex items-center space-x-2 shrink-0">
          <Link
            to="/search"
            title="Search Crime"
            className={`flex items-center justify-center p-2.5 rounded-lg transition duration-200 shrink-0 ${isActive("/search")
              ? "bg-blue-600/15 text-blue-400 font-semibold"
              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
          >
            <Search size={18} />
          </Link>

          <Link
            to="/chat"
            title="AI Assistant"
            className={`flex items-center justify-center p-2.5 rounded-xl transition duration-200 shadow-sm shrink-0 ${isActive("/chat")
              ? "bg-blue-600 text-white shadow-blue-500/20"
              : "bg-blue-950/70 hover:bg-blue-900/80 text-blue-300 border border-blue-500/30 hover:border-blue-400/50"
              }`}
          >
            <Bot size={18} className="text-blue-400 animate-pulse" />
          </Link>

          {user ? (
            <div className="flex items-center space-x-2 ml-1 pl-2 border-l border-slate-800">
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-md shadow-blue-600/20 cursor-pointer whitespace-nowrap shrink-0"
              >
                <LayoutDashboard size={14} />
                <span>Dashboard ({user.role})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-slate-400 hover:text-red-400 text-xs font-semibold px-2.5 py-2 rounded-lg hover:bg-red-500/10 transition cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 ml-1 pl-2 border-l border-slate-800">
              <Link
                to="/login"
                className="text-xs lg:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 px-3.5 py-2 rounded-lg transition whitespace-nowrap shrink-0"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md shadow-blue-600/20 whitespace-nowrap shrink-0"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none rounded-lg hover:bg-slate-800/60"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#0f172a] border-b border-slate-800 px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <Link
            to="/Home"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800/60"
          >
            <HomeIcon size={16} /> Home
          </Link>
          <Link
            to="/IncidentReporting"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800/60"
          >
            <FilePlus size={16} /> Incident Reporting
          </Link>
          <Link
            to="/witness"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800/60"
          >
            <Eye size={16} /> Witness Submission
          </Link>
          <Link
            to="/search"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800/60"
          >
            <Search size={16} /> Search Crime
          </Link>
          <Link
            to="/chat"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-sm font-bold text-blue-400 bg-blue-950/60 border border-blue-800/40 p-2.5 rounded-xl"
          >
            <Bot size={18} className="text-blue-400" /> AI Assistant
          </Link>

          {user ? (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Link
                to={getDashboardPath()}
                onClick={() => setIsOpen(false)}
                className="block text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-3 rounded-xl text-center shadow-sm"
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-center text-xs font-bold text-red-400 py-2.5 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center text-xs font-semibold border border-slate-700 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
