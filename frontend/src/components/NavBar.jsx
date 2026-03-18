import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserCircle, LogOut, Menu, X } from "lucide-react"; // Switched to Lucide icons

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  // --- 1. DETERMINE ROLE (Fix for conflicting sessions) ---
  const userInfo = localStorage.getItem("userInfo");
  const employerInfo = localStorage.getItem("employerInfo");

  let activeRole = "guest"; // 'guest' | 'user' | 'employer'

  if (userInfo && !employerInfo) {
    activeRole = "user";
  } else if (!userInfo && employerInfo) {
    activeRole = "employer";
  } else if (userInfo && employerInfo) {
    // Both exist (dirty state). Decide based on URL context.
    if (location.pathname.startsWith("/employer")) {
      activeRole = "employer";
    } else {
      activeRole = "user";
    }
  }

  const isUser = activeRole === "user";
  const isEmployer = activeRole === "employer";

  // Logout handler (Clear ALL sessions to be safe)
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("employerToken");
    localStorage.removeItem("employerInfo");

    setMenuOpen(false);
    setUserMenuOpen(false);
    navigate("/login");
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide navbar on auth pages
  if (
    ["/login", "/register", "/employerregister"].includes(location.pathname)
  ) {
    return null;
  }

  const handleEmployerClick = () => {
    if (isEmployer) {
      navigate("/employerdashboard");
    } else {
      navigate("/employerregister");
    }
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0 left-0 font-sans">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          JobOne
        </Link>

        {/* --- DESKTOP MENU --- */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-700 font-medium"
          >
            Home
          </Link>

          {/* Guest Links */}
          {activeRole === "guest" && (
            <>
              <Link
                to="/jobs"
                className="text-gray-700 hover:text-blue-700 font-medium"
              >
                Find Part-time Jobs
              </Link>
              <Link
                to="/employerregister"
                className="text-gray-700 hover:text-blue-700 font-medium"
              >
                Post Part-time Jobs
              </Link>
            </>
          )}

          {/* User Links */}
          {isUser && (
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-blue-700 font-medium"
            >
              Find Part-time Jobs
            </Link>
          )}

          {/* Employer Links */}
          {isEmployer && (
            <Link
              to="/createjob"
              className="text-gray-700 hover:text-blue-700 font-medium"
            >
              Post a Part-time Job
            </Link>
          )}

          {/* Profile Dropdown / Login Button */}
          {activeRole !== "guest" ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-700 focus:outline-none transition-colors"
              >
                <UserCircle size={28} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Employer Dropdown Items */}
                  {isEmployer && (
                    <>
                      <Link
                        to="/employerprofile"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Company Profile
                      </Link>
                      <Link
                        to="/employerdashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </>
                  )}

                  {/* User Dropdown Items */}
                  {isUser && (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/myapplications"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Applications
                      </Link>
                    </>
                  )}

                  <div className="border-t my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Not Logged In Buttons
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-700 font-medium"
              >
                Login
              </Link>
              <button
                onClick={handleEmployerClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm text-sm"
              >
                For Employers ➔
              </button>
            </div>
          )}
        </div>

        {/* --- MOBILE HAMBURGER BUTTON --- */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none text-gray-700 hover:text-blue-700 p-2"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg py-4 px-6 flex flex-col space-y-4 animate-in slide-in-from-top-5 duration-200">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {/* Guest Mobile Links */}
          {activeRole === "guest" && (
            <>
              <Link
                to="/jobs"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Find Jobs
              </Link>
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <Link
                  to="/login"
                  className="text-center w-full py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <button
                  onClick={handleEmployerClick}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-sm"
                >
                  For Employers
                </button>
              </div>
            </>
          )}

          {/* Employer Mobile Links */}
          {isEmployer && (
            <>
              <Link
                to="/createjob"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Post a Part-time Job
              </Link>
              <Link
                to="/employerdashboard"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/employerprofile"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Company Profile
              </Link>
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="text-red-600 font-medium flex items-center gap-2 py-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </>
          )}

          {/* User Mobile Links */}
          {isUser && (
            <>
              <Link
                to="/jobs"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Find Part-time Jobs
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                to="/myapplications"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                My Applications
              </Link>
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="text-red-600 font-medium flex items-center gap-2 py-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
