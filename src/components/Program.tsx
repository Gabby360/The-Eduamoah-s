import React, { useState } from 'react';
import { Download, BookOpen, Camera, User, Music, Heart, Users, Briefcase, Church, Sparkles } from 'lucide-react';

interface ProgramStep {
  number: number;
  title: string;
  officiant?: string;
  note?: string;
  details?: {
    english?: string;
    twi?: string;
  };
}

interface PhotographyGroup {
  categoryNumber: number;
  categoryTitle: string;
  icon: React.ReactNode;
  items: string[];
}

const PROGRAM_OUTLINE: ProgramStep[] = [
  { number: 1, title: 'Opening Prayer', officiant: 'Elder Samuel Gyan' },
  { number: 2, title: 'Chorus', officiant: 'Elder Dr Opoku Kissi' },
  { number: 3, title: 'Bridal Procession', officiant: 'Elder Graham Eduamoah', note: 'One day I will know of the depths of His love for me' },
  {
    number: 4,
    title: 'Bible Reading',
    note: 'Revelation 21 v 2 to 3, Revelation 19 v 7 to 10',
    details: {
      english: 'Elder Emmanuel Nti Agyemang',
      twi: 'Joyce Agyiri'
    }
  },
  { number: 5, title: 'Worship', officiant: 'Minister Christiana Attafuah' },
  { number: 6, title: 'Introduction of Guests / Ministers' },
  { number: 7, title: 'Solo Ministration', officiant: 'Dn Peter Dumelo', note: 'Captain of Israel host' },
  { number: 8, title: 'Exchange of Vows' },
  { number: 9, title: 'Blessing of the Couple' },
  { number: 10, title: 'Signing of Marriage Certificate' },
  { number: 11, title: 'Offering', officiant: 'McKeown Assembly' },
  { number: 12, title: 'Song Ministrations', officiant: 'Sakumono District & Jinijini District' },
  { number: 13, title: 'Introduction of Couple' },
  { number: 14, title: 'Song Ministration', officiant: 'Redeemed Praise Choir (Sakumono)' },
  { number: 15, title: 'Sermon' },
  { number: 16, title: 'Prayer' },
  { number: 17, title: 'Couple’s Response' },
  { number: 18, title: 'Announcements', officiant: 'District Secretary' },
  { number: 19, title: 'Closing Prayer' },
  { number: 20, title: 'Benediction' }
];

const PHOTOGRAPHY_ORDER: PhotographyGroup[] = [
  {
    categoryNumber: 1,
    categoryTitle: 'Church Leadership',
    icon: <Church size={20} className="text-[#f1c65a]" />,
    items: [
      'Apostles and their wives',
      'Pastors and their wives',
      'All Ministers',
      'Officiating Minister and his wife'
    ]
  },
  {
    categoryNumber: 2,
    categoryTitle: 'Families',
    icon: <Heart size={20} className="text-[#f1c65a]" />,
    items: [
      'Mother and Father of the Bride',
      'Mother and Father of the Groom',
      'Family of the Bride',
      'Family of the Groom',
      'Family of the Bride and Groom'
    ]
  },
  {
    categoryNumber: 3,
    categoryTitle: 'Workplace',
    icon: <Briefcase size={20} className="text-[#f1c65a]" />,
    items: [
      'Raphal Medical Center Staff',
      'Physiotherapy Unit – Raphal Medical Center',
      'Department Urban Roads Staff',
      'Christell Ushering Agency'
    ]
  },
  {
    categoryNumber: 4,
    categoryTitle: 'Church & Fellowship Groups',
    icon: <Users size={20} className="text-[#f1c65a]" />,
    items: [
      'Budumburam Top District Presbytery',
      'Budumbrum Top District Members',
      'McKeown Assembly Presbytery',
      'McKeown Assembly Members',
      'Sakumono District Presbytery',
      'Sakumono District Members',
      'EMEF Assembly Presbytery',
      'EMEF Assembly Members',
      'Jinijini District Members',
      'Pensa Kaneshie Sector',
      'Pensa ATU',
      'Pensa PU',
      'KCO Members',
      'COP Ministers Children'
    ]
  },
  {
    categoryNumber: 5,
    categoryTitle: 'Friends',
    icon: <Sparkles size={20} className="text-[#f1c65a]" />,
    items: [
      'Friends of the Bride',
      'Friends of the Groom'
    ]
  }
];

