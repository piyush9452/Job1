import React from "react";
import { FaWhatsapp, FaInstagram, FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Testimonials from "../components/Testimonials";
import JobCategories from "../components/JobCategories";
import FeaturedJobs from "../components/FeaturedJobs";
import CompanyCard from "../components/CompanyCard";
import VideoSection from "../components/VideoSection";


export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Main sections */}
            <Hero />
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
                <JobCategories />
                < CompanyCard />
            </div>
                <FeaturedJobs />
                <VideoSection />
                <Testimonials />

            {/* Footer */}
            <footer className="bg-blue-900 text-white w-full">
                {/* Top section */}
                <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 border-b border-blue-700">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Job1 Portal</h2>
                        <p className="font-semibold">Call us</p>
                        <p className="text-white font-medium hover:text-gray-200 cursor-pointer">
                            +91 98765 43210
                        </p>
                        <p className="mt-3 text-sm">
                            329 Sarojini Street, North Delhi VIC 3051, India.
                        </p>
                        <p className="mt-2 text-sm hover:text-gray-200 cursor-pointer">
                            support@job1.com
                        </p>
                    </div>

                    {/* For Candidates */}
                    <div>
                        <h3 className="font-bold mb-4">For Candidates</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-gray-200 cursor-pointer">Browse Jobs</li>
                            <li className="hover:text-gray-200 cursor-pointer">Browse Categories</li>
                        </ul>
                    </div>

                    {/* For Employers */}
                    <div>
                        <h3 className="font-bold mb-4">For Employers</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-gray-200 cursor-pointer">Post Jobs</li>
                            <li className="hover:text-gray-200 cursor-pointer">Manage Listings</li>
                        </ul>
                    </div>

                    {/* Info Section */}
                    <div>
                        <h3 className="font-bold mb-4">Info</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/about" className="hover:text-gray-200 block">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-gray-200 block">Contact Us</Link>
                            </li>
                            <li>
                                <Link to="/services" className="hover:text-gray-200 block">Our Services</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Helpful Resources */}
                    <div>
                        <h3 className="font-bold mb-4">Helpful Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-gray-200 cursor-pointer">Site Map</li>
                            <li className="hover:text-gray-200 cursor-pointer">Terms of Use</li>
                            <li className="hover:text-gray-200 cursor-pointer">Privacy Center</li>
                            <li className="hover:text-gray-200 cursor-pointer">Security Center</li>
                            <li className="hover:text-gray-200 cursor-pointer">Accessibility Center</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between text-sm gap-4">
                    <p className="text-center md:text-left">
                        © {new Date().getFullYear()} Job1 Portal by Simtrak Solutions
                    </p>

                    <div className="flex space-x-5">
                        <a href="#" className="hover:text-gray-200"><FaWhatsapp size={18} /></a>
                        <a href="#" className="hover:text-gray-200"><FaInstagram size={18} /></a>
                        <a href="#" className="hover:text-gray-200"><FaLinkedinIn size={18} /></a>
                        <a href="#" className="hover:text-gray-200"><FaFacebookF size={18} /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
