import React from 'react';
import { weddingDetails } from '../mocks/weddingData';
import { ChevronUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0a1713] overflow-hidden text-[#FBF7EF] pt-12 pb-12 border-t border-[#f1c65a]/30">
      {/* Background Banner with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={weddingDetails.couple.footerImage}
          alt="Celebrate with us"
          className="w-full h-full object-cover object-center filter brightness-50 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1713] via-[#0a1713]/80 to-black/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        
        {/* Main Banner Heading */}
        <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl text-[#FBF7EF] font-normal uppercase tracking-[0.1em] leading-tight mb-8 text-shadow-hero">
          We Can't Wait To Celebrate With You.
        </h2>

        {/* Gold Accent Line */}
        <div className="w-28 h-[1px] bg-gradient-to-r from-transparent via-[#f1c65a] via-[#e2b324] to-transparent mx-auto mb-10" />

        {/* Couple Script Monogram */}
        <div className="font-script text-4xl sm:text-5xl bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent mb-10 drop-shadow-md">
          Christabell &amp; Graham
        </div>

        {/* Scroll Back To Top Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={scrollToTop}
            className="group flex flex-col items-center space-y-2 text-[#A69272] hover:text-[#f1c65a] transition-colors duration-300 focus:outline-none"
            aria-label="Scroll Back to Top"
          >
            <div className="p-3 rounded-full border border-[#f1c65a]/30 group-hover:border-[#f1c65a] bg-[#0a1713] group-hover:bg-gradient-to-r group-hover:from-[#f1c65a] group-hover:to-[#e2b324] group-hover:text-[#0a1713] transition-all duration-300 shadow-xl">
              <ChevronUp size={20} />
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold">
              BACK TO TOP
            </span>
          </button>
        </div>

        {/* Copyright & Production Credit */}
        <div className="pt-8 border-t border-white/10 text-center space-y-4">
          <div className="text-[11px] text-[#A69272] font-mono tracking-wider">
            © {new Date().getFullYear()} {weddingDetails.couple.coupleName}. All Rights Reserved.
          </div>

          {/* POWERED BY KEK STUDIOS CREDIT */}
          <div className="pt-2 flex flex-col items-center justify-center text-center space-y-1">
            <div className="text-xs tracking-[0.2em] uppercase">
              <span className="text-[#A69272] font-mono font-light">Powered by </span>
              <span className="text-[#f1c65a] font-serif font-semibold tracking-[0.25em]">KEK STUDIOS</span>
            </div>
            <div className="text-[11px] font-mono tracking-widest text-[#A69272]/80 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span>055 369 6305</span>
              <span className="text-[#f1c65a]/40">·</span>
              <span>059 489 1338</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
