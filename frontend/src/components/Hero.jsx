import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
                const change = Math.random() > 0.5 ? 1 : -1;
                let newValue = prev + change;
                if (newValue < 150) newValue = 151;
                if (newValue > 999) newValue = 999;
                return newValue;
            });
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    const displayCount = `93,${String(count).padStart(3, "0")}`;

    return (
        <section className="relative w-full h-[90vh] flex items-center py-95 justify-center overflow-hidden">
            {/* Background Video */}
            <video
                className="absolute inset-0 w-full h-full object-cover"
                src={heroVideo}
                autoPlay
                loop
                muted
                playsInline
            />

            {/* Optional: overlay for better text visibility */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />

            {/* Foreground content */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-white">
                    There are{" "}
                    <span className="text-blue-400">{displayCount}</span>{" "}
                    Postings here for you!
                </h2>

                <p className="mt-3 text-white text-sm md:text-base font-medium">
                    Find Jobs, Employment & Career Opportunities
                </p>

                {/* Desktop Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="hidden md:flex mt-10 bg-white rounded-xl shadow-lg overflow-hidden max-w-3xl mx-auto"
                >
                    <div className="flex items-center px-6 py-4 flex-1 border-r border-gray-200">
                        <svg
                            className="w-5 h-5 text-gray-400 mr-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z"
                            />
                        </svg>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="job title, keywords or company"
                            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
                        />
                    </div>

                    <div className="flex items-center px-6 py-4 flex-1 border-r border-gray-200">
                        <svg
                            className="w-5 h-5 text-gray-400 mr-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 11c1.38 0 2.5-1.12 2.5-2.5S13.38 6 12 6s-2.5 1.12-2.5 2.5S10.62 11 12 11z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 22s8-7.58 8-12a8 8 0 10-16 0c0 4.42 8 12 8 12z"
                            />
                        </svg>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City or Postcode"
                            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3"
                    >
                        Find Jobs
                    </button>
                </form>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="md:hidden mt-8 max-w-sm mx-auto">
                    <div className="bg-white rounded-lg shadow-sm px-4 py-3 flex items-center mb-3">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="job title, keywords or company"
                            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
                        />
                    </div>
                    <div className="bg-white rounded-lg shadow-sm px-4 py-3 flex items-center mb-4">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City or Postcode"
                            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md"
                    >
                        Find Jobs
                    </button>
                </form>

                <p className="mt-6 text-white text-sm">
                    Popular Searches: Designer, Web, Developer, IOS, PHP, Senior, Engineer
                </p>
            </div>
        </section>
    );
}
