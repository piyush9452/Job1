// src/components/CompanyPromoCard.jsx
import React from "react";
import { motion } from "framer-motion";
import demoIllustration from "../assets/skyscrapers.jpg"; // replace with your animated image or Lottie later

export default function CompanyPromoCard() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br mb-15 from-blue-400 via-blue-500 to-indigo-600 p-[2px] shadow-xl space-y-10 mx-auto max-w-6xl"
        >
            {/* Inner white container */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-3xl p-10 md:p-16">

                {/* LEFT SIDE: Text */}
                <div className="text-left md:w-1/2 space-y-5">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        Check out your favorite companies
                    </h2>
                    <p className="text-gray-700 text-base md:text-lg max-w-md">
                        Discover the most preferred companies hiring this month and explore top opportunities.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold border border-blue-200 shadow-sm hover:bg-blue-50 transition"
                    >
                        Explore Companies
                    </motion.button>
                </div>

                {/* RIGHT SIDE: Animated Image */}
                <motion.div
                    className="mt-10 md:mt-0 md:w-1/2 flex justify-center"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    <img
                        src={demoIllustration}
                        alt="Animated Illustration"
                        className="w-72 md:w-96 rounded-2xl drop-shadow-2xl"
                    />
                </motion.div>
            </div>
        </motion.section>
    );
}
