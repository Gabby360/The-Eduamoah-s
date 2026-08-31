import React from 'react';
import { Phone } from 'lucide-react';
import { weddingDetails } from '../mocks/weddingData';

export const RSVP: React.FC = () => {
  return (
    <section id="rsvp" className="py-12 bg-[#11221c] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
            RSVP
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em]">
            Will You Celebrate With Us?
          </h2>
        </div>

        {/* Official RSVP Contacts Card */}
        <div className="bg-[#0a1713] border border-[#f1c65a]/30 p-6 md:p-10 shadow-2xl">
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs tracking-[0.3em] uppercase font-semibold block text-center mb-8">
            RSVP CONTACT PERSONS
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {weddingDetails.rsvpContacts.map((contact, idx) => (
              <a
                key={idx}
                href={`tel:${contact.phone}`}
                className="bg-[#11221c] border border-[#f1c65a]/20 hover:border-[#f1c65a] p-6 text-center group transition-all duration-300 shadow-md flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-[#0a1713] border border-[#f1c65a]/40 group-hover:border-[#f1c65a] group-hover:bg-[#f1c65a] text-[#f1c65a] group-hover:text-[#0a1713] flex items-center justify-center transition-all duration-300">
                  <Phone size={20} />
                </div>
                <div className="text-base font-medium text-[#FBF7EF]">
                  {contact.name}
                </div>
                <div className="text-xs text-[#f1c65a] tracking-wider font-mono">
                  {contact.displayPhone}
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
