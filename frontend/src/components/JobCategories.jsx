import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCode,
  FaChartLine,
  FaPalette,
  FaBullhorn,
  FaHeadset,
  FaMicrochip,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Development",
    count: "1.2k+ Jobs",
    icon: FaCode,
    color: "from-blue-500 to-cyan-400",
    blob1: "bg-blue-500",
    blob2: "bg-cyan-400",
    shadow: "shadow-blue-500/20",
    size: "md:col-span-2",
  },
  {
    name: "Marketing",
    count: "850 Jobs",
    icon: FaBullhorn,
    color: "from-purple-500 to-pink-500",
    blob1: "bg-purple-500",
    blob2: "bg-pink-500",
    shadow: "shadow-purple-500/20",
    size: "md:col-span-1",
  },
  {
    name: "Design",
    count: "640 Jobs",
    icon: FaPalette,
    color: "from-orange-400 to-red-500",
    blob1: "bg-orange-400",
    blob2: "bg-red-500",
    shadow: "shadow-orange-500/20",
    size: "md:col-span-1",
  },
  {
    name: "Finance",
    count: "420 Jobs",
    icon: FaChartLine,
    color: "from-emerald-400 to-teal-500",
    blob1: "bg-emerald-400",
    blob2: "bg-teal-500",
    shadow: "shadow-emerald-500/20",
    size: "md:col-span-2",
  },
  {
    name: "Tech Support",
    count: "310 Jobs",
    icon: FaHeadset,
    color: "from-indigo-500 to-blue-600",
    blob1: "bg-indigo-500",
    blob2: "bg-blue-600",
    shadow: "shadow-indigo-500/20",
    size: "md:col-span-1",
  },
  {
    name: "AI & ML",
    count: "95 Jobs",
    icon: FaMicrochip,
    color: "from-amber-400 to-orange-600",
    blob1: "bg-amber-400",
    blob2: "bg-orange-600",
    shadow: "shadow-amber-500/20",
    size: "md:col-span-1",
  },
];

export default function JobCategories() {
  const navigate = useNavigate();

  // State to track the dynamic lava lamp colors. Defaults to platform theme (blue/indigo).
  const [activeBlobs, setActiveBlobs] = useState({
    b1: "bg-blue-600",
    b2: "bg-indigo-500",
  });

  const handleCategoryClick = (category) => {
    navigate(`/jobs?title=${encodeURIComponent(category)}`);
  };

  return (
    <section className="relative py-12 bg-[#F8FAFC] font-sans overflow-hidden">
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
          className={`absolute top-40 -right-20 w-[30rem] h-[30rem] rounded-full mix-blend-multiply blur-[120px] opacity-30 transition-colors duration-1000 ease-in-out ${activeBlobs.b2}`}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-blue-600 rounded-full"></span>
              <span className="text-blue-600 font-bold tracking-widest uppercase text-[10px]">
                Categories
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Browse by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Specialty
              </span>
            </h2>
          </div>
          <button className="text-slate-500 text-sm font-semibold hover:text-blue-600 transition-colors flex items-center gap-1.5 group pb-1">
            View all 24+ categories
            <FaArrowRight
              className="group-hover:translate-x-1 transition-transform"
              size={12}
            />
          </button>
        </div>

        {/* Bento Grid */}
        {/* Grid container handles the 'mouseLeave' to reset the lava lamps back to default */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          onMouseLeave={() =>
            setActiveBlobs({ b1: "bg-blue-600", b2: "bg-indigo-500" })
          }
        >
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              onClick={() => handleCategoryClick(cat.name)}
              onMouseEnter={() =>
                setActiveBlobs({ b1: cat.blob1, b2: cat.blob2 })
              }
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`${cat.size} group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-5 border border-slate-200/80 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.08)] hover:border-slate-300 cursor-pointer transition-colors duration-300`}
            >
              {/* Internal Card Background Glow */}
              <div
                className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${cat.color} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-10`}
              />

              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-md ${cat.shadow} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                >
                  <cat.icon size={16} />
                </div>

                <div className="mt-auto">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-slate-500 font-medium text-xs mt-1 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                    {cat.count}
                  </p>
                </div>
              </div>

              {/* Diagonal Arrow */}
              <div className="absolute bottom-4 right-4 opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <div className="p-2 rounded-full bg-slate-50 text-slate-900 border border-slate-200 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                  <FaArrowRight className="-rotate-45" size={10} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
