import React, { useState, useEffect, useRef, useCallback } from 'react';
import { weddingDetails } from '../mocks/weddingData';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

/* ─── Gallery-Specific Staggered Scroll Reveal Hook ─── */
function useGalleryReveal(count: number) {
  const [visible, setVisible] = useState<boolean[]>(Array(count).fill(false));
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setVisible(Array(count).fill(true)); return; }

    const observers: IntersectionObserver[] = [];
    refs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // 150ms stagger per image up to 6 in a row
            setTimeout(() => {
              setVisible(prev => { const n = [...prev]; n[idx] = true; return n; });
            }, Math.min(idx % 6, 6) * 150);
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [count]);

  return { visible, refs };
}

export const Gallery: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [swept, setSwept] = useState<boolean[]>(
    Array(weddingDetails.gallery.images.length).fill(false)
  );

  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null)
      setSelectedImageIndex((selectedImageIndex - 1 + weddingDetails.gallery.images.length) % weddingDetails.gallery.images.length);
  };
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null)
      setSelectedImageIndex((selectedImageIndex + 1) % weddingDetails.gallery.images.length);
  };

  const count = weddingDetails.gallery.images.length;
  const { visible, refs } = useGalleryReveal(count);

  // Trigger Gold Sweep shimmer once per image after initial reveal
  useEffect(() => {
    visible.forEach((isVisible, idx) => {
      if (isVisible && !swept[idx]) {
        setTimeout(() => {
          setSwept(prev => { const n = [...prev]; n[idx] = true; return n; });
        }, 600);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const setRef = useCallback((el: HTMLDivElement | null, idx: number) => {
    refs.current[idx] = el;
  }, [refs]);

  // Return specific Ken Burns animation class based on image index
  const getKenBurnsClass = (idx: number) => {
    const classes = [
      'animate-kb-zoom-in',
      'animate-kb-pan-left',
      'animate-kb-zoom-out',
      'animate-kb-pan-right',
    ];
    return classes[idx % classes.length];
  };

  return (
    <section id="gallery" className="py-24 bg-[#0a1713] relative overflow-hidden">
      {/* Gallery Fade-in Reveal + Slow Ken Burns Movement + Gold Sweep CSS */}
      <style>{`
        /* Continuous Slow Ken Burns Photo Animations (6-8.5s loops) */
        @keyframes kbZoomIn {
          0%   { transform: scale(1.00) translate(0%, 0%); }
          50%  { transform: scale(1.08) translate(-1.2%, -1%); }
          100% { transform: scale(1.00) translate(0%, 0%); }
        }
        @keyframes kbPanLeft {
          0%   { transform: scale(1.07) translate(1.5%, 0.5%); }
          50%  { transform: scale(1.02) translate(-1.5%, -1%); }
          100% { transform: scale(1.07) translate(1.5%, 0.5%); }
        }
        @keyframes kbZoomOut {
          0%   { transform: scale(1.09) translate(-0.5%, 1.2%); }
          50%  { transform: scale(1.01) translate(1%, -0.5%); }
          100% { transform: scale(1.09) translate(-0.5%, 1.2%); }
        }
        @keyframes kbPanRight {
          0%   { transform: scale(1.03) translate(-1.5%, -0.5%); }
          50%  { transform: scale(1.08) translate(1.2%, 1%); }
          100% { transform: scale(1.03) translate(-1.5%, -0.5%); }
        }

        .animate-kb-zoom-in {
          animation: kbZoomIn 7.5s ease-in-out infinite;
        }
        .animate-kb-pan-left {
          animation: kbPanLeft 8.5s ease-in-out infinite;
        }
        .animate-kb-zoom-out {
          animation: kbZoomOut 7.0s ease-in-out infinite;
        }
        .animate-kb-pan-right {
          animation: kbPanRight 8.0s ease-in-out infinite;
        }

        /* Secondary Gold Light Sweep Shimmer */
        @keyframes goldSweep {
          0%   { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
          25%  { opacity: 0.45; }
          75%  { opacity: 0.25; }
          100% { transform: translateX(220%) skewX(-15deg); opacity: 0; }
        }
        .gallery-sweep::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(241,198,90,0.22) 50%,
            rgba(241,198,90,0.12) 58%,
            transparent 70%
          );
          animation: goldSweep 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          z-index: 2;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-kb-zoom-in, .animate-kb-pan-left,
          .animate-kb-zoom-out, .animate-kb-pan-right,
          .gallery-sweep::after {
            animation: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
            MEMORIES
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em]">
            Our Gallery
          </h2>
        </div>

        {/* Gallery Grid — Staggered Fade-In Reveal + Continuous Ken Burns Movement */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddingDetails.gallery.images.map((img, idx) => (
            <div
              key={idx}
              ref={el => setRef(el, idx)}
              onClick={() => openLightbox(idx)}
              className={`group relative cursor-pointer overflow-hidden border border-[#f1c65a]/20 bg-[#11221c] aspect-[4/5] shadow-xl transition-all duration-500 hover:border-[#f1c65a]/60 ${
                swept[idx] ? 'gallery-sweep' : ''
              }`}
              style={{
                opacity: visible[idx] ? 1 : 0,
                transform: visible[idx] ? 'translateY(0)' : 'translateY(15px)',
                transition: visible[idx]
                  ? 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1), transform 1.0s cubic-bezier(0.16, 1, 0.3, 1)'
                  : 'none',
                willChange: visible[idx] ? 'auto' : 'opacity, transform',
              }}
            >
              {/* Actual Photograph with Staggered Continuous Ken Burns Animation */}
              <img
                src={img.url}
                alt={img.title}
                loading="lazy"
                className={`w-full h-full object-cover filter brightness-90 group-hover:brightness-100 transition-all duration-700 ${getKenBurnsClass(
                  idx
                )}`}
                style={{
                  animationDelay: `${(idx * 0.6) % 2.4}s`,
                }}
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                <span className="text-[#f1c65a] text-[10px] tracking-[0.25em] uppercase block font-semibold mb-1">
                  {img.category}
                </span>
                <h4 className="font-heading text-xl text-[#FBF7EF] font-normal mb-2">{img.title}</h4>
                <div className="flex items-center text-[#f1c65a] text-xs tracking-wider">
                  <Maximize2 size={14} className="mr-1.5" /> Click to view
                </div>
              </div>

              {/* Corner Frame Highlights */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#f1c65a]/0 group-hover:border-[#f1c65a] transition-all duration-300 z-10" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#f1c65a]/0 group-hover:border-[#f1c65a] transition-all duration-300 z-10" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div onClick={closeLightbox} className="fixed inset-0 z-50 bg-[#060f0c]/98 flex items-center justify-center p-4">
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-[#BFAC90] hover:text-[#f1c65a] p-2 transition-colors z-50 focus:outline-none" aria-label="Close Lightbox">
            <X size={32} />
          </button>
          <button onClick={prevImage} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-[#BFAC90] hover:text-[#f1c65a] p-3 rounded-full bg-[#0a1713] hover:bg-[#11221c] border border-[#f1c65a]/40 transition-all z-50 shadow-xl" aria-label="Previous Image">
            <ChevronLeft size={28} />
          </button>
          <button onClick={nextImage} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-[#BFAC90] hover:text-[#f1c65a] p-3 rounded-full bg-[#0a1713] hover:bg-[#11221c] border border-[#f1c65a]/40 transition-all z-50 shadow-xl" aria-label="Next Image">
            <ChevronRight size={28} />
          </button>
          <div onClick={e => e.stopPropagation()} className="max-w-4xl max-h-[85vh] relative flex flex-col items-center border border-[#f1c65a]/40 bg-[#11221c] p-2">
            <img src={weddingDetails.gallery.images[selectedImageIndex].url} alt={weddingDetails.gallery.images[selectedImageIndex].title} className="max-w-full max-h-[75vh] object-contain" />
            <div className="py-4 px-6 text-center w-full bg-[#0a1713]">
              <span className="text-[#f1c65a] text-xs tracking-[0.25em] uppercase font-medium block">
                {weddingDetails.gallery.images[selectedImageIndex].category}
              </span>
              <h3 className="font-heading text-lg md:text-xl text-[#FBF7EF] mt-1">
                {weddingDetails.gallery.images[selectedImageIndex].title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
