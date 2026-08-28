import React from 'react';
import { weddingDetails } from '../mocks/weddingData';
import { ChevronUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0B0907] overflow-hidden text-[#FBF7EF] pt-24 pb-12 border-t border-[#C29845]/30">
      {/* Background Banner with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={weddingDetails.couple.footerImage}
          alt="Celebrate with us"
          className="w-full h-full object-cover object-center filter brightness-50 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0907] via-[#0B0907]/80 to-black/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        
        {/* Main Banner Heading */}
        <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl text-[#FBF7EF] font-normal uppercase tracking-[0.1em] leading-tight mb-8 text-shadow-hero">
          We Can't Wait To Celebrate With You.
        </h2>

        {/* Gold Accent Line */}
        <div className="w-24 h-[1px] bg-[#C29845] mx-auto mb-10" />

        {/* Couple Script Monogram */}
        <div className="font-script text-4xl sm:text-5xl text-[#D2AC5E] mb-4 drop-shadow-md">
          {weddingDetails.couple.brideName} & {weddingDetails.couple.groomName}
        </div>

        {/* Date & Location */}
        <div className="text-xs sm:text-sm tracking-[0.3em] text-[#DACFB8] uppercase font-medium mb-12">
          {weddingDetails.wedding.date} • {weddingDetails.wedding.address}
        </div>

        {/* Scroll Back To Top Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={scrollToTop}
            className="group flex flex-col items-center space-y-2 text-[#A69272] hover:text-[#C29845] transition-colors duration-300 focus:outline-none"
            aria-label="Scroll Back to Top"
          >
            <div className="p-3 rounded-full border border-[#C29845]/30 group-hover:border-[#C29845] bg-[#0B0907]/60 group-hover:bg-[#C29845] group-hover:text-[#0B0907] transition-all duration-300 shadow-xl">
              <ChevronUp size={20} />
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold">
              BACK TO TOP
            </span>
          </button>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 text-[11px] text-[#A69272] font-mono tracking-wider">
          © {new Date().getFullYear()} {weddingDetails.couple.coupleName}. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};
