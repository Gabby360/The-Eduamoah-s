import React from 'react';
import { weddingDetails } from '../mocks/weddingData';
import { MapPin, Navigation, Compass } from 'lucide-react';

export const Location: React.FC = () => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    weddingDetails.wedding.venue + ', ' + weddingDetails.wedding.address
  )}`;

  return (
    <section id="location" className="py-24 bg-[#141110] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#C29845] text-xs font-medium tracking-[0.3em] uppercase block mb-3">
            LOCATION
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em] mb-4">
            The Venue
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C29845] to-transparent mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Venue Info Box */}
          <div className="lg:col-span-5 bg-[#0B0907] p-8 md:p-12 border border-[#C29845]/30 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin size={24} className="text-[#C29845]" />
              <span className="text-[#C29845] text-xs tracking-[0.25em] uppercase font-semibold">
                ACCRA, GHANA
              </span>
            </div>

            <h3 className="font-heading text-3xl text-[#FBF7EF] font-normal uppercase mb-4 leading-tight">
              {weddingDetails.wedding.venue}
            </h3>

            <p className="text-[#DACFB8] text-base leading-relaxed font-light mb-8">
              {weddingDetails.wedding.address}
            </p>

            <div className="space-y-4 pt-6 border-t border-[#C29845]/20 mb-8">
              <div className="flex items-center justify-between text-xs text-[#A69272] tracking-wider uppercase">
                <span>CEREMONY</span>
                <span className="text-[#D2AC5E] font-semibold">{weddingDetails.wedding.ceremonyTime}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#A69272] tracking-wider uppercase">
                <span>RECEPTION</span>
                <span className="text-[#D2AC5E] font-semibold">{weddingDetails.wedding.receptionTime}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#A69272] tracking-wider uppercase">
                <span>DINNER & CELEBRATION</span>
                <span className="text-[#D2AC5E] font-semibold">6:00 PM TILL LATE</span>
              </div>
            </div>

            {/* Directions Button */}
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#C29845] text-[#0B0907] text-xs tracking-[0.25em] uppercase font-semibold hover:brightness-110 transition-all duration-300 shadow-xl flex items-center justify-center space-x-2"
            >
              <Navigation size={16} />
              <span>GET DIRECTIONS</span>
            </a>
          </div>

          {/* Interactive Map Frame / Preview */}
          <div className="lg:col-span-7 h-[420px] bg-[#0B0907] border border-[#C29845]/30 relative overflow-hidden shadow-2xl group">
            <iframe
              title="Venue Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.6136279624536!2d-0.1585!3d5.6425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzgnMzMuMCJOIDDCsDA5JzMwLjYiVw!5e0!3m2!1sen!2sgh!4v1680000000000!5m2!1sen!2sgh"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(120%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
            {/* Map Overlay Frame */}
            <div className="absolute top-4 left-4 bg-[#0B0907]/90 px-4 py-2 border border-[#C29845]/40 text-xs text-[#D2AC5E] tracking-widest uppercase font-mono flex items-center space-x-2">
              <Compass size={14} className="animate-spin-slow" />
              <span>EAST LEGON, ACCRA</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
