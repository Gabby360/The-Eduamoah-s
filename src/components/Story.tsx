import React, { useState } from 'react';
import { weddingDetails } from '../mocks/weddingData';
import { Heart, Quote } from 'lucide-react';

export const Story: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bride' | 'groom'>('bride');

  const activeStory = activeTab === 'bride' ? weddingDetails.story.brideStory : weddingDetails.story.groomStory;
  const activeImage = activeTab === 'bride' ? weddingDetails.couple.brideImage : weddingDetails.couple.groomImage;

  return (
    <section id="story" className="py-24 bg-[#0a1713] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
            OUR STORY
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em] mb-4">
            How We Met & Fell In Love
          </h2>
          <p className="font-heading italic text-base md:text-xl text-[#DACFB8] font-light max-w-xl mx-auto mb-6">
            Two perspectives, one divine journey guided by faith, prayer, and love.
          </p>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#f1c65a] via-[#e2b324] to-transparent mx-auto mb-10" />

          {/* Perspective Switcher Tabs */}
          <div className="inline-flex p-1.5 bg-[#11221c] border border-[#f1c65a]/30 rounded-full shadow-2xl space-x-2">
            <button
              onClick={() => setActiveTab('bride')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-500 ${
                activeTab === 'bride'
                  ? 'bg-gradient-to-r from-[#f1c65a] to-[#e2b324] text-[#0a1713] shadow-lg shadow-[#f1c65a]/20 scale-[1.02]'
                  : 'text-[#A69272] hover:text-[#FBF7EF]'
              }`}
            >
              <Heart size={14} className={activeTab === 'bride' ? 'fill-[#0a1713]' : 'text-[#f1c65a]'} />
              <span>HER STORY (NADIA)</span>
            </button>
            <button
              onClick={() => setActiveTab('groom')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-500 ${
                activeTab === 'groom'
                  ? 'bg-gradient-to-r from-[#f1c65a] to-[#e2b324] text-[#0a1713] shadow-lg shadow-[#f1c65a]/20 scale-[1.02]'
                  : 'text-[#A69272] hover:text-[#FBF7EF]'
              }`}
            >
              <Heart size={14} className={activeTab === 'groom' ? 'fill-[#0a1713]' : 'text-[#f1c65a]'} />
              <span>HIS STORY (GRAHAM)</span>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Portrait Image with Luxury Gold Frame */}
          <div className="lg:col-span-5 relative group sticky top-28">
            <div className="relative z-10 p-2 border border-[#f1c65a]/30 bg-[#11221c] shadow-2xl">
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  key={activeImage}
                  src={activeImage}
                  alt={activeStory.author}
                  className="w-full h-full object-cover filter brightness-95 contrast-105 transition-all duration-700 animate-fade-in group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1713]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent font-heading text-xl md:text-2xl font-normal block drop-shadow-md">
                    {activeStory.author}
                  </span>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#A69272] font-mono">
                    {activeStory.title}
                  </span>
                </div>
              </div>
              {/* Corner Gold Frame Accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#f1c65a]" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#f1c65a]" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#f1c65a]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#f1c65a]" />
            </div>
            {/* Subtle background glow */}
            <div className="absolute -inset-4 bg-[#f1c65a]/10 blur-2xl pointer-events-none" />
          </div>

          {/* Right Column: Dynamic Narrative Story Chapters */}
          <div key={activeTab} className="lg:col-span-7 space-y-10 animate-fade-in">
            {activeStory.chapters.map((chapter, idx) => (
              <div
                key={idx}
                className="bg-[#11221c]/90 border border-[#f1c65a]/20 p-6 md:p-8 relative shadow-xl hover:border-[#f1c65a]/50 transition-colors duration-300"
              >
                <Quote size={28} className="text-[#f1c65a]/20 absolute top-4 right-4 pointer-events-none" />
                
                <h3 className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent font-heading text-xl md:text-2xl font-normal mb-4 tracking-wide uppercase">
                  {chapter.title}
                </h3>

                <div className="space-y-4 text-[#DACFB8] font-body text-base leading-relaxed font-light">
                  {chapter.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="hover:text-[#FBF7EF] transition-colors duration-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* Signature Accent */}
            <div className="pt-6 border-t border-[#f1c65a]/20 flex items-center justify-between">
              <span className="font-script text-3xl md:text-4xl bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent">
                Nadia & Graham
              </span>
              <span className="text-xs tracking-[0.25em] text-[#A69272] uppercase font-mono">
                PCC • Dec 2021 to Oct 2026
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
