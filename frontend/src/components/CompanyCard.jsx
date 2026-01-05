import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import demoIllustration from "../assets/skyscrapers.jpg";

export default function CompanyPromoCard() {
    return (
        <section className="px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[#0F172A] shadow-2xl"
            >
                {/* 1. Background Decor Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-blue-600/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] rounded-full bg-indigo-600/20 blur-[120px]" />

                <div className="relative flex flex-col items-center justify-between gap-12 p-8 md:flex-row md:p-20">

                    {/* LEFT SIDE: Content */}
                    <div className="z-10 text-left md:w-3/5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                            </span>
                            New Companies Joined
                        </motion.div>

                        <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl leading-[1.1]">
                            Find your next <br />
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                dream workplace.
                            </span>
                        </h2>

                        <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
                            Skip the generic listings. We’ve curated 500+ top-rated companies
                            hiring this month based on culture, growth, and benefits.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition-all hover:bg-blue-500 shadow-lg shadow-blue-600/25"
                            >
                                Explore Companies
                                <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                            </motion.button>

                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-[#0F172A] bg-slate-700" />
                                    ))}
                                </div>
                                <span>Join 10k+ applicants</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Visual Mockup */}
                    <div className="relative md:w-2/5">
                        {/* Main Image with decorative border */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
                        >
                            <img
                                src={demoIllustration}
                                alt="Skyscrapers"
                                className="h-[400px] w-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />
                        </motion.div>

                        {/* Floating Glass Cards */}
                        <motion.div
                            initial={{ x: 50 }}
                            whileInView={{ x: 0 }}
                            className="absolute -left-12 bottom-12 z-20 hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:block shadow-2xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
                                    <FaCheckCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Verified Employer</p>
                                    <p className="text-sm font-bold text-white">Google Cloud India</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20 }}
                            whileInView={{ y: 0 }}
                            className="absolute -right-6 top-10 z-20 hidden rounded-2xl border border-white/10 bg-blue-600/10 p-4 backdrop-blur-xl lg:block shadow-2xl"
                        >
                            <p className="text-2xl font-bold text-white leading-none">4.8★</p>
                            <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Avg. Rating</p>
                        </motion.div>
                    </div>

                </div>
            </motion.div>
        </section>
    );
}
