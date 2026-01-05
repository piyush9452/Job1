import React from "react";
import { motion } from "framer-motion";
import { FaBriefcase, FaUserPlus, FaChartLine, FaPalette, FaBullhorn, FaHeadset, FaMicrochip } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function CTASection() {
    return (
        <section className="py-20">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Candidate Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 rounded-[2.5rem] text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-4">Are you looking for a job?</h3>
                            <p className="text-blue-100 mb-8 max-w-xs">Join thousands of professionals and find your dream role today.</p>
                            <Link to="/jobs"><button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">Apply Now</button></Link>
                        </div>
                        <FaBriefcase className="absolute -bottom-10 -right-10 text-white/10 text-[15rem] group-hover:rotate-12 transition-transform duration-500" />
                    </div>

                    {/* Employer Card */}
                    <div className="bg-slate-900 p-12 rounded-[2.5rem] text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-4">Are you hiring talent?</h3>
                            <p className="text-slate-400 mb-8 max-w-xs">Post your open roles and reach the top 1% of candidates in North Delhi.</p>
                            <Link to="/createjob"><button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-colors">Post a Job</button></Link>
                        </div>
                        <FaUserPlus className="absolute -bottom-10 -right-10 text-white/5 text-[15rem] group-hover:-rotate-12 transition-transform duration-500" />
                    </div>
                </div>
            </div>
        </section>
    );
}
