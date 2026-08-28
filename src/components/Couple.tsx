import React, { useState, useEffect, useRef } from 'react';
import { weddingDetails } from '../mocks/weddingData';

export const Couple: React.FC = () => {
  const [visible, setVisible] = useState([false, false]);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setVisible([true, true]); return; }

    const observers: IntersectionObserver[] = [];
    refs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisible(prev => { const n = [...prev]; n[idx] = true; return n; });
            }, idx * 400); // 400ms slow stagger between Bride & Groom
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section id="couple" className="py-24 bg-[#141110] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-[#C29845] text-xs font-medium tracking-[0.3em] uppercase block mb-3">
            MEET THE COUPLE
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em] mb-4">
            Bride & Groom
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C29845] to-transparent mx-auto" />
        </div>

        {/* Side-by-Side Portraits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

          {/* Bride Card */}
          <div
            ref={el => (refs.current[0] = el)}
            className="group relative bg-[#0B0907] p-4 border border-[#C29845]/30 shadow-2xl transition-all duration-700 hover:border-[#C29845]/60"
            style={{
              opacity: visible[0] ? 1 : 0,
              transform: visible[0] ? 'translateY(0) scale(1)' : 'translateY(24px) scale(1.05)',
              filter: visible[0] ? 'blur(0px)' : 'blur(4px)',
              transition: 'opacity 2.6s cubic-bezier(0.16, 1, 0.3, 1), transform 2.6s cubic-bezier(0.16, 1, 0.3, 1), filter 2.2s ease-out',
              willChange: visible[0] ? 'auto' : 'opacity, transform',
            }}
          >
            <div className="relative overflow-hidden aspect-[3/4] mb-6">
              <img
                src={weddingDetails.couple.brideImage}
                alt={weddingDetails.couple.brideName}
                className="w-full h-full object-cover object-[50%_15%] transition-transform duration-1000 ease-out group-hover:scale-105 filter brightness-95"
              />
              {/* Corner Frame Highlights */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-[#C29845]" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-[#C29845]" />
            </div>

            <div className="text-center px-4 pb-4">
              <span className="text-[#C29845] text-xs tracking-[0.3em] uppercase font-medium block mb-2">
                {weddingDetails.couple.brideSubtitle}
              </span>
              <h3 className="font-heading text-2xl md:text-3xl text-[#FBF7EF] font-normal mb-3">
                {weddingDetails.couple.brideName}
              </h3>
              <p className="text-[#A69272] text-sm leading-relaxed font-light">
                {weddingDetails.couple.brideBio}
              </p>
            </div>
          </div>

          {/* Groom Card */}
          <div
            ref={el => (refs.current[1] = el)}
            className="group relative bg-[#0B0907] p-4 border border-[#C29845]/30 shadow-2xl transition-all duration-700 hover:border-[#C29845]/60"
            style={{
              opacity: visible[1] ? 1 : 0,
              transform: visible[1] ? 'translateY(0) scale(1)' : 'translateY(24px) scale(1.05)',
              filter: visible[1] ? 'blur(0px)' : 'blur(4px)',
              transition: 'opacity 2.6s cubic-bezier(0.16, 1, 0.3, 1), transform 2.6s cubic-bezier(0.16, 1, 0.3, 1), filter 2.2s ease-out',
              willChange: visible[1] ? 'auto' : 'opacity, transform',
            }}
          >
            <div className="relative overflow-hidden aspect-[3/4] mb-6">
              <img
                src={weddingDetails.couple.groomImage}
                alt={weddingDetails.couple.groomName}
                className="w-full h-full object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-105 filter brightness-95"
              />
              {/* Corner Frame Highlights */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-[#C29845]" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-[#C29845]" />
            </div>

            <div className="text-center px-4 pb-4">
              <span className="text-[#C29845] text-xs tracking-[0.3em] uppercase font-medium block mb-2">
                {weddingDetails.couple.groomSubtitle}
              </span>
              <h3 className="font-heading text-2xl md:text-3xl text-[#FBF7EF] font-normal mb-3">
                {weddingDetails.couple.groomName}
              </h3>
              <p className="text-[#A69272] text-sm leading-relaxed font-light">
                {weddingDetails.couple.groomBio}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
