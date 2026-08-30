import React, { useRef, useEffect, useState } from 'react';
import { weddingDetails } from '../mocks/weddingData';

const CHAPTERS = [
  {
    title: 'How We Met',
    date: 'December 30, 2021 • Pentecost Convention Center',
    bride: {
      paragraphs: [
        "Graham and I met on the 30th of December, 2021, at PCC, while we were preparing for the PENSA Ghana Conference 2022. He was the Accommodation Head, and I was part of the Food Committee.",
        "When I arrived that day, I was told to contact him for a place to sleep. I called him, and we met at the dining hall. He said he was eating and would help me after, but when I got there, I saw him chatting — everywhere, talking to people, the center of attention. I was beyond exhausted, and honestly, that whole scene frustrated me. That first day, I was genuinely annoyed. I never thought I would become friends with him, let alone fall in love."
      ]
    },
    groom: {
      paragraphs: [
        "I was at PCC on December 2021 in preparation towards PENSA Ghana Conference January, 2022 when an unknown number called me. I was used to receiving unknown calls due to my role as the Accommodation Head.",
        'Picking up the call was this soft voice in distress asking for her room reservation. Since I was already taking my supper at Eunice Addison Block, I asked her to come around. Inviting her to join me for a meal gradually evolved into exchanged pleasantries, calls and WhatsApp conversations. Eventually, we became what she called \u201cAccountability Partners.\u201d'
      ]
    }
  },
  {
    title: 'The Attraction',
    date: 'PENSA Ghana Conference, January 2022 & Beyond',
    bride: {
      paragraphs: [
        "My journey with Graham wasn't love at first sight. After that first day, we kept crossing paths at the conference. Slowly, we began greeting each other more often and sharing small moments. What started as a casual acquaintance grew into a deep friendship — good friends, then best friends, then accountability partners, prayer partners, and finally lovers.",
        "From the very start, I kept telling him I didn't like dark-skinned guys — that I preferred a complexion somewhere between 5:30 p.m. and 7:30 p.m., but not as dark as 9 p.m. But our love grew slowly at the place of prayer, interceding for others and for each other. I will say I first found his voice attractive, and then the way he walks."
      ]
    },
    groom: {
      paragraphs: [
        'The attraction was not immediate or based on our usual \u201cspec.\u201d In fact, we were almost polar opposites. However, our conversations began to pick up momentum, and we found ourselves sharing our burdens, praying for each other and becoming intercessors for others as well.',
        "That spiritual connection and the depth of our friendship gradually revealed a bond that was both unexpected and profound."
      ]
    }
  },
  {
    title: 'How I Knew They Were The One',
    date: 'The Moment Everything Became Clear',
    bride: {
      paragraphs: [
        "I had my personal conviction, and I completely knew he was the one when I realized that I easily do me when I am around him — how he cares so much about me and my future.",
        "Our journey has been one of faith, hope, and love. Every step was guided by God, and every lesson was anchored in faith and hope. And today, I am so grateful — because I never imagined that a frustrating first day would lead me to this place: doing life, hand in hand, with him."
      ]
    },
    groom: {
      paragraphs: [
        "I knew she was the one when I realized that, despite our differences, she complements my vision. What began as an unlikely possibility became a watershed moment in our lives.",
        'Her eventual response to my proposal \u2014 \u201cI agree to marry you\u201d \u2014 delivered via a QR code on my birthday, was a poignant and beautiful gesture and a memorable confirmation of the journey we had begun as Accountability Partners.'
      ]
    }
  }
];

