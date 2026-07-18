import React, { useMemo } from "react";
import { motion } from "framer-motion";

const MobileHeroBg = () => {
  // Memoize the particles so they don't re-render randomly when the parent state changes
  const particles = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      size: 2 + Math.random() * 4,
      startX: Math.random() * 100, // 0 to 100vw
      startY: 65 + Math.random() * 25, // Start near the planet's top edge
      duration: 5 + Math.random() * 7,
      delay: Math.random() * 5,
      xDrift: (Math.random() - 0.5) * 150, // Drift left or right
      yDistance: -300 - Math.random() * 300, // Float up
    }));
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full block md:hidden bg-[#010614] overflow-hidden z-0">
      {/* The glowing planet */}
      <div className="absolute bottom-[-30vw] left-1/2 -translate-x-1/2 w-[160vw] h-[160vw] max-w-[800px] max-h-[800px] rounded-full border-[2px] border-cyan-400/50 bg-[#010614] shadow-[0_0_60px_rgba(34,211,238,0.4),inset_0_0_80px_rgba(34,211,238,0.2)]" />
      
      {/* Glowing dust emitting upwards */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-cyan-300 shadow-[0_0_10px_2px_rgba(34,211,238,0.9)]"
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
