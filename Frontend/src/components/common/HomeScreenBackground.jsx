import React from 'react';
import { CollegeBoyUniversityBackground } from './CollegeBoyUniversityBackground';

/**
 * Universal Home Screen Background Design for All Routes
 * Features:
 * - Light Mode: Clean white canvas with Sky Blue (#73A5CA), Cream (#FFE9A9), Gold (#FFCB56), Tangerine (#FF933E)
 * - Dark Mode: Deep Midnight Navy (#13005A), Royal Blue (#00337C), Ocean Cyan (#1C82AD), Mint (#03C988)
 * - Institutional grid pattern
 * - Soft ambient glowing gradient orb
 * - Realistic animated college boy looking to their university
 */
export const HomeScreenBackground = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none ${className}`}>
      {/* 1. Base Canvas */}
      <div className="absolute inset-0 bg-[#FFFFFF] dark:bg-[#13005A] transition-colors duration-300" />

      {/* 2. Institutional Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />

      {/* 3. Soft Ambient Color Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[350px] sm:h-[450px] bg-gradient-to-r from-[#73A5CA]/30 via-[#FFCB56]/25 to-[#FF933E]/20 dark:from-[#00337C]/50 dark:via-[#1C82AD]/35 dark:to-[#03C988]/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* 4. Realistic Animated College Boy Looking at University */}
      <div className="absolute inset-0 w-full h-full opacity-85 dark:opacity-45">
        <CollegeBoyUniversityBackground className="w-full h-full" showOverlay={true} />
      </div>

      {/* 5. Contrast Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/40 dark:from-[#13005A]/70 dark:via-transparent dark:to-[#13005A]/50" />
    </div>
  );
};
