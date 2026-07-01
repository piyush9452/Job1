import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroRain.scss"; // Import the rain styles

const Hero = () => {
    const navigate = useNavigate();

    // Generate an array of 500 to map over for raindrops
    const drops = Array.from({ length: 500 });

    return (
        <section className="hero-rain-container flex items-center justify-center relative w-full overflow-hidden">
            {/* Animated Rain Background */}
            <div className="rain">
                {drops.map((_, i) => (
                    <div key={i} className="drop"></div>
                ))}
            </div>

            {/* Soft Glow Overlay - Optional but keeps the JobOne feel */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none z-10" />

            {/* CONTENT */}
            <div className="relative z-20 w-full max-w-7xl mx-auto py-20 px-6 md:px-20 flex flex-col md:flex-row items-center gap-12 pointer-events-none">
                
                {/* LEFT CONTENT */}
                <div className="flex-1 text-white pointer-events-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-md">
                        Build Your Career with <br/>
                        <span className="text-cyan-300">JobOne</span>
                    </h1>

                    <p className="mt-6 text-blue-50 text-lg max-w-xl font-medium drop-shadow-sm">
                        Create an impressive profile, showcase your skills, and get discovered by top employers in a dynamic tech-driven ecosystem.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate("/profile")}
                            className="px-8 py-3.5 bg-white text-blue-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-200"
                        >
                            Go to Profile
                        </button>

                        <button
                            onClick={() => navigate("/jobs")}
                            className="px-8 py-3.5 border-2 border-white/80 text-white rounded-xl font-bold hover:bg-white/10 hover:border-white transition backdrop-blur-sm"
                        >
                            Browse Jobs
                        </button>
                    </div>
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
