import React from "react";
import { motion } from "framer-motion";
export default function LiveActivityTicker() {
    const activities = [
        "Software Engineer hired at Google",
        "Product Designer hired at Meta",
        "50 new PHP roles added",
        "Lucas G. just accepted an offer"
    ];

    return (
        <div className="bg-blue-600 py-3 overflow-hidden whitespace-nowrap">
            <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="flex gap-12"
            >
                {[...activities, ...activities].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-white font-bold text-sm uppercase tracking-widest">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        {text}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
