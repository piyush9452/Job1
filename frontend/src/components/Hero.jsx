import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import heroVideo from "../assets/herovideo.mp4";

export default function HeroSection() {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const navigate = useNavigate();

    // --- Typewriter Logic ---
    const words = ["Dream Career", "Future Role", "Remote Gig", "Next Chapter"];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const handleTyping = () => {
            const fullWord = words[currentWordIndex];

            if (isDeleting) {
                // Backspacing logic
                setDisplayText(fullWord.substring(0, displayText.length - 1));
                setTypingSpeed(50); // Deletes faster than it types
            } else {
                // Typing logic
                setDisplayText(fullWord.substring(0, displayText.length + 1));
                setTypingSpeed(150);
            }

            // Switch to deleting mode when word is finished
            if (!isDeleting && displayText === fullWord) {
                setTimeout(() => setIsDeleting(true), 2000); // Pause at end of word
            }
            // Switch to next word when word is fully deleted
            else if (isDeleting && displayText === "") {
                setIsDeleting(false);
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, currentWordIndex]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/jobs?title=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}`);
    };

    return (
        <section className="relative w-full h-[100vh] min-h-[700px] flex items-center justify-center overflow-hidden font-sans">
            <video
                className="absolute inset-0 w-full h-full object-cover"
                src={heroVideo}
                autoPlay loop muted playsInline
            />
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />

            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Enlarged Badge */}
                    <span className="inline-block px-8 py-3 rounded-full bg-blue-600/20 border border-blue-400/40 text-blue-200 text-lg md:text-xl font-bold mb-10 tracking-widest uppercase shadow-lg">
                        ✨ Your first step to future
                    </span>

                    {/* Typewriter Headline */}
                    <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter">
                        Find your <br />
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent min-h-[1.2em] inline-block">
                            {displayText}
                            <span className="text-blue-400 animate-pulse ml-1">|</span>
                        </span>
                    </h1>

                    <p className="mt-8 text-slate-300 text-xl md:text-2xl font-light max-w-3xl mx-auto">
                        Stop searching and start growing. Discover the roles that fit your life.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.form
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    onSubmit={handleSearch}
                    className="mt-14 flex flex-col md:flex-row items-center bg-white/10 backdrop-blur-3xl p-2 rounded-[2.5rem] border border-white/20 shadow-2xl max-w-4xl mx-auto group"
                >
                    <div className="flex items-center px-8 py-5 flex-1 w-full md:border-r border-white/10">
                        <FaBriefcase className="text-blue-400 mr-4 shrink-0 text-xl" />
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Job title or company"
                            className="w-full bg-transparent outline-none text-white placeholder-slate-400 text-xl"
                        />
                    </div>

                    <div className="flex items-center px-8 py-5 flex-1 w-full">
                        <FaMapMarkerAlt className="text-blue-400 mr-4 shrink-0 text-xl" />
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Location"
                            className="w-full bg-transparent outline-none text-white placeholder-slate-400 text-xl"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-12 py-5 rounded-[2rem] transition-all text-xl shadow-lg hover:shadow-blue-500/50"
                    >
                        Search
                    </button>
                </motion.form>
            </div>
        </section>
    );
}
