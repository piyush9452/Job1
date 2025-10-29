import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
    { name: "Accounting / Finance", icon: (
            <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1C9.243 1 7 3.243 7 6v1H5v4h2v10h10V11h2V7h-2V6c0-2.757-2.243-5-5-5zm-1 5h2c.552 0 1 .449 1 1v1H10V7c0-.551.448-1 1-1z"/>
            </svg>
        )},
    { name: "Marketing", icon: (
            <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4v16h2v-7h3l5 7h2l-5-7c2.757 0 5-2.243 5-5s-2.243-5-5-5H4z"/>
            </svg>
        )},
    { name: "Design", icon: (
            <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l4 8H8l4-8zm0 20l-4-8h8l-4 8zM2 12l8-4v8l-8-4zm20 0l-8 4V8l8 4z"/>
            </svg>
        )},
    { name: "Development", icon: (
            <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 17l-5-5 5-5v10zm8-10l5 5-5 5V7z"/>
            </svg>
        )},
    { name: "Human Resource", icon: (
            <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm-7 8c0-2.67 5.33-4 7-4s7 1.33 7 4v2H5v-2z"/>
            </svg>
        )},
    { name: "Automotive Jobs", icon: (
            <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 11l1.5-4.5h11L19 11H5zm1 2h12v5H6v-5zm3 6a1.5 1.5 0 11-.001-2.999A1.5 1.5 0 019 19zm6 0a1.5 1.5 0 11-.001-2.999A1.5 1.5 0 0115 19z"/>
            </svg>
        )},
    { name: "Customer Service", icon: (
            <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1a11 11 0 00-11 11v5a4 4 0 004 4h2v-8H5v-1a7 7 0 1114 0v1h-2v8h2a4 4 0 004-4v-5a11 11 0 00-11-11z"/>
            </svg>
        )},
    { name: "Health and Care", icon: (
            <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 7h-6V3H9v4H3v6h6v8h6v-8h6V7z"/>
            </svg>
        )},
    { name: "Project Management", icon: (
            <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 11h5v-2h-5V6h-2v5H6v2h5v5h2z"/>
            </svg>
        )},
];

export default function JobCategories() {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate(`/jobs?title=${encodeURIComponent(category)}`);
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900">Popular Job Categories</h2>
                <p className="text-gray-500 mt-2">2020 jobs live - 293 added today.</p>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            onClick={() => handleCategoryClick(cat.name)}
                            className="group flex items-center space-x-4 p-6 border rounded-lg shadow-sm hover:shadow-lg transition duration-300 bg-white hover:bg-indigo-600 cursor-pointer"
                        >
                            <div className="p-3 bg-indigo-50 rounded-lg ">
                                {cat.icon}
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 group-hover:text-white transition">
                                {cat.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}