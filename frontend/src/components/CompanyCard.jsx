import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaArrowRight, FaCheckCircle, FaStar } from "react-icons/fa";
import demoIllustration from "../assets/skyscrapers.jpg";

export default function CompanyCard() {
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Soft spring for cinematic global tracking
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    // Disable heavy 3D calculations on mobile for better Android performance
    if (window.innerWidth <= 768) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    // FACT: Perspective is established here
    <section
      className="px-4 py-12 md:py-16 bg-[#F8FAFC] flex justify-center items-center font-sans overflow-hidden"
      style={{ perspective: 2000 }}
    >
      {/* FACT: 3D Chain Link 1 - The fade-in wrapper MUST preserve 3D */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-6xl"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FACT: 3D Chain Link 2 - The Rotating Card */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full rounded-3xl md:rounded-[2.5rem] bg-[#0B1120] shadow-2xl border border-slate-800"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Ambient Glows pushed backwards */}
          <div
            className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none"
            style={{ transform: "translateZ(-50px)" }}
          />
          <div
            className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none"
            style={{ transform: "translateZ(-50px)" }}
          />

          <div
            className="relative flex flex-col items-center justify-between gap-8 p-6 sm:p-8 md:gap-12 md:flex-row md:p-16 lg:p-20"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Left Content Container */}
            <div
              className="z-10 text-left w-full md:w-1/2"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-400 border border-blue-500/20 mb-6"
                style={{ transform: "translateZ(40px)" }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                </span>
                New Companies Joined
              </div>

              <h2
                className="text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl leading-[1.1] drop-shadow-2xl"
                style={{ transform: "translateZ(80px)" }}
              >
                Find your next <br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  dream workplace.
                </span>
              </h2>

              <p
                className="mt-4 md:mt-6 max-w-md text-sm md:text-base leading-relaxed text-slate-400 font-medium"
                style={{ transform: "translateZ(50px)" }}
              >
                Skip the generic listings. We’ve curated 500+ top-rated
                companies hiring this month based on culture, growth, and
                benefits.
              </p>

              <div
                className="mt-10 flex flex-wrap items-center gap-6"
                style={{ transform: "translateZ(60px)" }}
              >
                <button 
                  onClick={() => navigate('/companies')}
                  className="group flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white transition-all hover:bg-blue-500 hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                >
                  Explore Companies
                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </button>

                <div className="flex items-center gap-3 text-xs md:text-sm text-slate-400 font-medium">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-6 w-6 md:h-8 md:w-8 rounded-full border-2 border-[#0B1120] bg-slate-800"
                      />
                    ))}
                  </div>
                  <span>Join 10k+ applicants</span>
                </div>
              </div>
            </div>

            {/* Right Visuals Container */}
            <div
              className="relative md:w-1/2 w-full max-w-md mx-auto md:max-w-none mt-10 md:mt-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="overflow-hidden rounded-2xl md:rounded-[2rem] border border-white/20 shadow-[0_30px_50px_rgba(0,0,0,0.5)] bg-slate-900 aspect-video md:aspect-[4/3]"
                style={{ transform: "translateZ(30px)" }}
              >
                <img
                  src={demoIllustration}
                  alt="Skyscrapers"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-80" />
              </div>

              <div
                className="absolute -left-2 md:-left-12 bottom-4 md:bottom-8 z-20 rounded-xl md:rounded-2xl border border-white/10 bg-[#0F172A]/90 p-2.5 md:p-3.5 backdrop-blur-md shadow-[0_30px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-emerald-500/50 hover:scale-105 cursor-default"
                style={{ transform: "translateZ(90px)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                    <FaCheckCircle size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">
                      Verified
                    </p>
                    <p className="text-sm font-bold text-white">Google Cloud</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -right-2 md:-right-8 top-4 md:top-8 z-20 rounded-xl md:rounded-2xl border border-white/10 bg-blue-600/90 p-3 md:p-4 backdrop-blur-md shadow-[0_30px_30px_-10px_rgba(0,0,0,0.5)] flex flex-col items-center transition-all duration-300 hover:border-blue-400/50 hover:scale-105 cursor-default"
                style={{ transform: "translateZ(120px)" }}
              >
                <p className="text-2xl font-extrabold text-white flex items-center gap-1">
                  4.8 <FaStar size={16} className="text-amber-400 mb-1" />
                </p>
                <p className="text-[9px] uppercase tracking-widest text-blue-200 font-bold mt-1">
                  Avg. Rating
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
