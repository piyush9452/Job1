import React from "react";
import { motion } from "framer-motion";
import { FaPlay, FaRocket, FaShieldAlt, FaUsers } from "react-icons/fa";

export default function VideoSection() {
    return (
        <section className="relative py-24 bg-white overflow-hidden">
            {/* 1. Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-blue-400/10 blur-[120px] rounded-full" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                {/* Header Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
                        <FaPlay className="text-[10px]" /> Product Tour
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                        How Job1 helps you <span className="text-blue-600">grow faster.</span>
                    </h2>
                    <p className="mt-6 text-lg md:text-xl text-slate-500 leading-relaxed">
                        Discover top talent or your next big opportunity. Watch how our
                        AI-driven matching system streamlines your entire career journey.
                    </p>
                </motion.div>

                {/* 2. Video Browser Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative mx-auto max-w-5xl"
                >
                    {/* Toolbar / Mockup Header */}
                    <div className="w-full h-10 bg-slate-900 rounded-t-2xl flex items-center px-4 gap-1.5 border-b border-white/10">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        <div className="ml-4 h-4 w-1/3 bg-white/5 rounded-md" />
                    </div>

                    {/* Video Container with Glass Border */}
                    <div className="relative group p-1 bg-slate-900 rounded-b-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full rounded-b-xl object-cover"
                        >
                            <source src="/video.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Optional Play Overlay (Visual only) */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-b-xl pointer-events-none">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                                <FaPlay size={24} className="ml-1" />
                            </div>
                        </div>
                    </div>

                    {/* 3. Floating Feature Badges (Visible on Desktop) */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="hidden lg:flex absolute -left-12 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 items-center gap-4 z-20"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <FaShieldAlt />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-900">Verified Profiles</p>
                            <p className="text-xs text-slate-500">Secure & Trusted</p>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                        className="hidden lg:flex absolute -right-12 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 items-center gap-4 z-20"
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <FaUsers />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-900">1M+ Community</p>
                            <p className="text-xs text-slate-500">Active Professionals</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* 4. Bottom Stats (Optional) */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    {[
                        { label: "Success Rate", value: "98%" },
                        { label: "Matches Daily", value: "12k+" },
                        { label: "Global Offices", value: "45" },
                        { label: "Happy Users", value: "2M+" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