export const Program: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'program' | 'photography'>('program');
  const programPdfUrl = '/The-Eduamoahs-Wedding-Program.pdf';

  return (
    <section id="program" className="py-16 bg-[#0a1713] relative overflow-hidden">
      {/* Background Decorative Subtle Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#f1c65a]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs font-semibold tracking-[0.3em] uppercase block mb-2">
            OFFICIAL DETAILS
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em]">
            Program & Photography
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#f1c65a]/60 to-transparent mx-auto mt-4" />
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#11221c] p-1.5 rounded-full border border-[#f1c65a]/30 shadow-xl flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('program')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${
                activeTab === 'program'
                  ? 'bg-gradient-to-r from-[#f1c65a] to-[#e2b324] text-[#0a1713] shadow-md scale-[1.02]'
                  : 'text-[#BFAC90] hover:text-[#FBF7EF]'
              }`}
            >
              <BookOpen size={15} />
              <span>Program Outline</span>
            </button>

            <button
              onClick={() => setActiveTab('photography')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${
                activeTab === 'photography'
                  ? 'bg-gradient-to-r from-[#f1c65a] to-[#e2b324] text-[#0a1713] shadow-md scale-[1.02]'
                  : 'text-[#BFAC90] hover:text-[#FBF7EF]'
              }`}
            >
              <Camera size={15} />
              <span>Order of Photography</span>
            </button>
          </div>
        </div>

        {/* ── TAB 1: PROGRAM OUTLINE ── */}
        {activeTab === 'program' && (
          <div className="relative bg-[#11221c] border border-[#f1c65a]/30 p-6 sm:p-8 md:p-12 shadow-2xl transition-all duration-500 hover:border-[#f1c65a]/50">
            {/* Gold Frame Corner Accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#f1c65a]/70" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#f1c65a]/70" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#f1c65a]/70" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#f1c65a]/70" />

            {/* Header Badge & Conductor info */}
            <div className="text-center pb-6 border-b border-[#f1c65a]/20 mb-8 flex flex-col items-center">
              <span className="inline-block bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-[11px] tracking-[0.3em] uppercase font-semibold border border-[#f1c65a]/30 px-5 py-1.5 bg-[#0a1713] rounded-full mb-3">
                GRAHAM & CHRISTABELL WEDDING - PROGRAM OUTLINE
              </span>
              
              <div className="mt-2 inline-flex items-center space-x-2 text-xs">
                <User size={14} className="text-[#f1c65a]" />
                <span className="text-[#A69272] tracking-wider uppercase">Conductor:</span>
                <span className="text-[#FBF7EF] font-semibold tracking-wide">Elder Antobam</span>
              </div>
            </div>

            {/* Program Timeline Items */}
            <div className="space-y-4 max-w-3xl mx-auto">
              {PROGRAM_OUTLINE.map((step) => (
                <div
                  key={step.number}
                  className="bg-[#0a1713]/60 hover:bg-[#0a1713] border border-[#f1c65a]/15 hover:border-[#f1c65a]/40 transition-all duration-300 p-4 sm:p-5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start sm:items-center space-x-4">
                    {/* Step Number Badge */}
                    <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#f1c65a] to-[#e2b324] text-[#0a1713] font-bold text-xs sm:text-sm flex items-center justify-center shadow-md font-mono">
                      {String(step.number).padStart(2, '0')}
                    </div>

                    {/* Step Title & Details */}
                    <div>
                      <h3 className="font-heading text-base sm:text-lg text-[#FBF7EF] group-hover:text-[#f1c65a] transition-colors font-medium tracking-wide">
                        {step.title}
                      </h3>

                      {/* Song Note / Special Subtitle */}
                      {step.note && (
                        <p className="text-xs text-[#d4af37] italic mt-0.5 flex items-center gap-1.5">
                          {step.number === 3 || step.number === 7 ? <Music size={12} className="inline" /> : null}
                          <span>{step.note}</span>
                        </p>
                      )}

                      {/* Bible Reading Details */}
                      {step.details && (
                        <div className="mt-2 text-xs text-[#BFAC90] space-y-1">
                          {step.details.english && (
                            <div>
                              <span className="text-[#f1c65a] font-semibold">Eng:</span> {step.details.english}
                            </div>
                          )}
                          {step.details.twi && (
                            <div>
                              <span className="text-[#f1c65a] font-semibold">Twi:</span> {step.details.twi}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Officiant / Lead Tag */}
                  {step.officiant && (
                    <div className="self-start sm:self-center pl-12 sm:pl-0">
                      <span className="inline-block text-[11px] sm:text-xs text-[#f1c65a] font-medium tracking-wide">
                        {step.officiant}
                      </span>
                    </div>
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
        )}

        {/* ── TAB 2: ORDER OF PHOTOGRAPHY ── */}
        {activeTab === 'photography' && (
          <div className="relative bg-[#11221c] border border-[#f1c65a]/30 p-6 sm:p-8 md:p-12 shadow-2xl transition-all duration-500 hover:border-[#f1c65a]/50">
            {/* Gold Frame Corner Accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#f1c65a]/70" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#f1c65a]/70" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#f1c65a]/70" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#f1c65a]/70" />

            {/* Photography Header Inside Card */}
            <div className="text-center pb-6 border-b border-[#f1c65a]/20 mb-8">
              <span className="inline-block bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-[11px] tracking-[0.3em] uppercase font-semibold border border-[#f1c65a]/30 px-5 py-1.5 bg-[#0a1713] rounded-full">
                OFFICIAL ORDER OF PHOTOGRAPHY
              </span>
            </div>

            {/* Photography Groups Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PHOTOGRAPHY_ORDER.map((group) => (
                <div
                  key={group.categoryNumber}
                  className={`bg-[#0a1713]/80 border border-[#f1c65a]/20 p-6 rounded-lg transition-all duration-300 hover:border-[#f1c65a]/50 ${
                    group.categoryNumber === 4 ? 'md:col-span-2' : ''
                  }`}
                >
                  {/* Category Title Header */}
                  <div className="flex items-center space-x-3 border-b border-[#f1c65a]/15 pb-3 mb-4">
                    <div className="flex-shrink-0">
                      {group.icon}
                    </div>
                    <div>
                      <span className="text-[10px] text-[#f1c65a] font-mono tracking-widest uppercase block">
                        SECTION 0{group.categoryNumber}
                      </span>
                      <h3 className="font-heading text-lg text-[#FBF7EF] font-normal tracking-wide">
                        {group.categoryTitle}
                      </h3>
                    </div>
                  </div>

                  {/* List Items Grid */}
                  <div
                    className={`grid gap-2 text-sm text-[#DACFB8] ${
                      group.categoryNumber === 4
                        ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                        : 'grid-cols-1 sm:grid-cols-2'
                    }`}
                  >
                    {group.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2.5 py-1.5 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f1c65a] flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-[#FBF7EF]/90 font-light">{item}</span>
                      </div>
                    ))}
                  </div>
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
        )}

      </div>
    </section>
  );
};

