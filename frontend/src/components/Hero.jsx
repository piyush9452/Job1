import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        // navigate to jobs page with query parameters
        navigate(`/jobs?title=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}`);
    };

    return (
        <section className="relative bg-gradient-to-br from-blue-50 to-white py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
                {/* Heading */}
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
                    There are <span className="text-blue-600">93,178</span> Postings here for you!
                </h2>
                <p className="mt-4 text-gray-600">
                    Find Jobs, Employment & Career Opportunities
                </p>

                {/* Search Bar */}
                <div className="mt-8 bg-white shadow-lg rounded-xl flex flex-col md:flex-row items-stretch overflow-hidden">
                    {/* Job Title */}
                    <div className="flex items-center px-4 py-3 flex-1 border-b md:border-b-0 md:border-r">
                        {/* Search Icon */}
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="job title, keywords or company"
                            className="w-full outline-none text-gray-700"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Location */}
                    <div className="flex items-center px-4 py-3 flex-1 border-b md:border-b-0 md:border-r">
                        {/* Location Icon */}
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M12 11c1.38 0 2.5-1.12 2.5-2.5S13.38 6 12 6s-2.5 1.12-2.5 2.5S10.62 11 12 11z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M12 22s8-7.58 8-12a8 8 0 10-16 0c0 4.42 8 12 8 12z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="City or Postcode"
                            className="w-full outline-none text-gray-700"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-8 py-3 hover:bg-blue-700 transition"
                    >
                        Find Jobs
                    </button>
                </div>

                {/* Popular Searches */}
                <p className="mt-4 text-gray-500 text-sm">
                    Popular Searches : Designer, Web, Developer, IOS, PHP, Senior, Engineer
                </p>
            </div>
        </section>
    );
}
