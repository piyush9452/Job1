import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaSearchDollar,
  FaPaperPlane,
  FaCheckDouble,
} from "react-icons/fa";

export default function ProcessBento() {
  // FACT: State to track dynamic lava lamp colors
  const [activeBlobs, setActiveBlobs] = useState({
    b1: "bg-blue-600",
    b2: "bg-indigo-500",
  });

  const steps = [
    {
      num: "01",
      title: "Create Profile",
      desc: "Upload your resume and let our AI instantly parse your skills and experience.",
      icon: <FaUserPlus size={32} />,
      circleColor: "bg-blue-500",
      iconColor: "text-blue-500",
      blob1: "bg-blue-500",
      blob2: "bg-cyan-400",
    },
    {
      num: "02",
      title: "Smart Search",
      desc: "Our matching engine automatically filters roles that fit your exact expertise.",
      icon: <FaSearchDollar size={32} />,
      circleColor: "bg-indigo-500",
      iconColor: "text-indigo-500",
      blob1: "bg-indigo-500",
      blob2: "bg-purple-500",
    },
    {
      num: "03",
      title: "Quick Apply",
      desc: "Submit your profile to verified employers instantly with a single click.",
      icon: <FaPaperPlane size={32} />,
      circleColor: "bg-emerald-500",
      iconColor: "text-emerald-500",
      blob1: "bg-emerald-500",
      blob2: "bg-teal-400",
    },
    {
      num: "04",
      title: "Get Hired",
      desc: "Track application statuses in real-time and chat directly with HRs.",
      icon: <FaCheckDouble size={32} />,
      circleColor: "bg-amber-500",
      iconColor: "text-amber-500",
      blob1: "bg-amber-500",
      blob2: "bg-orange-500",
    },
  ];

  return (
    <section className="relative py-24 bg-[#F8FAFC] font-sans overflow-hidden border-t border-slate-200/60">
      {/* ========================================== */}
      {/* AMBIENT LAVA LAMP BACKGROUNDS */}
      {/* ========================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top Left Orb */}
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -top-20 -left-20 w-96 h-96 rounded-full mix-blend-multiply blur-[100px] opacity-30 transition-colors duration-1000 ease-in-out ${activeBlobs.b1}`}
        />

        {/* Bottom Right Orb */}
        <motion.div
          animate={{
            x: [0, -80, 40, 0],
            y: [0, 60, -50, 0],
            scale: [1, 0.9, 1.2, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full mix-blend-multiply blur-[120px] opacity-30 transition-colors duration-1000 ease-in-out ${activeBlobs.b2}`}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-[2px] bg-blue-600 rounded-full"></span>
            <span className="text-blue-600 font-bold tracking-widest uppercase text-[10px]">
              How it works
            </span>
            <span className="w-6 h-[2px] bg-blue-600 rounded-full"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Your path to a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              new career
            </span>
          </h2>
          <p className="text-slate-500 mt-4 font-medium text-lg max-w-xl mx-auto">
            Simplified, automated, and designed for maximum speed. Skip the long
            forms and get straight to the interviews.
          </p>
        </div>

        {/* Card Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          onMouseLeave={() =>
            setActiveBlobs({ b1: "bg-blue-600", b2: "bg-indigo-500" })
          }
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              onMouseEnter={() =>
                setActiveBlobs({ b1: step.blob1, b2: step.blob2 })
              }
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative bg-white/80 backdrop-blur-sm shadow-[0_4px_15px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.08)] border border-slate-200/80 hover:border-slate-300 p-8 pt-10 rounded-[2rem] overflow-hidden group transition-colors duration-300 flex flex-col h-full cursor-default"
            >
              {/* Top-Right Decorative Circle */}
              <div
                className={`w-28 h-28 absolute -right-6 -top-6 rounded-full transition-transform duration-500 group-hover:scale-110 ${step.circleColor} flex items-end justify-start pb-5 pl-7`}
              >
                <p className="text-white text-3xl font-black leading-none drop-shadow-md">
                  {step.num}
                </p>
              </div>

              {/* Card Content */}
              <div className="relative z-10">
                <div
                  className={`mb-6 transition-transform duration-500 group-hover:-translate-y-1 ${step.iconColor}`}
                >
                  {step.icon}
                </div>

                <h3 className="font-extrabold text-xl text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
