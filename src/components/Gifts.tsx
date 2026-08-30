import React, { useState } from 'react';
import { Smartphone, Landmark, Copy, Check, Gift } from 'lucide-react';

export const Gifts: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  return (
    <section id="gifts" className="py-24 bg-[#0a1713] relative overflow-hidden">
      {/* Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(241,198,90,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
            GIFTS
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em] mb-4">
            Monetary Gifts
          </h2>
          <div className="flex items-center justify-center space-x-3 mt-4 mb-6">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#f1c65a] to-[#e2b324]" />
            <Gift size={18} className="text-[#f1c65a]" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent via-[#f1c65a] to-[#e2b324]" />
          </div>
          
          <p className="text-[#DACFB8] text-base md:text-lg leading-relaxed font-light max-w-2xl mx-auto">
            Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, a monetary contribution towards our future together would be deeply appreciated.
          </p>
        </div>

        {/* Gift Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Mobile Money Card */}
          <div className="bg-[#11221c] p-8 border border-[#f1c65a]/30 shadow-2xl relative group transition-all duration-300 hover:border-[#f1c65a]/60">
            <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-[#f1c65a]/20">
              <div className="w-14 h-14 rounded-2xl bg-[#0a1713] border border-[#f1c65a]/40 text-[#f1c65a] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Smartphone size={28} />
              </div>
              <div>
                <h3 className="font-heading text-2xl text-[#FBF7EF] font-normal uppercase tracking-wide">
                  Mobile Money
                </h3>
                <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-[11px] font-semibold tracking-[0.2em] uppercase font-mono">
                  INSTANT TRANSFER
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Network */}
              <div className="bg-[#0a1713]/80 p-4 border border-[#f1c65a]/15">
                <span className="text-[10px] text-[#A69272] tracking-[0.2em] uppercase font-mono block mb-1">
                  NETWORK
                </span>
                <span className="text-base text-[#FBF7EF] font-medium tracking-wide">
                  MTN Mobile Money
                </span>
              </div>

              {/* Mobile Number with Copy */}
              <div className="bg-[#0a1713]/80 p-4 border border-[#f1c65a]/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#A69272] tracking-[0.2em] uppercase font-mono block mb-1">
                    NUMBER
                  </span>
                  <span className="text-lg text-[#f1c65a] font-semibold font-mono tracking-wider">
                    0596618116
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard('0596618116', 'momo-number')}
                  className="p-2.5 rounded border border-[#f1c65a]/30 text-[#f1c65a] hover:bg-[#f1c65a] hover:text-[#0a1713] transition-all duration-300 flex items-center space-x-1.5 text-xs uppercase font-mono"
                  title="Copy MoMo Number"
                >
                  {copiedField === 'momo-number' ? (
                    <>
                      <Check size={16} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Account Name */}
              <div className="bg-[#0a1713]/80 p-4 border border-[#f1c65a]/15">
                <span className="text-[10px] text-[#A69272] tracking-[0.2em] uppercase font-mono block mb-1">
                  ACCOUNT NAME
                </span>
                <span className="text-base text-[#FBF7EF] font-medium tracking-wide">
                  Emmanuel Asare Appiah
                </span>
              </div>
            </div>
          </div>

          {/* Bank Transfer Card */}
          <div className="bg-[#11221c] p-8 border border-[#f1c65a]/30 shadow-2xl relative group transition-all duration-300 hover:border-[#f1c65a]/60">
            <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-[#f1c65a]/20">
              <div className="w-14 h-14 rounded-2xl bg-[#0a1713] border border-[#f1c65a]/40 text-[#f1c65a] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Landmark size={28} />
              </div>
              <div>
                <h3 className="font-heading text-2xl text-[#FBF7EF] font-normal uppercase tracking-wide">
                  Bank Transfer
                </h3>
                <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-[11px] font-semibold tracking-[0.2em] uppercase font-mono">
                  DIRECT DEPOSIT
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Bank Name */}
              <div className="bg-[#0a1713]/80 p-4 border border-[#f1c65a]/15">
                <span className="text-[10px] text-[#A69272] tracking-[0.2em] uppercase font-mono block mb-1">
                  BANK NAME
                </span>
                <span className="text-base text-[#FBF7EF] font-medium tracking-wide">
                  Cal Bank
                </span>
              </div>

              {/* Account Number with Copy */}
              <div className="bg-[#0a1713]/80 p-4 border border-[#f1c65a]/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#A69272] tracking-[0.2em] uppercase font-mono block mb-1">
                    ACCOUNT NUMBER
                  </span>
                  <span className="text-lg text-[#f1c65a] font-semibold font-mono tracking-wider">
                    140003143181
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard('140003143181', 'bank-acc')}
                  className="p-2.5 rounded border border-[#f1c65a]/30 text-[#f1c65a] hover:bg-[#f1c65a] hover:text-[#0a1713] transition-all duration-300 flex items-center space-x-1.5 text-xs uppercase font-mono"
                  title="Copy Account Number"
                >
                  {copiedField === 'bank-acc' ? (
                    <>
                      <Check size={16} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Account Name */}
              <div className="bg-[#0a1713]/80 p-4 border border-[#f1c65a]/15">
                <span className="text-[10px] text-[#A69272] tracking-[0.2em] uppercase font-mono block mb-1">
                  ACCOUNT NAME
                </span>
                <span className="text-base text-[#FBF7EF] font-medium tracking-wide">
                  Grace Edutuah-Appiah
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Reference Note */}
        <div className="text-center">
          <p className="text-[#DACFB8] text-sm italic font-light">
            Please use <span className="text-[#f1c65a] font-normal font-mono">&ldquo;Wedding Gift&rdquo;</span> as the reference for all transfers.
          </p>
        </div>

      </div>
    </section>
  );
};
