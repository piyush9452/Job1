import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import JobCategories from "../components/JobCategories";
import FeaturedJobs from "../components/FeaturedJobs";
//   this is home
export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-md">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-700">Job1</h1>
                    <div className="hidden md:flex space-x-6 items-center">
                        <Link to="/about"><button className="text-gray-700 hover:text-blue-700">About Us</button></Link>
                        <Link to="/services"><button className="text-gray-700 hover:text-blue-700">Services</button></Link>
                        <Link to="/contact"><button className="text-gray-700 hover:text-blue-700">Contact Us</button></Link>
                        <Link to="/login">
                            <button className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
                                Login
                            </button>
                        </Link>
                    </div>
                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button className="text-gray-700 focus:outline-none">
                            ☰
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <Hero/>
            <JobCategories/>
            <FeaturedJobs/>

            {/* Contact / Footer */}
            <footer id="contact" className="bg-blue-700 text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <h4 className="text-xl font-semibold mb-2">Contact Us</h4>
                    <p>Email: support@job1.com | Phone: +91 98765 43210</p>
                    <p className="mt-4 text-sm">© {new Date().getFullYear()} Job1 Portal. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
