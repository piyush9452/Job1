import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  UserCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  User,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  // --- 0. SCROLL EFFECT ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- 1. DETERMINE ROLE ---
  const userInfo = localStorage.getItem("userInfo");
  const employerInfo = localStorage.getItem("employerInfo");

  let activeRole = "guest";

  if (userInfo && !employerInfo) {
    activeRole = "user";
  } else if (!userInfo && employerInfo) {
    activeRole = "employer";
  } else if (userInfo && employerInfo) {
    if (location.pathname.startsWith("/employer")) {
      activeRole = "employer";
    } else {
      activeRole = "user";
    }
  }

  const isUser = activeRole === "user";
  const isEmployer = activeRole === "employer";

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("employerToken");
    localStorage.removeItem("employerInfo");

    setMenuOpen(false);
    setUserMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Premium Animated Nav Link Component
  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="relative text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
    </Link>
  );

  return (
    <nav
      className={`fixed w-full z-50 top-0 left-0 font-sans transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1 group"
          onClick={() => setMenuOpen(false)}
        >
          Job
          <span className="text-blue-600 group-hover:text-blue-500 transition-colors">
            One
          </span>
        </Link>

        {/* --- DESKTOP MENU --- */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/">Home</NavLink>

          {activeRole === "guest" && (
            <>
              <NavLink to="/jobs">Find Jobs</NavLink>
              <NavLink to="/employerregister">Post a Job</NavLink>
            </>
          )}

          {isUser && <NavLink to="/jobs">Find Jobs</NavLink>}
          {isEmployer && <NavLink to="/createjob">Post a Job</NavLink>}

          {/* Profile Dropdown / Login Button */}
          {activeRole !== "guest" ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 focus:outline-none transition-all bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-200"
              >
                <UserCircle
                  size={22}
                  className={userMenuOpen ? "text-blue-600" : ""}
                />
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${userMenuOpen ? "rotate-180 text-blue-600" : ""}`}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-2 z-50 border border-white/40 origin-top-right"
                  >
                    {isEmployer && (
                      <div className="px-2 space-y-1">
                        <Link
                          to="/employerdashboard"
                          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        <Link
                          to="/employerprofile"
                          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Building size={16} /> Company Profile
                        </Link>
                      </div>
                    )}

                    {isUser && (
                      <div className="px-2 space-y-1">
                        <Link
                          to="/userdashboard"
                          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User size={16} /> My Profile
                        </Link>
                        <Link
                          to="/myapplications"
                          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Briefcase size={16} /> My Applications
                        </Link>
                        <Link
                          to="/recommended-jobs"
                          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Sparkles size={16} className="text-amber-500" />{" "}
                          Recommended Jobs
                        </Link>
                      </div>
                    )}

                    <div className="border-t border-slate-100 my-2 mx-3"></div>
                    <div className="px-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors"
              >
                Login
              </Link>
              <button
                onClick={handleEmployerClick}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:-translate-y-0.5 transition-all text-sm flex items-center gap-2"
              >
                For Employers{" "}
                <span className="text-lg leading-none mb-0.5">›</span>
              </button>
            </div>
          )}
        </div>

        {/* --- MOBILE HAMBURGER --- */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="md:hidden absolute w-full left-0 top-[100%] bg-white/95 backdrop-blur-3xl border-b border-slate-200 shadow-2xl py-6 px-6 flex flex-col space-y-5"
          >
            <Link
              to="/"
              className="text-slate-700 font-bold text-lg hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            {activeRole === "guest" && (
              <>
                <Link
                  to="/jobs"
                  className="text-slate-700 font-bold text-lg hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Find Jobs
                </Link>
                <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                  <Link
                    to="/login"
                    className="text-center w-full py-3 border-2 border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <button
                    onClick={handleEmployerClick}
                    className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-colors"
                  >
                    For Employers
                  </button>
                </div>
              </>
            )}

            {isEmployer && (
              <>
                <Link
                  to="/createjob"
                  className="text-slate-700 font-bold text-lg hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Post a Job
                </Link>
                <Link
                  to="/employerdashboard"
                  className="text-slate-700 font-bold text-lg hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/employerprofile"
                  className="text-slate-700 font-bold text-lg hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Company Profile
                </Link>
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="text-rose-600 font-bold text-lg flex items-center gap-2 py-2"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              </>
            )}

            {isUser && (
              <>
                <Link
                  to="/jobs"
                  className="text-slate-700 font-bold text-lg hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Find Jobs
                </Link>
                <Link
                  to="/userdashboard"
                  className="text-slate-700 font-bold text-lg hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-slate-700 font-bold text-lg hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/myapplications"
                  className="text-slate-700 font-bold text-lg hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  My Applications
                </Link>
                <Link
                  to="/recommended-jobs"
                  className="text-slate-700 font-bold text-lg hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Recommended Jobs
                </Link>
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="text-rose-600 font-bold text-lg flex items-center gap-2 py-2"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
