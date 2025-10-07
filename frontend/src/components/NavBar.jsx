import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaPowerOff } from "react-icons/fa";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null); // Reference for dropdown menu

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="bg-white shadow-md relative">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-700">Job1</h1>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6 items-center">
                    <Link to="/">
                        <button className="text-gray-700 hover:text-blue-700">Home</button>
                    </Link>
                    <Link to="/about">
                        <button className="text-gray-700 hover:text-blue-700">About Us</button>
                    </Link>
                    <Link to="/services">
                        <button className="text-gray-700 hover:text-blue-700">Services</button>
                    </Link>
                    <Link to="/contact">
                        <button className="text-gray-700 hover:text-blue-700">Contact Us</button>
                    </Link>

                    {/* User Profile Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="focus:outline-none"
                        >
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
                                    to="/employeedashboard"
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Employee Dashboard
                                </Link>
                                <Link
                                    to="/employerdashboard"
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Employer Dashboard
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
