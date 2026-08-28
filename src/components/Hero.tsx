import React from 'react';
import { weddingDetails } from '../mocks/weddingData';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0907]">
      {/* Background Image with Dark Vignette & Edge Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={weddingDetails.couple.heroImage}
          alt={weddingDetails.couple.coupleName}
          className="w-full h-full object-cover object-[50%_22%] md:object-[50%_25%] lg:object-[50%_28%] filter brightness-[0.78] contrast-[1.2] sepia-[35%] hue-rotate-[-10deg] saturate-[1.15]"
        />
        {/* Warm Golden/Amber Champagne Tint Overlay */}
        <div className="absolute inset-0 bg-[#C29845]/25 mix-blend-color pointer-events-none" />
        <div className="absolute inset-0 bg-[#372A14]/40 mix-blend-multiply pointer-events-none" />
        {/* Top Edge Dark Gradient */}
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#0B0907] via-[#0B0907]/70 to-transparent pointer-events-none" />

        {/* Bottom Edge Dark Gradient */}
        <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-[#0B0907] via-[#0B0907]/80 to-transparent pointer-events-none" />

        {/* Left Side Dark Gradient */}
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#0B0907] via-[#0B0907]/60 to-transparent pointer-events-none" />

        {/* Right Side Dark Gradient */}
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#0B0907] via-[#0B0907]/60 to-transparent pointer-events-none" />

        {/* Radial Center Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0B0907_95%)] opacity-85 pointer-events-none" />
      </div>

      {/* Hero Central Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16 flex flex-col items-center justify-center min-h-screen">

        {/* Short Top Gold Line Accent */}
        <div className="w-16 h-[1px] bg-[#C29845] mb-4 mx-auto" />

        {/* Script Subheading */}
        <span className="font-script text-4xl sm:text-5xl md:text-6xl text-[#D2AC5E] mb-1 animate-fade-up font-normal tracking-wide drop-shadow-md">
          Becoming
        </span>

        {/* Main Heading (Single Horizontal Line) */}
        <h1 className="font-heading text-2xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[0.06em] md:tracking-[0.12em] text-[#FBF7EF] font-normal uppercase mb-4 text-shadow-hero animate-scale-in whitespace-nowrap">
          {weddingDetails.couple.coupleName}
        </h1>

        {/* Bottom Gold Line Accent */}
        <div className="w-28 h-[1px] bg-gradient-to-r from-transparent via-[#C29845] to-transparent mb-6" />

        {/* Tagline without quotes */}
        <p className="font-heading italic text-lg sm:text-xl md:text-2xl text-[#FBF7EF] font-light mb-6 text-shadow-hero animate-fade-up">
          {weddingDetails.hero.tagline}
        </p>

        {/* Date */}
        <div className="text-[#D2AC5E] text-xs sm:text-sm md:text-base tracking-[0.35em] uppercase font-medium animate-fade-up">
          {weddingDetails.wedding.date}
        </div>

      </div>
    </section>
  );
};
