import React, { useState, useEffect, useRef } from 'react';
import { weddingDetails } from '../mocks/weddingData';

export const Story: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setVisible(true); return; }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (imgRef.current) obs.observe(imgRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="story" className="py-24 bg-[#0B0907] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-[#C29845] text-xs font-medium tracking-[0.3em] uppercase block mb-3">
            OUR STORY
          </span>
          <div className="w-12 h-[1px] bg-[#C29845]" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image with Slow Cinematic Memory Reveal & Luxury Gold Frame */}
          <div className="lg:col-span-5 relative group" ref={imgRef}>
            <div
              className="relative z-10 p-2 border border-[#C29845]/30 bg-[#141110]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(1.05)',
                filter: visible ? 'blur(0px)' : 'blur(4px)',
                transition: 'opacity 2.6s cubic-bezier(0.16, 1, 0.3, 1), transform 2.6s cubic-bezier(0.16, 1, 0.3, 1), filter 2.2s ease-out',
                willChange: visible ? 'auto' : 'opacity, transform',
              }}
            >
              <img
                src={weddingDetails.couple.storyImage}
                alt="Our Story - Nadia & Kwame"
                className="w-full h-auto object-cover rounded-none filter brightness-95 contrast-105 transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
              />
              {/* Corner Gold Frame Accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#C29845]" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#C29845]" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#C29845]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#C29845]" />
            </div>
            {/* Subtle background glow */}
            <div className="absolute -inset-4 bg-[#C29845]/5 blur-xl pointer-events-none" />
          </div>

          {/* Right Column: Narrative Copy */}
          <div className="lg:col-span-7 space-y-8 text-[#DACFB8] font-body text-base md:text-lg leading-relaxed font-light">
            {weddingDetails.story.paragraphs.map((paragraph, idx) => (
              <p key={idx} className="transition-all duration-700 hover:text-[#FBF7EF]">
                {paragraph}
              </p>
            ))}

            {/* Signature Accent */}
            <div className="pt-6 border-t border-[#C29845]/20 flex items-center justify-between">
              <span className="font-script text-3xl md:text-4xl text-[#D2AC5E]">
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
