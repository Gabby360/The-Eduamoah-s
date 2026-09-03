import React from 'react';
import { weddingDetails } from '../mocks/weddingData';
import { MapPin, Navigation, QrCode } from 'lucide-react';

export const Location: React.FC = () => {
  const mapUrl = weddingDetails.wedding.googleMapsSearchUrl;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(mapUrl)}&color=f1c65a&bgcolor=0a1713`;

  return (
    <section id="location" className="py-12 bg-[#11221c] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
            LOCATION
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em]">
            The Venue
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          
          {/* Venue Info Box */}
          <div className="bg-[#0a1713] p-8 md:p-12 border border-[#f1c65a]/30 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin size={24} className="text-[#f1c65a]" />
              <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs tracking-[0.25em] uppercase font-semibold">
                KASOA
              </span>
            </div>

            <h3 className="font-heading text-2xl md:text-3xl text-[#FBF7EF] font-normal uppercase mb-8 leading-tight">
              {weddingDetails.wedding.venue}
            </h3>

            {/* Directions Button */}
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-gradient-to-r from-[#f1c65a] to-[#e2b324] text-[#0a1713] text-xs tracking-[0.25em] uppercase font-semibold hover:brightness-110 transition-all duration-300 shadow-xl flex items-center justify-center space-x-2"
            >
              <Navigation size={16} />
              <span>GET DIRECTIONS ON GOOGLE MAPS</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
