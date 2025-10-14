import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; //  import useLocation
import { FaUserCircle, FaPowerOff } from "react-icons/fa";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); //  current route info
    const menuRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate("/login");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Hide navbar on login/register pages
    if (location.pathname === "/login" || location.pathname === "/register") {
        return null;
    }

    return (
        <nav className="bg-white shadow-md relative">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-700">Job1</h1>

                <div className="hidden md:flex space-x-6 items-center">
                    <Link to="/">
                        <button className="text-gray-700 hover:text-blue-700">Home</button>
                    </Link>
                    <Link to="/jobs">
                        <button className="text-gray-700 hover:text-blue-700">Find Jobs</button>
                    </Link>
                    <Link to="/createjob">
                        <button className="text-gray-700 hover:text-blue-700">Post a Job</button>
                    </Link>

                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setMenuOpen((prev) => !prev)} className="focus:outline-none">
                            <FaUserCircle className="text-gray-700 hover:text-blue-700 text-3xl cursor-pointer" />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl py-2 z-50">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    My Profile
                                </Link>
                                <Link
                                    to="/myapplications"
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    My Applications
                                </Link>
                                <Link
                                    to="/employerdashboard"
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    My Job Posts
                                </Link>

                                <hr className="my-1" />

                                <Link to="/login">
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Login
                                    </button>
                                </Link>

                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    <FaPowerOff />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
