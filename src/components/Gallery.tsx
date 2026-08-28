import React, { useState, useEffect, useRef, useCallback } from 'react';
import { weddingDetails } from '../mocks/weddingData';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

/* ─── animation hook: scroll reveal + stagger ─── */
function useGalleryReveal(count: number) {
  const [visible, setVisible] = useState<boolean[]>(Array(count).fill(false));
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(Array(count).fill(true));
      return;
    }

    const observers: IntersectionObserver[] = [];

    refs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // stagger: 100ms per item
            setTimeout(() => {
              setVisible(prev => {
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            }, idx * 110);
            obs.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [count]);

  return { visible, refs };
}

/* ─── parallax hook ─── */
function useParallax() {
  const elRefs = useRef<(HTMLImageElement | null)[]>([]);
  const frameRef = useRef<number>(0);
  const prefersReduced = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (prefersReduced.current) return;

    const onScroll = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        elRefs.current.forEach(img => {
          if (!img) return;
          const rect = img.closest('[data-gallery-item]')?.getBoundingClientRect();
          if (!rect) return;
          const windowH = window.innerHeight;
          const center = rect.top + rect.height / 2 - windowH / 2;
          // max ±14px shift
          const shift = Math.max(-14, Math.min(14, (center / windowH) * 28));
          img.style.transform = `scale(1) translateY(${shift}px)`;
        });
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return elRefs;
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
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        (selectedImageIndex - 1 + weddingDetails.gallery.images.length) %
          weddingDetails.gallery.images.length
      );
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        (selectedImageIndex + 1) % weddingDetails.gallery.images.length
      );
    }
  };

  const count = weddingDetails.gallery.images.length;
  const { visible, refs } = useGalleryReveal(count);
  const imgRefs = useParallax();

  // trigger gold sweep once per image when it becomes visible
  useEffect(() => {
    visible.forEach((isVisible, idx) => {
      if (isVisible && !swept[idx]) {
        // small delay so sweep starts after the reveal settles
        setTimeout(() => {
          setSwept(prev => {
            const next = [...prev];
            next[idx] = true;
            return next;
          });
        }, 600);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const setRef = useCallback(
    (el: HTMLDivElement | null, idx: number) => {
      refs.current[idx] = el;
    },
    [refs]
  );

  const setImgRef = useCallback(
    (el: HTMLImageElement | null, idx: number) => {
      imgRefs.current[idx] = el;
    },
    [imgRefs]
  );

  return (
    <section id="gallery" className="py-24 bg-[#0B0907] relative overflow-hidden">
      {/* ── gold sweep keyframe ── */}
      <style>{`
        @keyframes goldSweep {
          0%   { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
          20%  { opacity: 0.55; }
          80%  { opacity: 0.35; }
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
            rgba(194,152,69,0.18) 50%,
            rgba(210,172,94,0.10) 58%,
            transparent 70%
          );
          animation: goldSweep 1.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
          z-index: 2;
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-sweep::after { animation: none; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header — untouched */}
        <div className="text-center mb-16">
          <span className="text-[#C29845] text-xs font-medium tracking-[0.3em] uppercase block mb-3">
            MEMORIES
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em] mb-4">
            Our Gallery
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C29845] to-transparent mx-auto" />
        </div>

        {/* Gallery Grid — same structure, same classes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddingDetails.gallery.images.map((img, idx) => (
            <div
              key={idx}
              data-gallery-item
              ref={el => setRef(el, idx)}
              onClick={() => openLightbox(idx)}
              className={`group relative cursor-pointer overflow-hidden border border-[#C29845]/20 bg-[#141110] aspect-[4/5] shadow-xl transition-all duration-500 hover:border-[#C29845]/60 ${
                swept[idx] ? 'gallery-sweep' : ''
              }`}
              style={{
                /* scroll reveal */
                opacity: visible[idx] ? 1 : 0,
                transform: visible[idx]
                  ? 'translateY(0) scale(1)'
                  : 'translateY(18px) scale(1.07)',
                filter: visible[idx] ? 'blur(0px)' : 'blur(3px)',
                transition: visible[idx]
                  ? 'opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.7s ease-out'
                  : 'none',
              }}
            >
              <img
                ref={el => setImgRef(el, idx)}
                src={img.url}
                alt={img.title}
                /* existing classes preserved exactly */
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05] filter brightness-90 group-hover:brightness-100"
                style={{ willChange: 'transform' }}
              />

              {/* Dark Gradient Overlay — untouched */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[#C29845] text-[10px] tracking-[0.25em] uppercase block font-semibold mb-1">
                  {img.category}
                </span>
                <h4 className="font-heading text-xl text-[#FBF7EF] font-normal mb-2">
                  {img.title}
                </h4>
                <div className="flex items-center text-[#D2AC5E] text-xs tracking-wider">
                  <Maximize2 size={14} className="mr-1.5" /> Click to view
                </div>
              </div>

              {/* Corner Frame Highlights — untouched */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#C29845]/0 group-hover:border-[#C29845] transition-all duration-300" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#C29845]/0 group-hover:border-[#C29845] transition-all duration-300" />
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal — untouched */}
      {selectedImageIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-[#BFAC90] hover:text-[#C29845] p-2 transition-colors z-50 focus:outline-none"
            aria-label="Close Lightbox"
          >
            <X size={32} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-[#BFAC90] hover:text-[#C29845] p-3 rounded-full bg-black/40 hover:bg-black/80 border border-[#C29845]/30 transition-all z-50"
            aria-label="Previous Image"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-[#BFAC90] hover:text-[#C29845] p-3 rounded-full bg-black/40 hover:bg-black/80 border border-[#C29845]/30 transition-all z-50"
            aria-label="Next Image"
          >
            <ChevronRight size={28} />
          </button>

          <div
            onClick={e => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh] relative flex flex-col items-center border border-[#C29845]/40 bg-[#141110] p-2"
          >
            <img
              src={weddingDetails.gallery.images[selectedImageIndex].url}
              alt={weddingDetails.gallery.images[selectedImageIndex].title}
              className="max-w-full max-h-[75vh] object-contain"
            />
            <div className="py-4 px-6 text-center w-full bg-[#0B0907]">
              <span className="text-[#C29845] text-xs tracking-[0.25em] uppercase font-medium block">
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
