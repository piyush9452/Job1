import React from "react";

export default function HeroSection() {
    return (
        <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 px-6">
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
                        {/* Search Icon (SVG) */}
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="job title, keywords or company"
                            className="w-full outline-none text-gray-700"
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
                        />
                    </div>
                    {/* Button */}
                    <button className="bg-blue-600 text-white px-8 py-3 hover:bg-blue-700 transition">
                        Find Jobs
                    </button>
                </div>

                {/* Popular Searches */}
                <p className="mt-4 text-gray-500 text-sm">
                    Popular Searches : Designer, Web, Developer, IOS, PHP, Senior, Engineer
                </p>
            </div>

            {/* Floating Cards */}
            <div className="absolute top-10 right-10 bg-white shadow-md rounded-lg px-4 py-2 flex items-center space-x-2">
                {/* Mail Icon */}
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M4 4h16v16H4V4z M22 6l-10 7L2 6" />
                </svg>
                <span className="text-sm text-gray-700">Work Inquiry From Ali Tufan</span>
            </div>

            <div className="absolute top-24 left-10 bg-white shadow-md rounded-lg px-4 py-2 flex items-center space-x-2">
                {/* Check Icon */}
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-700">100% Reliable</span>
            </div>

            <div className="absolute bottom-20 left-16 bg-white shadow-md rounded-lg px-4 py-2 flex items-center space-x-2">
                {/* Briefcase Icon */}
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M6 7V6a2 2 0 012-2h8a2 2 0 012 2v1h2v13H4V7h2z" />
                </svg>
                <span className="text-sm text-gray-700">Creative Agency</span>
            </div>

            <div className="absolute bottom-10 right-16 bg-white shadow-md rounded-lg px-4 py-2 flex items-center space-x-2">
                {/* Upload Icon */}
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 9l5-5 5 5M12 4v12" />
                </svg>
                <span className="text-sm text-gray-700">Upload Your CV</span>
            </div>
        </section>
    );
}
