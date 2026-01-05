import React from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaSearchDollar, FaPaperPlane, FaCheckDouble } from "react-icons/fa";

export default function ProcessBento() {
    const steps = [
        { title: "Create Profile", desc: "Build your AI-optimized resume in minutes.", icon: <FaUserPlus />, color: "bg-blue-500", size: "md:col-span-2" },
        { title: "Smart Search", desc: "Filtered by your skills.", icon: <FaSearchDollar />, color: "bg-indigo-500", size: "md:col-span-1" },
        { title: "Quick Apply", desc: "One-click applications.", icon: <FaPaperPlane />, color: "bg-purple-500", size: "md:col-span-1" },
        { title: "Get Hired", desc: "Direct chat with HRs.", icon: <FaCheckDouble />, color: "bg-emerald-500", size: "md:col-span-2" },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Your path to a new career</h2>
                    <p className="text-slate-500 mt-4">Simplified, automated, and designed for speed.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map((step, i) => (
                        <motion.div
                            whileHover={{ y: -5 }}
                            key={i}
                            className={`${step.size} p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group`}
                        >
                            <div className={`${step.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
