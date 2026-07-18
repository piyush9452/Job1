import React, { useMemo } from "react";
import { motion } from "framer-motion";

const MobileHeroBg = () => {
  // Memoize the particles so they don't re-render randomly when the parent state changes
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      // Calculate a random angle across the top curve of the planet (approx 210 to 330 degrees)
      const angleDeg = 180 + 30 + Math.random() * 120;
      const angleRad = (angleDeg * Math.PI) / 180;
      
      // Calculate X and Y on the border (radius = 50% of the container)
      const startX = 50 + 50 * Math.cos(angleRad); // %
      const startY = 50 + 50 * Math.sin(angleRad); // %

      return {
        id: i,
        size: 1 + Math.random() * 2, // 1px - 3px
        startX,
        startY,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 3,
        xDrift: (Math.random() - 0.5) * 60,
        yDistance: -200 - Math.random() * 300, 
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full block md:hidden bg-[#010614] overflow-hidden z-0">
      {/* 
        Hardware-accelerated CSS animations for ultimate performance.
        Zero JavaScript intervals required.
      */}
      <style>
        {`
          @keyframes ambientHue {
            0% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(60deg); }
            100% { filter: hue-rotate(0deg); }
          }
          .planet-ambience {
            animation: ambientHue 12s ease-in-out infinite;
          }
        `}
      </style>

      <div className="absolute inset-0 w-full h-full planet-ambience">
        {/* 
          The glowing planet 
          - Moved up (bottom-[-40vw]) for extreme visibility
          - Replaced solid bg with a deep radial gradient for 3D depth
          - Doubled the box-shadow spread for intense neon glow
        */}
        <div className="absolute bottom-[-45vw] sm:bottom-[-25vw] left-1/2 -translate-x-1/2 w-[160vw] h-[160vw] max-w-[900px] max-h-[900px] rounded-full border-t-2 border-cyan-400/80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#03112e] via-[#010614] to-[#010614] shadow-[0_-10px_80px_rgba(34,211,238,0.8),inset_0_20px_100px_rgba(34,211,238,0.4)]" />
        
        {/* Glowing dust emitting upwards */}
        <div className="absolute bottom-[-45vw] sm:bottom-[-25vw] left-1/2 -translate-x-1/2 w-[160vw] h-[160vw] max-w-[900px] max-h-[900px] pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-white shadow-[0_0_8px_2px_rgba(34,211,238,1)]"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.startX}%`,
                top: `${p.startY}%`,
              }}
              animate={{
                y: [0, p.yDistance],
                x: [0, p.xDrift],
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
    </div>
  );
};

export default MobileHeroBg;