const ChapterBlock: React.FC<{ chapter: typeof CHAPTERS[0]; index: number }> = ({ chapter, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Chapter Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#f1c65a]/40" />
          <span className="text-[#f1c65a]/50 text-[9px] tracking-[0.5em] uppercase font-mono shrink-0">
            CHAPTER {index + 1}
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#f1c65a]/40" />
        </div>
        <h3 className="font-heading text-2xl md:text-3xl text-[#FBF7EF] uppercase tracking-[0.12em] font-normal mb-2">
          {chapter.title}
        </h3>
        <p className="text-[10px] tracking-[0.3em] text-[#A69272] uppercase font-mono">{chapter.date}</p>
      </div>

      {/* Dual Perspective — Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 border border-[#f1c65a]/20 shadow-2xl overflow-hidden">

        {/* Bride's Perspective */}
        <div className="p-7 md:p-10 bg-[#11221c] border-b md:border-b-0 md:border-r border-[#f1c65a]/15 relative">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#f1c65a]/50 shrink-0">
              <img
                src={weddingDetails.couple.brideImage}
                alt="Nadia"
                className="w-full h-full object-cover object-[50%_10%]"
              />
            </div>
            <div className="flex-1">
              <div className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-[11px] font-semibold tracking-[0.2em] uppercase">
                Nadia's Perspective
              </div>
              <div className="text-[9px] text-[#A69272] tracking-widest uppercase font-mono">Her Story</div>
            </div>
            <span className="text-5xl text-[#f1c65a]/8 font-serif leading-none select-none opacity-20">&ldquo;</span>
          </div>
          <div className="space-y-4 text-[#DACFB8] text-sm md:text-[15px] leading-relaxed font-light">
            {chapter.bride.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {/* Groom's Perspective */}
        <div className="p-7 md:p-10 bg-[#0d1c15] relative">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#f1c65a]/50 shrink-0">
              <img
                src={weddingDetails.couple.groomImage}
                alt="Graham"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1">
              <div className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-[11px] font-semibold tracking-[0.2em] uppercase">
                Graham's Perspective
              </div>
              <div className="text-[9px] text-[#A69272] tracking-widest uppercase font-mono">His Story</div>
            </div>
            <span className="text-5xl text-[#f1c65a]/8 font-serif leading-none select-none opacity-20">&ldquo;</span>
          </div>
          <div className="space-y-4 text-[#DACFB8] text-sm md:text-[15px] leading-relaxed font-light">
            {chapter.groom.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export const Story: React.FC = () => {
  return (
    <section id="story" className="py-24 bg-[#0a1713] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(241,198,90,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
            OUR STORY
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em] mb-4">
            How We Found Each Other
          </h2>
          <p className="font-heading italic text-base md:text-xl text-[#DACFB8] font-light max-w-xl mx-auto mb-6">
            Two people. Two perspectives. One God-written love story.
          </p>
          <div className="w-28 h-[1px] bg-gradient-to-r from-transparent via-[#f1c65a] via-[#e2b324] to-transparent mx-auto" />
        </div>

        {/* Split Portrait Banner */}
        <div className="relative mb-16 border border-[#f1c65a]/20 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-2 h-56 md:h-72">
            <div className="relative overflow-hidden">
              <img
                src={weddingDetails.couple.brideImage}
                alt="Nadia"
                className="w-full h-full object-cover object-[50%_10%] brightness-75 hover:brightness-90 transition-all duration-700 scale-105 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1713]/70" />
              <div className="absolute bottom-5 left-5">
                <div className="font-script text-2xl md:text-3xl bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent drop-shadow-md">
                  Nadia
                </div>
                <div className="text-[9px] tracking-[0.3em] uppercase text-[#A69272] font-mono">The Bride</div>
              </div>
            </div>
            <div className="relative overflow-hidden">
              <img
                src={weddingDetails.couple.groomImage}
                alt="Graham"
                className="w-full h-full object-cover object-top brightness-75 hover:brightness-90 transition-all duration-700 scale-105 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0a1713]/70" />
              <div className="absolute bottom-5 right-5 text-right">
                <div className="font-script text-2xl md:text-3xl bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent drop-shadow-md">
                  Graham
                </div>
                <div className="text-[9px] tracking-[0.3em] uppercase text-[#A69272] font-mono">The Groom</div>
              </div>
            </div>
          </div>
          {/* Center divider with gold heart node */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#f1c65a]/80 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0a1713] border border-[#f1c65a]/60 flex items-center justify-center shadow-lg shadow-[#f1c65a]/20">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#f1c65a] to-[#e2b324]" />
          </div>
        </div>

        {/* Chapter Blocks */}
        <div className="space-y-14">
          {CHAPTERS.map((chapter, idx) => (
            <ChapterBlock key={idx} chapter={chapter} index={idx} />
          ))}
        </div>

        {/* Closing Signature */}
        <div className="text-center mt-20 pt-10 border-t border-[#f1c65a]/20">
          <p className="font-heading italic text-[#DACFB8] text-base md:text-lg font-light max-w-lg mx-auto mb-6 leading-relaxed">
            &ldquo;From accountability partners at PCC to forever partners in life &mdash; every step was guided by God.&rdquo;
          </p>
          <div className="font-script text-4xl md:text-5xl bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent mb-3">
            Nadia &amp; Graham
          </div>
          <div className="text-[10px] tracking-[0.4em] uppercase text-[#A69272] font-mono">
            PCC, December 2021 &mdash; Accra, October 10, 2026
          </div>
        </div>

      </div>
    </section>
  );
};
