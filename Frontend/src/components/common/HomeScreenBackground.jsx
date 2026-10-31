import React from 'react';
import { CollegeBoyUniversityBackground } from './CollegeBoyUniversityBackground';

/**
 * Universal Home Screen Background Design for All Routes
 * Features:
 * - Base Canvas: Soft Lavender White (#FAF8FF) / Dark Space (#0A0718)
 * - Institutional grid pattern
 * - Soft ambient glowing gradient orb
 * - Realistic animated college boy looking to their university at 30% opacity
 * - Contrast vignette for seamless readability
 */
export const HomeScreenBackground = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none ${className}`}>
      {/* 1. Base Canvas */}
      <div className="absolute inset-0 bg-[#FAF8FF] dark:bg-[#0A0718] transition-colors duration-300" />

      {/* 2. Institutional Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />

      {/* 3. Soft Ambient Color Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[350px] sm:h-[450px] bg-gradient-to-r from-[#6D28D9]/20 via-[#8F00FF]/15 to-[#DDD6FE]/35 dark:from-[#B026FF]/25 dark:via-[#150F2C] dark:to-[#00F5D4]/20 rounded-full blur-3xl pointer-events-none" />

      {/* 4. Realistic Animated College Boy Looking at University with exactly 30% Opacity */}
      <div className="absolute inset-0 w-full h-full opacity-30 dark:opacity-30">
        <CollegeBoyUniversityBackground className="w-full h-full" showOverlay={true} />
      </div>

      {/* 5. Contrast Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8FF]/40 via-transparent to-[#FAF8FF]/20 dark:from-[#0A0718]/50 dark:via-transparent dark:to-[#0A0718]/30" />
    </div>
  );
};
