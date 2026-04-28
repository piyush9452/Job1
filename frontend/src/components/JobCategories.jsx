import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaCode,
  FaChartLine,
  FaPalette,
  FaBullhorn,
  FaHeadset,
  FaMicrochip,
  FaShieldAlt,
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
    initX: -100,
    initY: 0,
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
    initX: 100,
    initY: 0,
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
    initX: -100,
    initY: 0,
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
    initX: 100,
    initY: 0,
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
    initX: -100,
    initY: 0, // FACT: Fixed! Now comes from the left
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
    initX: 0,
    initY: 100,
  },
  {
    name: "Cybersecurity",
    count: "150 Jobs",
    icon: FaShieldAlt,
    color: "from-rose-500 to-red-500",
    blob1: "bg-rose-500",
    blob2: "bg-red-500",
    shadow: "shadow-rose-500/20",
    size: "md:col-span-1",
    initX: 100,
    initY: 0,
  },
];

export default function JobCategories() {
  const navigate = useNavigate();

  const [activeBlobs, setActiveBlobs] = useState({
    b1: "bg-blue-600",
    b2: "bg-indigo-500",
  });

  const [twirlingIndex, setTwirlingIndex] = useState(null);

  useEffect(() => {
    const triggerRandomTwirl = () => {
      const randomIndex = Math.floor(Math.random() * categories.length);
      setTwirlingIndex(randomIndex);

      setTimeout(() => {
        setTwirlingIndex(null);
      }, 1500);

      const nextInterval = Math.random() * 5000 + 10;
      setTimeout(triggerRandomTwirl, nextInterval);
    };

    const initialTimer = setTimeout(triggerRandomTwirl, 5000);
    return () => clearTimeout(initialTimer);
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/jobs?title=${encodeURIComponent(category)}`);
  };

  return (
    <section className="relative py-20 bg-[#F8FAFC] font-sans overflow-hidden">
      {/* FREEROAMING LAVA LAMP BACKGROUNDS */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: ["0vw", "40vw", "-20vw", "30vw", "0vw"],
            y: ["0vh", "30vh", "10vh", "-20vh", "0vh"],
            scale: [1, 1.2, 0.8, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className={`absolute top-[10%] left-[10%] w-[25rem] h-[25rem] rounded-full mix-blend-multiply blur-[100px] opacity-30 transition-colors duration-1000 ease-in-out ${activeBlobs.b1}`}
        />

        <motion.div
          animate={{
            x: ["0vw", "-30vw", "20vw", "-40vw", "0vw"],
            y: ["0vh", "-20vh", "40vh", "10vh", "0vh"],
            scale: [1, 0.9, 1.3, 0.9, 1],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className={`absolute top-[40%] right-[10%] w-[35rem] h-[35rem] rounded-full mix-blend-multiply blur-[120px] opacity-30 transition-colors duration-1000 ease-in-out ${activeBlobs.b2}`}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          // FACT: Added once: false so the header also vanishes and reappears
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
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
            View all categories
            <FaArrowRight
              className="group-hover:translate-x-1 transition-transform"
              size={12}
            />
          </button>
        </motion.div>

        {/* Bento Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
          onMouseLeave={() =>
            setActiveBlobs({ b1: "bg-blue-600", b2: "bg-indigo-500" })
          }
        >
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: cat.initX, y: cat.initY }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              // FACT: once: false makes the cards animate in BOTH directions (up and down)
              viewport={{ once: false, amount: 0.1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: index * 0.05,
              }}
              onClick={() => handleCategoryClick(cat.name)}
              onMouseEnter={() =>
                setActiveBlobs({ b1: cat.blob1, b2: cat.blob2 })
              }
              whileHover={{ y: -6, scale: 1.02 }}
              className={`${cat.size} group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md p-6 border border-slate-200/80 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.1)] hover:border-slate-300 cursor-pointer transition-colors duration-300`}
            >
              <div
                className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${cat.color} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`}
              />

              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                {/* FACT: The CSS Conflict Fix. Framer Motion handles the JS Twirl on the outer div... */}
                <motion.div
                  animate={
                    twirlingIndex === index
                      ? // Jump height restricted to -15 so it doesn't clip outside the card padding
                        { y: [0, -15, 0], rotate: [0, 720, 720] }
                      : { y: 0, rotate: 0 }
                  }
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="w-12 h-12"
                >
                  {/* ...and Tailwind handles the CSS hover on the inner div! They will never fight again. */}
                  <div
                    className={`w-full h-full rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg ${cat.shadow} group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300`}
                  >
                    <cat.icon size={18} />
                  </div>
                </motion.div>

                <div className="mt-auto">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-slate-500 font-medium text-sm mt-1.5 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {cat.count}
                  </p>
                </div>
              </div>

              {/* Diagonal Arrow */}
              <div className="absolute bottom-5 right-5 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <div className="p-2.5 rounded-full bg-slate-50 text-slate-900 border border-slate-200 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                  <FaArrowRight className="-rotate-45" size={12} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
