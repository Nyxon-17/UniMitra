import React from 'react';
import { CollegeBoyUniversityBackground } from './CollegeBoyUniversityBackground';

/**
 * Universal Home Screen Background Design for All Routes
 * Features:
 * - Institutional grid pattern
 * - Soft ambient glowing gradient orb
 * - Realistic animated college boy looking to their university
 * - Smooth vignette for card and text contrast
 */
export const HomeScreenBackground = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none ${className}`}>
      {/* 1. Base Canvas */}
      <div className="absolute inset-0 bg-[#FAF8FF] dark:bg-[#0A0718] transition-colors duration-300" />

      {/* 2. Institutional Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />

      {/* 3. Soft Ambient Color Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[350px] sm:h-[450px] bg-gradient-to-r from-[#7C3AED]/20 via-[#9333EA]/15 to-[#F59E0B]/20 dark:from-[#B026FF]/25 dark:via-[#1A0A30] dark:to-[#F59E0B]/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* 4. Realistic Animated College Boy Looking at University */}
      <div className="absolute inset-0 w-full h-full opacity-85 dark:opacity-45">
        <CollegeBoyUniversityBackground className="w-full h-full" showOverlay={true} />
      </div>

      {/* 5. Contrast Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8FF]/50 via-transparent to-[#FAF8FF]/20 dark:from-[#0A0718]/60 dark:via-transparent dark:to-[#0A0718]/40" />
    </div>
  );
};
