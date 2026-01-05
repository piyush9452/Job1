import React from "react";
import { FaWhatsapp, FaInstagram, FaLinkedinIn, FaFacebookF, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
// (Assumed components are updated with modern Tailwind styles)
import Hero from "../components/Hero";
import Testimonials from "../components/Testimonials";
import JobCategories from "../components/JobCategories";
import FeaturedJobs from "../components/FeaturedJobs";
import CompanyCard from "../components/CompanyCard";
import VideoSection from "../components/VideoSection";
import LiveTicker from "../components/LiveTicker";
import ProcessBento from "../components/ProcessBento";
import CTA from "../components/CTA";




export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-slate-900 font-sans">
            {/* 1. Hero Section - Now with a softer background gradient */}
            <header className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
                <Hero />
            </header>

            {/* 2. Main Content Wrapper */}
            <main className="flex-grow space-y-20 py-16">
                <LiveTicker />
                <JobCategories />



                <section className="bg-white py-16 border-y border-slate-100">
                    <div className="container mx-auto px-6 lg:px-20">
                        <CompanyCard />
                    </div>
                </section>

                <section className="container mx-auto px-6 lg:px-20">
                    <FeaturedJobs />
                </section>
                <ProcessBento />
                <CTA />
                <VideoSection />
                <Testimonials />

            </main>

            {/* 3. Modernized Footer */}
            <footer className="bg-[#0F172A] text-slate-300 w-full pt-16 pb-8">
                <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Mission */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Job1<span className="text-blue-500">Portal</span></h2>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Connecting talent with tomorrow. The most trusted platform for professionals and growing companies in North Delhi.
                        </p>
                        <div className="flex space-x-4">
                            {[FaFacebookF, FaLinkedinIn, FaInstagram, FaWhatsapp].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-600 hover:text-white transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links Grouped by Intent */}
                    <div className="grid grid-cols-2 lg:col-span-2 gap-8">
                        <div>
                            <h3 className="text-white font-semibold mb-6">Explore</h3>
                            <ul className="space-y-4 text-sm">
                                <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                                <li><Link to="/categories" className="hover:text-white transition-colors">Categories</Link></li>
                                <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-6">Company</h3>
                            <ul className="space-y-4 text-sm">
                                <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">Support</Link></li>
                                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold mb-6">Contact Us</h3>
                        <div className="flex items-start space-x-3 text-sm">
                            <FaPhoneAlt className="text-blue-500 mt-1" />
                            <span>+91 98765 43210</span>
                        </div>
                        <div className="flex items-start space-x-3 text-sm">
                            <FaEnvelope className="text-blue-500 mt-1" />
                            <span>support@job1.com</span>
                        </div>
                        <div className="flex items-start space-x-3 text-sm">
                            <FaMapMarkerAlt className="text-blue-500 mt-1" />
                            <span>329 Sarojini Street, Delhi, India.</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 text-center text-xs opacity-60">
                    <p>© {new Date().getFullYear()} Job1 Portal by Simtrak Solutions. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}
