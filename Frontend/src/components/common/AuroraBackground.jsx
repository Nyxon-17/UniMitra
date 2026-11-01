import React from 'react';

/**
 * Editorial + Aurora Atmospheric Background Component
 * 
 * Implements:
 * - Visually rich, lightweight teal/mint and green aurora waves
 * - Soft champagne highlights (#D4A96A / #E0B77A)
 * - Abstract flowing organic geometry with high blur (never interferes with typography)
 * - Ultra subtle geometric grid and radial vignette
 * - 100% responsive, zero pointer-events, GPU accelerated
 */
export const AuroraBackground = ({ className = '' }) => {
  return (
    <div 
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none transition-colors duration-500 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Base Canvas - Natural light beige in light mode, deep oceanic obsidian in dark mode */}
      <div className="absolute inset-0 bg-[#F7F6F0] dark:bg-[#16181A] transition-colors duration-500" />

      {/* 2. Abstract Flowing Teal & Mint Aurora Gradient Orb (Top-Right) */}
      <div 
        className="absolute -top-[15%] right-[5%] w-[650px] sm:w-[900px] h-[500px] sm:h-[650px] rounded-full blur-[110px] opacity-65 dark:opacity-40 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(85, 199, 178, 0.28) 0%, rgba(18, 60, 58, 0.16) 45%, transparent 70%)'
        }}
      />

      {/* 3. Soft Champagne Glow (Center-Left) */}
      <div 
        className="absolute top-[28%] -left-[10%] w-[550px] sm:w-[800px] h-[450px] sm:h-[600px] rounded-full blur-[120px] opacity-55 dark:opacity-25 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212, 169, 106, 0.24) 0%, rgba(224, 183, 122, 0.08) 50%, transparent 70%)'
        }}
      />

      {/* 4. Deep Secondary Aurora Horizon Flow (Bottom) */}
      <div 
        className="absolute -bottom-[20%] left-[20%] w-[700px] sm:w-[1000px] h-[500px] sm:h-[650px] rounded-full blur-[130px] opacity-45 dark:opacity-35 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(18, 60, 58, 0.20) 0%, rgba(85, 199, 178, 0.12) 40%, transparent 75%)'
        }}
      />

      {/* 5. Academic Blueprint & Constellation Grid Pattern (Suits University Site) */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.18] stroke-[#123C3A] dark:stroke-[#55C7B2] transition-opacity duration-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern id="academic-grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
            {/* Precision Grid Cell */}
            <path d="M 48 0 L 0 0 0 48" fill="none" strokeWidth="0.75" />
            
            {/* Coordinate Crosshairs at Intersections */}
            <path d="M 0 3 L 0 -3 M -3 0 L 3 0" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 48 3 L 48 -3 M 45 0 L 51 0" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 0 51 L 0 45 M -3 48 L 3 48" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 48 51 L 48 45 M 45 48 L 51 48" strokeWidth="0.8" strokeLinecap="round" />

            {/* Celestial & Academic Knowledge Micro-Nodes */}
            <circle cx="24" cy="24" r="0.8" fill="currentColor" opacity="0.65" />
            <circle cx="48" cy="48" r="1.2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#academic-grid-pattern)" />
      </svg>

      {/* 6. Subtle Edge Vignette for Crystal Clear Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#F7F6F0]/60 via-transparent to-[#F7F6F0]/30 dark:from-[#16181A]/70 dark:via-transparent dark:to-[#16181A]/40 transition-colors duration-500" />
    </div>
  );
};

