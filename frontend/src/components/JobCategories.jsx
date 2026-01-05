import React from "react";
import { motion } from "framer-motion";
import { FaCode, FaChartLine, FaPalette, FaBullhorn, FaHeadset, FaMicrochip } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const categories = [
    { name: "Development", count: "1.2k+ Jobs", icon: FaCode, color: "from-blue-500 to-cyan-400", size: "col-span-2 md:col-span-2" },
    { name: "Marketing", count: "850 Jobs", icon: FaBullhorn, color: "from-purple-500 to-pink-500", size: "col-span-2 md:col-span-1" },
    { name: "Design", count: "640 Jobs", icon: FaPalette, color: "from-orange-400 to-red-500", size: "col-span-2 md:col-span-1" },
    { name: "Finance", count: "420 Jobs", icon: FaChartLine, color: "from-emerald-400 to-teal-500", size: "col-span-2 md:col-span-2" },
    { name: "Tech Support", count: "310 Jobs", icon: FaHeadset, color: "from-indigo-500 to-blue-600", size: "col-span-2 md:col-span-1" },
    { name: "AI & ML", count: "95 Jobs", icon: FaMicrochip, color: "from-amber-400 to-orange-600", size: "col-span-2 md:col-span-1" },
];

export default function JobCategories() {
    const navigate = useNavigate();
    const handleCategoryClick = (category) => {
        navigate(`/jobs?title=${encodeURIComponent(category)}`);
    };
    return (
        <section className="py-24 bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">Categories</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">
                            Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Specialty</span>
                        </h2>
                    </div>
                    <button className="text-blue-600 font-semibold hover:underline flex items-center gap-2">
                        View all 24+ categories
                    </button>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={index}
                            onClick={() => handleCategoryClick(cat.name)}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className={`${cat.size} group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100 cursor-pointer`}
                        >
                            {/* Decorative Background Glow */}
                            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${cat.color} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`} />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg`}>
                                    <cat.icon size={24} />
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {cat.name}
                                    </h3>
                                    <p className="text-slate-500 font-medium text-sm mt-1">
                                        {cat.count}
                                    </p>
                                </div>
                            </div>

                            {/* Arrow that appears on hover */}
                            <div className="absolute bottom-8 right-8 opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                <div className="p-2 rounded-full bg-slate-50 text-slate-400">
                                    <FaCode className="rotate-45" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
