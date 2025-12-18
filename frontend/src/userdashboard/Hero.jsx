import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/backgroundImage.png";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative w-full overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400" />

            {/* Soft Glow Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_40%)]" />

            {/* CONTENT */}
            <div className="relative z-10 max-w-7xl mx-auto py-20 px-6 md:px-20 flex flex-col md:flex-row items-center gap-12">

                {/* LEFT CONTENT */}
                <div className="flex-1 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Build Your Career with
                        <span className="text-white"> JobOne</span>
                    </h1>

                    <p className="mt-4 text-blue-100 text-lg max-w-xl">
                        Create an impressive profile, showcase your skills, and get discovered by top employers.
                    </p>

                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={() => navigate("/profile")}
                            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition"
                        >
                            Go to Profile
                        </button>

                        <button
                            onClick={() => navigate("/jobs")}
                            className="px-6 py-3 border border-white text-white rounded-xl hover:bg-white/10 transition"
                        >
                            Browse Jobs
                        </button>
                    </div>
                </div>

                {/* RIGHT VISUAL */}
                <div className="flex-1 flex justify-center">
                    <img
                        src={backgroundImage}
                        alt="Hero Illustration"
                        className="w-[300px] md:w-[420px] drop-shadow-2xl"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
