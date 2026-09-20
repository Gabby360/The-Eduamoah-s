import React, { useState } from 'react';
import { MessageCircle, Camera, Check, Send } from 'lucide-react';
import { weddingDetails } from '../mocks/weddingData';


export const WhatsAppWishes: React.FC = () => {
  const coupleImage = weddingDetails.couple.storyImage || weddingDetails.couple.heroImage || '/story-custom.jpg';
  const coupleTitle = 'Graham & Christabell';

  // Default WhatsApp number for the Couple (Ghana format 233...)
  const whatsappNumber = weddingDetails.wishesContact?.phone || '233555357220';
  const displayPhone = weddingDetails.wishesContact?.displayPhone || '+233 55 535 7220';

  const quickWishes = [
    "Wishing you both a lifetime of endless love & happiness!",
    "Congratulations Graham & Christabell! God bless your union abundantly!",
    "So happy for you both! Sending love & special wedding picture memories!",
    "May your home be filled with peace, joy, and laughter forever!"
  ];

  const [senderName, setSenderName] = useState('');
  const [selectedWish, setSelectedWish] = useState(quickWishes[0]);
  const [customMessage, setCustomMessage] = useState('');

  const handleSendWhatsApp = () => {
    const nameText = senderName.trim() ? `From: ${senderName.trim()}\n\n` : '';
    const bodyText = customMessage.trim() ? customMessage.trim() : selectedWish;
    const fullMessage = `Hello Graham & Christabell!\n\n${nameText}${bodyText}\n\n[Sent from The Eduamoahs Wedding Website]`;
    
    const encodedMessage = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="wishes" className="py-20 bg-[#0a1713] relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-[#f1c65a]/10 via-[#25D366]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#25D366] bg-clip-text text-transparent text-xs font-semibold tracking-[0.3em] uppercase block mb-2">
            DIRECT WHATSAPP MESSAGES & PHOTOS
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.08em]">
            Send Wishes to the Couple
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#f1c65a]/60 to-transparent mx-auto mt-4" />
        </div>

        {/* Main Card Container */}
        <div className="relative bg-[#11221c] border border-[#f1c65a]/30 rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl transition-all duration-500 hover:border-[#f1c65a]/50">
          
          {/* Gold Corner Accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#f1c65a]/70 rounded-tl" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#f1c65a]/70 rounded-tr" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#f1c65a]/70 rounded-bl" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#f1c65a]/70 rounded-br" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Couple Portrait Photo Frame */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative group w-56 h-56 sm:w-64 sm:h-64 rounded-full p-2 bg-gradient-to-tr from-[#f1c65a] via-[#e2b324] to-[#25D366] shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <img
                    src={coupleImage}
                    alt={coupleTitle}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Subtle inner gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1713]/60 via-transparent to-transparent opacity-40" />
                </div>

                {/* Floating Couple Badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0a1713] border border-[#f1c65a] px-4 py-1 rounded-full shadow-lg flex items-center justify-center whitespace-nowrap">
                  <span className="text-xs font-semibold text-[#FBF7EF] tracking-wider uppercase">THE COUPLE</span>
                </div>
              </div>

              <h3 className="font-heading text-xl sm:text-2xl text-[#FBF7EF] mt-6 font-medium">
                {coupleTitle}
              </h3>
              <p className="text-xs text-[#BFAC90] tracking-widest uppercase mt-1">
                THE EDUAMOAHS' WHATSAPP INBOX ({displayPhone})
              </p>
            </div>

            {/* Right Column: Message Generator & WhatsApp Button */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="bg-[#0a1713]/70 border border-[#f1c65a]/20 p-4 rounded-xl text-xs sm:text-sm text-[#DACFB8] leading-relaxed flex items-start space-x-3">
                <Camera size={20} className="text-[#25D366] flex-shrink-0 mt-0.5" />
                <span>
                  Share a warm prayer, congratulatory wish, or send your favorite pictures taken at the wedding straight to Graham & Christabell's WhatsApp!
                </span>
              </div>

              {/* Quick Wishes Chips */}
              <div>
                <label className="text-xs text-[#f1c65a] font-semibold tracking-wider uppercase block mb-2">
                  Select a Quick Wish (or Type Below):
                </label>
                <div className="space-y-2">
                  {quickWishes.map((wish, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedWish(wish);
                        setCustomMessage(wish);
                      }}
                      className={`w-full text-left p-3 rounded-lg text-xs transition-all duration-300 flex items-center justify-between border ${
                        selectedWish === wish && !customMessage
                          ? 'bg-[#25D366]/15 border-[#25D366] text-[#FBF7EF]'
                          : 'bg-[#0a1713]/40 border-[#f1c65a]/15 text-[#BFAC90] hover:border-[#f1c65a]/40 hover:text-[#FBF7EF]'
                      }`}
                    >
                      <span className="pr-2">{wish}</span>
                      {selectedWish === wish && !customMessage ? (
                        <Check size={14} className="text-[#25D366] flex-shrink-0" />
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] text-[#A69272] tracking-wider uppercase block mb-1">
                    Your Name (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Auntie Grace / Uncle Kwame"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-[#0a1713] border border-[#f1c65a]/25 focus:border-[#25D366] rounded-lg px-4 py-2.5 text-xs text-[#FBF7EF] placeholder-[#BFAC90]/50 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#A69272] tracking-wider uppercase block mb-1">
                    Custom Message or Memory:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Write a personal wish or tell the couple about the photos you are sending..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full bg-[#0a1713] border border-[#f1c65a]/25 focus:border-[#25D366] rounded-lg px-4 py-2.5 text-xs text-[#FBF7EF] placeholder-[#BFAC90]/50 outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Primary Call-to-Action WhatsApp Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] text-white font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-xl flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle size={20} className="fill-current" />
                  <span>SEND WISHES TO THE COUPLE ON WHATSAPP</span>
                  <Send size={16} />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

