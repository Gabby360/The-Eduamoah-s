import React from 'react';
import { Download } from 'lucide-react';

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
  const programPdfUrl = '/The-Eduamoahs-Wedding-Program.pdf';

  return (
    <section id="program" className="py-24 bg-[#0a1713] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
            ORDER OF EVENTS
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em]">
            The Celebration
          </h2>
        </div>

        {/* Program Preview Card Container */}
        <div className="relative bg-[#11221c] border border-[#f1c65a]/30 p-6 md:p-12 shadow-2xl transition-all duration-500 hover:border-[#f1c65a]/60">
          {/* Gold Frame Corner Accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#f1c65a]/70" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#f1c65a]/70" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#f1c65a]/70" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#f1c65a]/70" />

          {/* Program Header Inside Card */}
          <div className="text-center pb-8 border-b border-[#f1c65a]/20 mb-10">
            <span className="inline-block bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-[10px] tracking-[0.3em] uppercase font-semibold border border-[#f1c65a]/30 px-4 py-1.5 bg-[#0a1713] rounded-full mb-4">
              OFFICIAL WEDDING PROGRAM
            </span>
            <h3 className="font-heading text-2xl md:text-4xl text-[#FBF7EF] font-normal tracking-wide">
              Dns. Christabell & Elder George Graham
            </h3>
            <p className="text-[#A69272] text-xs md:text-sm tracking-[0.2em] uppercase mt-2 font-mono">
              10th October 2026 • Kasoa, Ghana
            </p>
          </div>

          {/* Timeline Events List */}
          <div className="relative max-w-2xl mx-auto pl-6 md:pl-8 space-y-6">
            {/* Timeline Vertical Gold Line */}
            <div className="absolute left-[11px] md:left-[15px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#f1c65a] via-[#e2b324]/50 to-transparent" />

            {PROGRAM_EVENTS.map((event, idx) => (
              <div key={idx} className="relative flex items-center justify-between group">
                {/* Gold Bullet Dot */}
                <div className="absolute -left-[23px] md:-left-[27px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#0a1713] border border-[#f1c65a] group-hover:bg-[#f1c65a] transition-colors duration-300 shadow-md" />

                {/* Event Title */}
                <div className="font-heading text-base md:text-xl text-[#FBF7EF] group-hover:text-[#f1c65a] transition-colors duration-300 font-normal">
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

          {/* Action Button: DOWNLOAD PROGRAM */}
          <div className="pt-10 mt-10 border-t border-[#f1c65a]/20 flex items-center justify-center">
            <a
              href={programPdfUrl}
              download="The-Eduamoahs-Wedding-Program.pdf"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-10 py-3.5 bg-gradient-to-r from-[#f1c65a] to-[#e2b324] text-[#0a1713] font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 shadow-lg hover:brightness-110 hover:scale-[1.02]"
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
