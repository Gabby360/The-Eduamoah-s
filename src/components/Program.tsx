import React, { useState, useEffect, useRef } from 'react';
import { Eye, Download, Sparkles } from 'lucide-react';

interface ProgramEvent {
  title: string;
  category?: string;
}

const PROGRAM_EVENTS: ProgramEvent[] = [
  { title: 'Arrival & Seating', category: 'Welcome' },
  { title: 'Opening Prayer', category: 'Ceremony' },
  { title: 'Bridal Procession', category: 'Ceremony' },
  { title: 'Marriage Ceremony', category: 'Ceremony' },
  { title: 'Signing of the Marriage Certificate', category: 'Ceremony' },
  { title: 'Family & Special Moments', category: 'Photos' },
  { title: 'Reception', category: 'Celebration' },
  { title: 'Dinner', category: 'Dining' },
  { title: 'Speeches & Toasts', category: 'Tributes' },
  { title: 'Cutting of the Cake', category: 'Celebration' },
  { title: 'First Dance', category: 'Celebration' },
  { title: 'Bouquet Toss', category: 'Fun' },
  { title: 'Dancing & Celebration', category: 'Party' },
  { title: 'Closing / Departure', category: 'Farewell' },
];

export const Program: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.12 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const programPdfUrl = '/The-Eduamoahs-Wedding-Program.pdf';

  return (
    <section id="program" className="py-24 bg-[#0B0907] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12" ref={sectionRef}>
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#C29845] text-xs font-medium tracking-[0.3em] uppercase block mb-3">
            ORDER OF EVENTS
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em] mb-4">
            The Celebration
          </h2>
          <p className="font-heading italic text-base md:text-xl text-[#DACFB8] font-light max-w-xl mx-auto mb-6">
            Every beautiful moment, thoughtfully planned.
          </p>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C29845] to-transparent mx-auto" />
        </div>

        {/* Program Preview Card Container */}
        <div className="relative bg-[#141110] border border-[#C29845]/30 p-6 md:p-12 shadow-2xl transition-all duration-500 hover:border-[#C29845]/60">
          {/* Gold Frame Corner Accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#C29845]/70" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#C29845]/70" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#C29845]/70" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#C29845]/70" />

          {/* Program Header Inside Card */}
          <div className="text-center pb-8 border-b border-[#C29845]/20 mb-10">
            <span className="inline-flex items-center space-x-2 text-[#D2AC5E] text-[10px] tracking-[0.3em] uppercase font-semibold border border-[#C29845]/30 px-3 py-1 bg-[#0B0907]/80 rounded-full mb-4">
              <Sparkles size={12} className="text-[#C29845]" />
              <span>OFFICIAL WEDDING PROGRAM</span>
            </span>
            <h3 className="font-heading text-2xl md:text-4xl text-[#FBF7EF] font-normal tracking-wide">
              Nadia & Kwame
            </h3>
            <p className="text-[#A69272] text-xs md:text-sm tracking-[0.2em] uppercase mt-2 font-mono">
              October 10, 2026 • Accra, Ghana
            </p>
          </div>

          {/* Timeline Events List */}
          <div className="relative max-w-2xl mx-auto pl-6 md:pl-8 space-y-6">
            {/* Timeline Vertical Gold Line */}
            <div className="absolute left-[11px] md:left-[15px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#C29845]/60 via-[#C29845]/30 to-transparent" />

            {PROGRAM_EVENTS.map((event, idx) => (
              <div key={idx} className="relative flex items-center justify-between group">
                {/* Gold Bullet Dot */}
                <div className="absolute -left-[23px] md:-left-[27px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#0B0907] border border-[#C29845] group-hover:bg-[#C29845] transition-colors duration-300 shadow-md" />

                {/* Event Title */}
                <div className="font-heading text-base md:text-xl text-[#FBF7EF] group-hover:text-[#D2AC5E] transition-colors duration-300 font-normal">
                  {event.title}
                </div>

                {/* Optional Event Category Tag */}
                {event.category && (
                  <span className="text-[10px] md:text-xs text-[#A69272] uppercase tracking-widest font-mono hidden sm:inline-block">
                    {event.category}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons: VIEW PROGRAM & DOWNLOAD PROGRAM */}
          <div className="pt-10 mt-10 border-t border-[#C29845]/20 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* View Program — opens PDF in browser viewer tab */}
            <a
              href={programPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 bg-[#C29845] hover:bg-[#D2AC5E] text-[#0B0907] font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <Eye size={16} />
              <span>VIEW PROGRAM</span>
            </a>

            {/* Download Program — downloads PDF directly to device */}
            <a
              href={programPdfUrl}
              download="The-Eduamoahs-Wedding-Program.pdf"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 border border-[#C29845]/60 hover:border-[#C29845] bg-[#0B0907]/80 hover:bg-[#C29845]/20 text-[#FBF7EF] hover:text-[#D2AC5E] font-medium text-xs tracking-[0.25em] uppercase transition-all duration-300 shadow-lg"
            >
              <Download size={16} />
              <span>DOWNLOAD PROGRAM</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
