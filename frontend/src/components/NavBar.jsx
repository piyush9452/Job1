import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaPowerOff, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userMenuRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
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
    if (location.pathname === "/login" || location.pathname === "/register") {
        return null;
    }

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    return (
        <>
            {/* Navbar */}
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
                        <Link to="/" className="text-gray-700 hover:text-blue-700">
                            Home
                        </Link>
                        <Link to="/jobs" className="text-gray-700 hover:text-blue-700">
                            Find Jobs
                        </Link>
                        <Link to="/createjob" className="text-gray-700 hover:text-blue-700">
                            Post a Job
                        </Link>

                        {/* User dropdown */}
                        {userInfo ? (
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
                                        <Link
                                            to="/jobposts"
                                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            My Job Posts
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
                        ) : (
                            <Link to="/login" className="text-gray-700 hover:text-blue-700">
                                Login
                            </Link>
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

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden bg-white shadow-md border-t border-gray-100 animate-slideDown">
                        <Link
                            to="/"
                            onClick={() => setMenuOpen(false)}
                            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                            Home
                        </Link>
                        <Link
                            to="/jobs"
                            onClick={() => setMenuOpen(false)}
                            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                            Find Part-time Jobs
                        </Link>
                        <Link
                            to="/createjob"
                            onClick={() => setMenuOpen(false)}
                            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                            Post a Job
                        </Link>

                        {userInfo ? (
                            <>
                                <hr className="my-1" />
                                <Link
                                    to="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    My Profile
                                </Link>
                                <Link
                                    to="/myapplications"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    My Applications
                                </Link>
                                <Link
                                    to="/jobposts"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    My Job Posts
                                </Link>
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
                                >
                                    <FaPowerOff /> Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                )}
            </nav>

        </>
    );
}
