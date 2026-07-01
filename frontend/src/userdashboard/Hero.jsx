import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaBriefcase, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import "./HeroRain.scss"; // Import the rain styles

const Hero = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/jobs?title=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}`);
    };

    // Generate an array of 100 to map over for raindrops (optimized from 500)
    const drops = Array.from({ length: 100 });

    return (
        <section className="hero-rain-container flex items-center justify-center relative w-full overflow-hidden">
            {/* Animated Glass Blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        x: ["0vw", "20vw", "-10vw", "10vw", "0vw"],
                        y: ["0vh", "15vh", "5vh", "-10vh", "0vh"],
                        scale: [1, 1.1, 0.9, 1.2, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-cyan-500/20 mix-blend-screen blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: ["0vw", "-20vw", "10vw", "-15vw", "0vw"],
                        y: ["0vh", "-10vh", "20vh", "5vh", "0vh"],
                        scale: [1, 0.9, 1.1, 0.9, 1],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-blue-600/20 mix-blend-screen blur-[120px]"
                />
                <motion.div
                    animate={{
                        x: ["0vw", "15vw", "-20vw", "5vw", "0vw"],
                        y: ["0vh", "10vh", "-15vh", "20vh", "0vh"],
                        scale: [1, 1.2, 0.8, 1.1, 1],
                    }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-indigo-500/20 mix-blend-screen blur-[90px]"
                />
            </div>

            {/* Animated Rain Background */}
            <div className="rain">
                {drops.map((_, i) => (
                    <div key={i} className="drop"></div>
                ))}
            </div>

            {/* Soft Glow Overlay - Optional but keeps the JobOne feel */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none z-10" />

            {/* CONTENT */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-20 flex flex-col md:flex-row items-center gap-12 pointer-events-none">
                
                {/* LEFT CONTENT */}
                <div className="flex-1 text-white pointer-events-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-md">
                        Build Your Career with <br/>
                        <span className="text-cyan-300">JobOne</span>
                    </h1>

                    <p className="mt-6 text-blue-50 text-lg max-w-xl font-medium drop-shadow-sm">
                        Create an impressive profile, showcase your skills, and get discovered by top employers in a dynamic tech-driven ecosystem.
                    </p>

                    <div className="mt-8 flex flex-row flex-wrap lg:flex-nowrap gap-3 items-center">
                        <button
                            onClick={() => {
                                const section = document.getElementById("jobs-near-me");
                                if (section) {
                                    section.scrollIntoView({ behavior: "smooth" });
                                    setTimeout(() => window.dispatchEvent(new Event("autoTriggerLocation")), 500);
                                }
                            }}
                            className="px-5 py-3 bg-gradient-to-r from-blue-500/40 to-cyan-400/40 backdrop-blur-sm border border-cyan-300/50 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:scale-105 transition transform duration-200 text-sm md:text-base whitespace-nowrap"
                        >
                            Find Jobs Near Me
                        </button>

                        <button
                            onClick={() => {
                                const section = document.getElementById("ai-recommended-jobs");
                                if (section) section.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="px-5 py-3 bg-gradient-to-r from-indigo-500/30 to-purple-400/30 backdrop-blur-sm border border-indigo-300/50 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:-translate-y-1 transition transform duration-200 text-sm md:text-base whitespace-nowrap"
                        >
                            AI Recommended Jobs
                        </button>

                        <button
                            onClick={() => navigate("/profile")}
                            className="px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 hover:border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition transform duration-200 text-sm md:text-base whitespace-nowrap"
                        >
                            Go to Profile
                        </button>

                        <button
                            onClick={() => navigate("/jobs")}
                            className="px-5 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 rounded-xl font-bold hover:bg-white/10 hover:border-white/30 hover:text-white transition duration-200 text-sm md:text-base whitespace-nowrap"
                        >
                            Browse Jobs
                        </button>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="mt-8 w-full max-w-2xl flex flex-col md:flex-row items-center bg-white/5 backdrop-blur-md p-2 rounded-3xl md:rounded-full border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all focus-within:border-cyan-400/50 focus-within:bg-white/10 gap-2 md:gap-0"
                    >
                        <div className="flex items-center px-4 py-3 md:py-2 flex-1 w-full md:border-r border-white/20 group">
                            <FaBriefcase className="text-cyan-400/70 group-focus-within:text-cyan-400 mr-3 shrink-0 text-base transition-colors" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Job title, keyword, or company"
                                className="w-full bg-transparent outline-none text-white placeholder-blue-100/70 text-sm md:text-base font-medium"
                            />
                        </div>

                        <div className="flex items-center px-4 py-3 md:py-2 flex-1 w-full border-t border-white/20 md:border-t-0 group">
                            <FaMapMarkerAlt className="text-cyan-400/70 group-focus-within:text-cyan-400 mr-3 shrink-0 text-base transition-colors" />
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City, state, or 'Remote'"
                                className="w-full bg-transparent outline-none text-white placeholder-blue-100/70 text-sm md:text-base font-medium"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-3.5 md:py-3 rounded-2xl md:rounded-full transition-all text-sm md:text-base shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] flex items-center justify-center gap-2"
                        >
                            <FaSearch size={14} />
                            Search
                        </button>
                    </form>
                </div>

                {/* RIGHT VISUAL - Glassmorphism Stats Grid */}
                <div className="flex-1 flex justify-center items-center pointer-events-auto w-full">
                    <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-lg">
                        
                        {/* Stat 1 */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:-translate-y-2 transition transform duration-300">
                            <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">500+</span>
                            <span className="mt-2 text-sm md:text-base font-medium text-blue-100 uppercase tracking-wider">Live Jobs</span>
                        </div>

                        {/* Stat 2 */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:-translate-y-2 transition transform duration-300">
                            <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">100+</span>
                            <span className="mt-2 text-sm md:text-base font-medium text-blue-100 uppercase tracking-wider">Companies</span>
                        </div>

                        {/* Stat 3 */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:-translate-y-2 transition transform duration-300">
                            <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">1,000+</span>
                            <span className="mt-2 text-sm md:text-base font-medium text-blue-100 uppercase tracking-wider">Candidates</span>
                        </div>

                        {/* Stat 4 */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:-translate-y-2 transition transform duration-300">
                            <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">50+</span>
                            <span className="mt-2 text-sm md:text-base font-medium text-blue-100 uppercase tracking-wider">Locations</span>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
