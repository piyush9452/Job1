import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaBriefcase, FaSearch } from "react-icons/fa";
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
        setDisplayText(fullWord.substring(0, displayText.length - 1));
        setTypingSpeed(40);
      } else {
        setDisplayText(fullWord.substring(0, displayText.length + 1));
        setTypingSpeed(120);
      }

      if (!isDeleting && displayText === fullWord) {
        setTimeout(() => setIsDeleting(true), 2500);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIndex]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/jobs?title=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}`,
    );
  };

  // --- Premium Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 70, damping: 15 },
    },
  };

  return (
    // FACT: Reduced height to 85vh to prevent the video from swallowing the entire screen on desktop
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden font-sans">
      <video
        className="absolute inset-0 w-full h-full object-cover scale-105" // scale-105 prevents edge bleeding
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      {/* FACT: Upgraded the flat overlay to a rich cinematic gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/95 backdrop-blur-[3px]" />

      <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          {/* FACT: Scaled down the badge significantly for a delicate, modern look */}
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs md:text-sm font-semibold mb-6 tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.15)] backdrop-blur-md"
          >
            ✨ Your first step to the future
          </motion.span>

          {/* FACT: Scaled down text from 8xl to 6xl/7xl for better typography flow */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6"
          >
            Find your <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-400 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent min-h-[1.2em] inline-block ml-2 md:ml-0">
              {displayText}
              <span className="text-blue-400 animate-pulse ml-1">|</span>
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-slate-300 text-base md:text-lg font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Stop searching and start growing. Discover the roles that perfectly
            fit your life, skills, and ambitions.
          </motion.p>

          {/* FACT: Shrunk the massive search bar into a sleek, premium glassmorphism pill */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSearch}
            className="w-full max-w-4xl flex flex-col md:flex-row items-center bg-white/5 backdrop-blur-md p-1.5 md:p-2 rounded-3xl md:rounded-full border border-white/10 shadow-2xl transition-all focus-within:border-blue-500/50 focus-within:bg-white/10"
          >
            <div className="flex items-center px-4 py-3 md:py-2 flex-1 w-full md:border-r border-white/10 group">
              <FaBriefcase className="text-blue-400/70 group-focus-within:text-blue-400 mr-3 shrink-0 text-base transition-colors" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Job title, keyword, or company"
                className="w-full bg-transparent outline-none text-white placeholder-slate-400 text-sm md:text-base font-medium"
              />
            </div>

            <div className="flex items-center px-4 py-3 md:py-2 flex-1 w-full border-t border-white/5 md:border-t-0 group">
              <FaMapMarkerAlt className="text-blue-400/70 group-focus-within:text-blue-400 mr-3 shrink-0 text-base transition-colors" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, state, or 'Remote'"
                className="w-full bg-transparent outline-none text-white placeholder-slate-400 text-sm md:text-base font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto mt-2 md:mt-0 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 md:py-3 rounded-2xl md:rounded-full transition-all text-sm md:text-base shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2"
            >
              <FaSearch size={14} />
              Search
            </button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
