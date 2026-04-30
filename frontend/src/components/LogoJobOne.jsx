import React from "react";

export default function JobOneLogo({
  width = 300,
  height = 250,
  primaryDotColor = "#00E5FF", // Glowing Cyan
  secondaryDotColor = "#0088CC", // Mid Blue
  tertiaryDotColor = "#004488", // Dark Blue
  textColor = "#FFFFFF", // Text color
  className = "",
  ...props
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 600 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* --- PREMIUM GLOW FILTER --- */}
      <defs>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ========================================== */}
      {/* 1. THE RADIATING SUNBURST DOT CLUSTER      */}
      {/* Perfectly mirrored across the Y=125 Axis   */}
      {/* ========================================== */}
      <g id="dot-cluster">
        {/* Inner Cyan Dots (Large, Glowing) */}
        <g fill={primaryDotColor} filter="url(#neonGlow)">
          <circle cx="120" cy="75" r="11" /> {/* Top */}
          <circle cx="120" cy="175" r="11" /> {/* Bottom */}
          <circle cx="80" cy="90" r="11" /> {/* Upper-Left */}
          <circle cx="80" cy="160" r="11" /> {/* Lower-Left */}
          <circle cx="60" cy="125" r="11" /> {/* Far-Left (Center Axis) */}
        </g>

        {/* Medium Blue Dots (Mid-size sunburst rays) */}
        <g fill={secondaryDotColor}>
          {/* Inner Right Tips (Framing the 'J') */}
          <circle cx="155" cy="55" r="7.5" />
          <circle cx="155" cy="195" r="7.5" />

          {/* Top & Bottom */}
          <circle cx="120" cy="40" r="7.5" />
          <circle cx="120" cy="210" r="7.5" />

          {/* Upper & Lower Left Ray 1 */}
          <circle cx="82.5" cy="50" r="7.5" />
          <circle cx="82.5" cy="200" r="7.5" />

          {/* Upper & Lower Left Ray 2 */}
          <circle cx="55" cy="65" r="7.5" />
          <circle cx="55" cy="185" r="7.5" />

          {/* Upper & Lower Left Ray 3 */}
          <circle cx="30" cy="92.5" r="7.5" />
          <circle cx="30" cy="157.5" r="7.5" />

          {/* Far Left (Center Axis) */}
          <circle cx="30" cy="125" r="7.5" />
        </g>

        {/* Dark Blue Dots (Small outer bounds) */}
        <g fill={tertiaryDotColor}>
          {/* Far Right Tips (Framing the 'J') */}
          <circle cx="190" cy="55" r="5" />
          <circle cx="190" cy="195" r="5" />

          {/* Top & Bottom Tips */}
          <circle cx="120" cy="10" r="5" />
          <circle cx="120" cy="240" r="5" />

          {/* Upper & Lower Left Outer */}
          <circle cx="70" cy="20" r="5" />
          <circle cx="70" cy="230" r="5" />

          {/* Far Upper & Lower Left */}
          <circle cx="26" cy="40" r="5" />
          <circle cx="26" cy="210" r="5" />

          {/* Furthest Left (Center Axis) */}
          <circle cx="5" cy="125" r="5" />
        </g>
      </g>

      {/* ========================================== */}
      {/* 2. PERFECTED TYPOGRAPHY                      */}
      {/* ========================================== */}
      <g id="text-elements" fill={textColor}>
        {/* Main Brand Name */}
        <text
          x="110"
          y="150"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="70"
          fontWeight="300"
          letterSpacing="2"
        >
          Jobone
        </text>

        {/* Subtitle */}
        <text
          x="200"
          y="185"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="18"
          fontWeight="400"
          letterSpacing="5"
        >
          For Everyone
        </text>
      </g>

      ==========================================
      {/* 3. PRECISION VECTOR AVATARS                  */}
      {/* ========================================== */}
      <g
        id="faces"
        stroke={textColor}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Male Avatar (Floating above 'on') */}
        <g transform="translate(405, 45) scale(1.2)">
          {/* Jawline */}
          <path d="M 10 19 C 10 33, 14 39, 20 39 C 26 39, 30 33, 30 19" />

          {/* Ears */}
          <path d="M 10 21 C 6 21, 6 28, 10 28" />
          <path d="M 30 21 C 34 21, 34 28, 30 28" />

          {/* Outer Hair Outline */}
          <path d="M 10 19 C 8 9, 14 3, 21 4 C 28 5, 32 10, 30 19" />

          {/* Inner Hairline with Parting */}
          <path d="M 10 19 C 12 13, 15 12, 17 16 C 20 11, 26 12, 30 17" />

          {/* Thick Eyebrows */}
          <path d="M 13 20 Q 15.5 18.5 18 20" />
          <path d="M 22 20 Q 24.5 18.5 27 20" />

          {/* Eyes */}
          <circle cx="15.5" cy="23.5" r="1.5" fill={textColor} stroke="none" />
          <circle cx="24.5" cy="23.5" r="1.5" fill={textColor} stroke="none" />

          {/* L-Shaped Nose */}
          <path d="M 20 21 L 20 28 L 22.5 28" />

          {/* Mouth (Upper smile & lower lip crease) */}
          <path d="M 16 32 Q 20 33.5 24 32" />
          <path d="M 18 35 Q 20 36 22 35" />
        </g>

        {/* Female Avatar (Floating right next to male) */}
        <g transform="translate(465, 45) scale(1.2)">
          {/* Jawline */}
          <path d="M 12 18 C 12 26, 16 32, 20 32 C 24 32, 28 26, 28 18" />
          {/* Bob Haircut */}
          <path
            d="M 20 4 C 8 4, 6 18, 8 26 L 12 26 C 12 15, 16 10, 20 10 C 24 10, 28 15, 28 26 L 32 26 C 34 18, 32 4, 20 4 Z"
            fill={textColor}
            stroke="none"
          />
          {/* Eyes */}
          <line x1="15" y1="22" x2="17" y2="22" />
          <line x1="23" y1="22" x2="25" y2="22" />
          {/* Eyelashes */}
          <path d="M 14 20 L 16 22" />
          <path d="M 26 20 L 24 22" />
          {/* Nose */}
          <path d="M 20 24 L 20 28" />
          {/* Mouth */}
          <path d="M 17 30 C 19 31.5, 21 31.5, 23 30" />
        </g>
      </g>
    </svg>
  );
}
