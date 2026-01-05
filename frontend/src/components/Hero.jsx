import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import heroVideo from "../assets/herovideo.mp4";

export default function HeroSection() {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [count, setCount] = useState(178);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/jobs?title=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}`);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => {
                let newValue = prev + (Math.random() > 0.5 ? 1 : -1);
                return Math.max(151, Math.min(999, newValue));
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const displayCount = `93,${String(count).padStart(3, "0")}`;

    return (
        <section className="relative w-full h-[100vh] min-h-[700px] flex items-center justify-center overflow-hidden">
            {/* 1. Video Background with improved Dark Overlay */}
            <video
                className="absolute inset-0 w-full h-full object-cover scale-105"
                src={heroVideo}
                autoPlay
                loop
                muted
                playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/80 backdrop-blur-[3px]" />

            {/* 2. Content */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-sm font-semibold mb-6">
                        ✨ Your future starts here
                    </span>

                    <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                        There are{" "}
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                            {displayCount}
                        </span>{" "}
                        <br /> opportunities waiting.
                    </h1>

                    <p className="mt-6 text-slate-300 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Connect with top-tier companies and find the role that matches your expertise.
                    </p>
                </motion.div>

                {/* 3. Modern Search Bar (Glassmorphism) */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    onSubmit={handleSearch}
                    className="mt-12 group relative flex flex-col md:flex-row items-center bg-white/10 backdrop-blur-2xl p-2 rounded-[2rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-4xl mx-auto hover:border-blue-500/50 transition-all duration-500"
                >
                    <div className="flex items-center px-6 py-4 flex-1 w-full border-b md:border-b-0 md:border-r border-white/10">
                        <FaBriefcase className="text-blue-400 mr-4 shrink-0" />
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Job title or company"
                            className="w-full bg-transparent outline-none text-white placeholder-slate-400 text-base"
                        />
                    </div>

                    <div className="flex items-center px-6 py-4 flex-1 w-full">
                        <FaMapMarkerAlt className="text-blue-400 mr-4 shrink-0" />
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City or postcode"
                            className="w-full bg-transparent outline-none text-white placeholder-slate-400 text-base"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-[1.5rem] transition-all duration-300 shadow-lg shadow-blue-600/30 active:scale-95"
                    >
                        Search
                    </button>
                </motion.form>

                {/* 4. Popular Tags as Pills */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 flex flex-wrap justify-center items-center gap-3"
                >
                    <span className="text-slate-400 text-sm font-medium mr-2">Popular:</span>
                    {["Designer", "Developer", "IOS", "PHP", "Senior"].map((tag) => (
                        <button
                            key={tag}
                            className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/10 hover:text-white transition-all"
                        >
                            {tag}
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
