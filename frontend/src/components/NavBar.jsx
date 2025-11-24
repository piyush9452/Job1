import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaPowerOff, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userMenuRef = useRef(null);

    // Get user & employer info from localStorage
    const userInfo = localStorage.getItem("userToken");
    const employerInfo = localStorage.getItem("employerToken");

    // Logout handler (for both)
    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("employerToken");
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

    // Hide navbar on login/register pages
    if (
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/employerregister"
    ) {
        return null;
    }

    const handleEmployerClick = () => {
        if (employerInfo) {
            navigate("/employerdashboard");
        } else {
            navigate("/employerregister");
        }
    };

    return (
        <nav className="bg-white shadow-md fixed w-full z-50 top-0 left-0">
            <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                {/* Brand */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors"
                >
                    Job1
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-6">
                    {/* Home link changes slightly for employers */}
                    <Link
                        to="/"
                        className="text-gray-700 hover:text-blue-700"
                    >
                        Home
                    </Link>

                    {/* Job links only for users */}
                    {!employerInfo && (
                        <>
                            <Link to="/jobs" className="text-gray-700 hover:text-blue-700">
                                Find part-time Jobs
                            </Link>
                            <Link to="/createjob" className="text-gray-700 hover:text-blue-700">
                                Post part-time Jobs
                            </Link>
                        </>
                    )}

                    {/* ✅ Employer Logged In */}
                    {employerInfo ? (
                        <>
                            <Link
                                to="/createjob"
                                className="text-gray-700 hover:text-blue-700"
                            >
                                Post a Job
                            </Link>

                            <div className="relative" ref={userMenuRef}>
                                <FaUserCircle
                                    className="text-gray-700 hover:text-blue-700 text-3xl cursor-pointer"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                />
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
                                        <Link
                                            to="/employerprofile"
                                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/employerdashboard"
                                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            My Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <FaPowerOff /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : userInfo ? (
                        // ✅ User Logged In
                        <>
                            <div className="relative" ref={userMenuRef}>
                                <FaUserCircle
                                    className="text-gray-700 hover:text-blue-700 text-3xl cursor-pointer"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                />
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
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
                                        <hr className="my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <FaPowerOff /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        // ✅ No one logged in
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-gray-700 hover:text-blue-700">
                                Login
                            </Link>
                            <button
                                onClick={handleEmployerClick}
                                className="text-blue-600 font-medium hover:text-blue-800 transition"
                            >
                                For Employers ➔
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="focus:outline-none text-gray-700 hover:text-blue-700"
                    >
                        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
