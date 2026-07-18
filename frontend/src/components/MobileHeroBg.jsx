import React, { useMemo } from "react";
import { motion } from "framer-motion";

const MobileHeroBg = () => {
  // Memoize the particles so they don't re-render randomly when the parent state changes
  const particles = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      size: 1 + Math.random() * 2, // sharper dots (1px - 3px)
      startX: Math.random() * 100, // 0 to 100vw
      startY: 70 + Math.random() * 30, // Start around the planet
      duration: 2 + Math.random() * 4, // Faster flow upwards (2 to 6 secs)
      delay: Math.random() * 3,
      xDrift: (Math.random() - 0.5) * 80,
      yDistance: -300 - Math.random() * 500, // Float up higher and faster
    }));
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full block md:hidden bg-[#010614] overflow-hidden z-0">
      {/* The glowing planet - moved up slightly to be visible immediately */}
      <div className="absolute bottom-[-60vw] sm:bottom-[-40vw] left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] max-w-[800px] max-h-[800px] rounded-full border-[1.5px] border-cyan-400/40 bg-[#010614] shadow-[0_0_40px_rgba(34,211,238,0.5),inset_0_0_60px_rgba(34,211,238,0.2)]" />
      
      {/* Glowing dust emitting upwards */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white shadow-[0_0_4px_1px_rgba(34,211,238,1)]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.startX}%`,
              top: `${p.startY}%`,
            }}
            animate={{
              y: [0, p.yDistance],
              x: [0, p.xDrift],
              opacity: [0, 1, 0.8, 0],
              scale: [0.5, 1.2, 1, 0.5],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileHeroBg;
