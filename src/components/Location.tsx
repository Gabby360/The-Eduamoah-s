import React from 'react';
import { weddingDetails } from '../mocks/weddingData';
import { MapPin, Navigation, QrCode } from 'lucide-react';

export const Location: React.FC = () => {
  const mapUrl = weddingDetails.wedding.googleMapsSearchUrl;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(mapUrl)}&color=f1c65a&bgcolor=0a1713`;

  return (
    <section id="location" className="py-24 bg-[#11221c] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
            LOCATION
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em] mb-4">
            The Venue
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#f1c65a] via-[#e2b324] to-transparent mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Venue Info Box */}
          <div className="lg:col-span-6 bg-[#0a1713] p-8 md:p-12 border border-[#f1c65a]/30 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin size={24} className="text-[#f1c65a]" />
              <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs tracking-[0.25em] uppercase font-semibold">
                KASOA, GHANA
              </span>
            </div>

            <h3 className="font-heading text-2xl md:text-3xl text-[#FBF7EF] font-normal uppercase mb-4 leading-tight">
              {weddingDetails.wedding.venue}
            </h3>

            <div className="space-y-4 pt-6 border-t border-[#f1c65a]/20 mb-8">
              <div className="flex items-center justify-between text-xs text-[#A69272] tracking-wider uppercase">
                <span>WEDDING CEREMONY</span>
                <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent font-semibold">{weddingDetails.wedding.ceremonyTime}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#A69272] tracking-wider uppercase">
                <span>RECEPTION</span>
                <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent font-semibold">{weddingDetails.wedding.receptionTime}</span>
              </div>
            </div>

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

          {/* QR Code Location Map Card */}
          <div className="lg:col-span-6 bg-[#0a1713] border border-[#f1c65a]/30 p-8 md:p-10 text-center relative overflow-hidden shadow-2xl flex flex-col items-center justify-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <QrCode size={20} className="text-[#f1c65a]" />
              <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs tracking-[0.3em] uppercase font-semibold">
                SCAN FOR LOCATION
              </span>
            </div>

            {/* QR Code Frame */}
            <div className="p-4 bg-[#0a1713] border-2 border-[#f1c65a]/50 rounded-lg shadow-2xl mb-4 relative group">
              <img
                src={qrCodeUrl}
                alt="Scan For Location - Google Maps QR Code"
                className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto"
              />
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#f1c65a]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#f1c65a]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#f1c65a]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#f1c65a]" />
            </div>

            <p className="text-[#DACFB8] text-xs tracking-widest uppercase font-mono">
              Point your smartphone camera to open Google Maps navigation
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
