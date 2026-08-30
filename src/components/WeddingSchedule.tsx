import React from 'react';
import { weddingDetails } from '../mocks/weddingData';

export const WeddingSchedule: React.FC = () => {
  return (
    <section id="wedding" className="py-24 bg-[#0a1713] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
            THE WEDDING
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em]">
            Schedule & Venue
          </h2>
        </div>

        {/* Venue & Location Cards Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Venue Info */}
          <div className="bg-[#11221c] p-8 border border-[#f1c65a]/30 relative">
            <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
              VENUE
            </span>
            <h3 className="font-heading text-2xl md:text-3xl text-[#FBF7EF] font-normal mb-2">
              {weddingDetails.wedding.venue}
            </h3>
            <p className="text-[#A69272] text-sm tracking-wide">
              {weddingDetails.wedding.address}
            </p>
          </div>

          {/* Date & Time Info */}
          <div className="bg-[#11221c] p-8 border border-[#f1c65a]/30 relative">
            <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
              DATE & TIME
            </span>
            <h3 className="font-heading text-2xl md:text-3xl text-[#FBF7EF] font-normal mb-2">
              {weddingDetails.wedding.dayOfWeek}, {weddingDetails.wedding.date}
            </h3>
            <p className="text-[#A69272] text-sm tracking-wide">
              Ceremony Starts Promptly at {weddingDetails.wedding.time}
            </p>
          </div>
        </div>

        {/* Vertical Gold Timeline */}
        <div className="max-w-3xl mx-auto relative pl-8 md:pl-12 border-l border-[#f1c65a]/40 space-y-12 my-8">
          {weddingDetails.timeline.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Gold Dot on Line */}
              <div className="absolute -left-[37px] md:-left-[53px] top-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#f1c65a] to-[#e2b324] border-4 border-[#0a1713] group-hover:scale-125 transition-transform duration-300 shadow-md shadow-[#f1c65a]/50" />
              
              <div className="bg-[#11221c] p-6 md:p-8 border border-[#f1c65a]/20 transition-all duration-300 hover:border-[#f1c65a]/60">
                <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs md:text-sm font-semibold tracking-[0.25em] uppercase block mb-1">
                  {item.time}
                </span>
                <h4 className="font-heading text-xl md:text-2xl text-[#FBF7EF] tracking-[0.08em] font-normal uppercase mb-3">
                  {item.title}
                </h4>
                <p className="text-[#DACFB8] text-sm md:text-base leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
