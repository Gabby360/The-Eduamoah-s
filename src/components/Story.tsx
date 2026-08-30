import React from 'react';
import { weddingDetails } from '../mocks/weddingData';

export const Story: React.FC = () => {
  return (
    <section id="story" className="py-24 bg-[#0a1713] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
            OUR STORY
          </span>
          <div className="w-16 h-[1px] bg-gradient-to-r from-[#f1c65a] to-[#e2b324]" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image with Luxury Gold Frame Accents */}
          <div className="lg:col-span-5 relative group">
            <div className="relative z-10 p-2 border border-[#f1c65a]/30 bg-[#11221c]">
              <img
                src={weddingDetails.couple.storyImage}
                alt="Our Story - Nadia & Kwame"
                className="w-full h-auto object-cover rounded-none filter brightness-95 contrast-105 transition-transform duration-700 group-hover:scale-[1.02]"
              />
              {/* Corner Gold Frame Accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#f1c65a]" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#f1c65a]" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#f1c65a]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#f1c65a]" />
            </div>
            {/* Subtle background glow */}
            <div className="absolute -inset-4 bg-[#f1c65a]/5 blur-xl pointer-events-none" />
          </div>

          {/* Right Column: Narrative Copy */}
          <div className="lg:col-span-7 space-y-8 text-[#DACFB8] font-body text-base md:text-lg leading-relaxed font-light">
            {weddingDetails.story.paragraphs.map((paragraph, idx) => (
              <p key={idx} className="transition-all duration-500 hover:text-[#FBF7EF]">
                {paragraph}
              </p>
            ))}

            {/* Signature Accent */}
            <div className="pt-6 border-t border-[#f1c65a]/20 flex items-center justify-between">
              <span className="font-script text-3xl md:text-4xl bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent">
                Nadia & Kwame
              </span>
              <span className="text-xs tracking-[0.25em] text-[#A69272] uppercase font-mono">
                Oct 10, 2026
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
