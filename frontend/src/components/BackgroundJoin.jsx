import React, { useRef, useEffect } from "react";

const NetworkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    // CONFIGURATION
    const particleCount = 80;
    const connectionDistance = 140;
    const mouseDistance = 280;

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: 6, // Reverted to standard size
        });
      }
    };
    initParticles();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Update & Draw Particles (Solid Style)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // CHANGED: Brighter Blue to pop against the Dark Navy edges
        ctx.fillStyle = "#60a5fa";
        ctx.fill();
      });

      // 2. Connections
      ctx.lineWidth = 1;

      particles.forEach((p1) => {
        // Find nearest neighbors
        const distances = particles
          .filter((p2) => p2 !== p1)
          .map((p2) => ({
            p: p2,
            dist: Math.hypot(p1.x - p2.x, p1.y - p2.y),
          }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 6);

        distances.forEach((d) => {
          if (d.dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(d.p.x, d.p.y);

            const alpha = 1 - d.dist / connectionDistance;
            // Line color: Matching the particle blue
            ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
            ctx.stroke();
          }
        });

        // Mouse Connections
        const distToMouse = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
        if (distToMouse < mouseDistance) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);

          const alpha = 1 - distToMouse / mouseDistance;
          // Mouse line: White/Cyan mix to show interaction clearly
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        // CHANGED: Gradient from Light Blue (Center) to Navy (Edges)
        // #3b82f6 (Bright Blue) -> #172554 (Deep Navy)
        background:
          "radial-gradient(circle at center, #3b82f6 0%, #0f172a 100%)",
      }}
    />
  );
};

export default NetworkBackground;
