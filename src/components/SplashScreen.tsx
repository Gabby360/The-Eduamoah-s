import React, { useEffect, useState, useRef } from 'react';
import { globalAudio } from '../utils/audioManager';

/* ─────────────────────────────────────────────
   ATMOSPHERIC CHAMPAGNE DUST PARTICLES
───────────────────────────────────────────── */
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

interface DustParticle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  dir: number;
  speed: number;
}

export const SplashScreen: React.FC = () => {
  // Sequence Stage:
  // 1: initial -> 2: golden-glow -> 3: merging-lights -> 4: romantic-symbol -> 5: invitation-ready -> 6: transitioning -> complete
  const [animStage, setAnimStage] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const hasTappedRef = useRef<boolean>(false);

  // 1. TIMELINE CONTROLLER FOR THE 6-STAGE CINEMATIC ANIMATION
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setAnimStage(5); // Jump straight to invitation ready
    }

    // Stage 2: Golden Light Candlelight Glow (1.0s)
    const t2 = setTimeout(() => setAnimStage(2), 1000);

    // Stage 3: Two Lights Merging from Left & Right (2.5s)
    const t3 = setTimeout(() => setAnimStage(3), 2500);

    // Stage 4: Romantic Symbol Reveal (4.6s)
    const t4 = setTimeout(() => setAnimStage(4), 4600);

    // Stage 5: Invitation Message ("Come, let us begin." + "Tap to enter") (6.2s)
    const t5 = setTimeout(() => setAnimStage(5), 6200);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      document.body.style.overflow = '';
    };
  }, []);

  // 2. SPARSE ATMOSPHERIC GOLD DUST CANVAS
  useEffect(() => {
    if (isComplete) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const dustCount = window.innerWidth < 768 ? 12 : 22;

    const dust: DustParticle[] = Array.from({ length: dustCount }, () => ({
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      r: rand(0.6, 1.6),
      vx: rand(-0.04, 0.04),
      vy: rand(-0.08, -0.02),
      alpha: rand(0.04, 0.18),
      dir: Math.random() > 0.5 ? 1 : -1,
      speed: rand(0.001, 0.003),
    }));

    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30;

    const tick = (now: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      dust.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.dir * p.speed;
        if (p.alpha > 0.18 || p.alpha < 0.03) p.dir *= -1;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) {
          p.y = H;
          p.x = rand(0, W);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 230, 190, ${p.alpha.toFixed(3)})`;
        ctx.fill();
      });
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isComplete]);

  // 3. INTENTIONAL USER TAP / TOUCH HANDLER
  // Synchronously triggers audio.play() and begins the cinematic dissolution
  const handleSplashTap = () => {
    if (hasTappedRef.current || isComplete) return;
    hasTappedRef.current = true;

    // A. Start Wedding Music IMMEDIATELY inside this exact touch/pointer event context
    globalAudio.play();

    // B. Trigger cinematic golden light portal expansion and gentle dissolution
    setIsTransitioning(true);
    document.body.style.overflow = '';

    // Complete transition after 1.3 seconds
    setTimeout(() => {
      setIsComplete(true);
    }, 1300);
  };

  if (isComplete) return null;

  return (
    <div
      onClick={handleSplashTap}
      onTouchStart={handleSplashTap}
      className={`fixed inset-0 z-[100] bg-[#060e0a] flex items-center justify-center overflow-hidden select-none cursor-pointer transition-opacity duration-1000 ${
        isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      aria-label="Tap to enter wedding celebration"
    >
      <style>{`
        /* Candlelight Soft Glow Pulsing */
        @keyframes softCandleGlow {
          0% { opacity: 0.25; transform: scale(0.95); }
          50% { opacity: 0.55; transform: scale(1.10); }
          100% { opacity: 0.25; transform: scale(0.95); }
        }

        /* Two Lights Moving Inward from Left and Right */
        @keyframes moveLightLeft {
          0% { transform: translate(-38vw, 0); opacity: 0; }
          20% { opacity: 0.9; }
          100% { transform: translate(0, 0); opacity: 1; }
        }

        @keyframes moveLightRight {
          0% { transform: translate(38vw, 0); opacity: 0; }
          20% { opacity: 0.9; }
          100% { transform: translate(0, 0); opacity: 1; }
        }

        /* Golden Meeting Ripple */
        @keyframes goldenPulseRipple {
          0% { transform: scale(0.1); opacity: 0.9; }
          100% { transform: scale(3.5); opacity: 0; }
        }

        /* Symbol Quiet Heartbeat */
        @keyframes symbolGentleBreath {
          0% { transform: scale(0.96); filter: drop-shadow(0 0 8px rgba(245,230,190,0.4)); }
          50% { transform: scale(1.06); filter: drop-shadow(0 0 20px rgba(245,230,190,0.85)); }
          100% { transform: scale(0.96); filter: drop-shadow(0 0 8px rgba(245,230,190,0.4)); }
        }

        /* Tap to Enter Subtle Breathing & Floating */
        @keyframes tapFloatBreath {
          0% { transform: translateY(0px); opacity: 0.75; }
          50% { transform: translateY(-4px); opacity: 1.0; }
          100% { transform: translateY(0px); opacity: 0.75; }
        }

        /* Transition Expanding Light Portal */
        @keyframes portalExpand {
          0% { transform: scale(0.2); opacity: 0.8; }
          50% { transform: scale(8.0); opacity: 0.9; }
          100% { transform: scale(45.0); opacity: 0; }
        }

        .animate-candle-glow {
          animation: softCandleGlow 4s ease-in-out infinite;
        }

        .animate-light-left {
          animation: moveLightLeft 2.1s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .animate-light-right {
          animation: moveLightRight 2.1s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .animate-golden-ripple {
          animation: goldenPulseRipple 1.4s ease-out forwards;
        }

        .animate-symbol-breath {
          animation: symbolGentleBreath 3.2s ease-in-out infinite;
        }

        .animate-tap-breath {
          animation: tapFloatBreath 2.6s ease-in-out infinite;
        }

        .animate-portal {
          animation: portalExpand 1.3s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-candle-glow, .animate-symbol-breath, .animate-tap-breath {
            animation: none !important;
          }
        }
      `}</style>

      {/* Atmospheric Champagne Dust Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* STAGE 2+: Soft Candlelight Golden Radial Glow */}
      {animStage >= 2 && (
        <div className="absolute inset-0 z-[2] pointer-events-none flex items-center justify-center">
          <div className="animate-candle-glow w-96 h-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,230,190,0.18)_0%,rgba(241,198,90,0.04)_50%,transparent_75%)] filter blur-3xl" />
        </div>
      )}

      {/* STAGE 3: Two Lights Merging from Opposite Sides */}
      {animStage === 3 && (
        <div className="absolute inset-0 z-[15] pointer-events-none flex items-center justify-center">
          {/* Left Light Point */}
          <div className="animate-light-left relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#F5E6BE] shadow-[0_0_15px_rgba(245,230,190,0.9)]" />
            <div className="absolute right-0 w-24 h-[1.5px] bg-gradient-to-l from-[#F5E6BE] to-transparent opacity-60" />
          </div>

          {/* Right Light Point */}
          <div className="animate-light-right relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#F5E6BE] shadow-[0_0_15px_rgba(245,230,190,0.9)]" />
            <div className="absolute left-0 w-24 h-[1.5px] bg-gradient-to-r from-[#F5E6BE] to-transparent opacity-60" />
          </div>

          {/* Meeting Golden Pulse Ripple */}
          <div className="absolute w-12 h-12 rounded-full border border-[#F5E6BE] animate-golden-ripple" />
        </div>
      )}

      {/* TRANSITIONING: Golden Light Portal Expansion */}
      {isTransitioning && (
        <div className="absolute inset-0 z-[30] pointer-events-none flex items-center justify-center">
          <div className="animate-portal w-32 h-32 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,230,190,0.95)_0%,rgba(241,198,90,0.4)_40%,transparent_75%)] filter blur-xl" />
        </div>
      )}

      {/* STAGE 4 & 5: Minimal Intertwined Golden Rings Symbol & Invitation Message */}
      {animStage >= 4 && (
        <div className="relative z-[20] flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          {/* Fine-Line Intertwined Golden Rings Symbol */}
          <div className="animate-symbol-breath flex items-center justify-center mb-6">
            <svg
              width="64"
              height="40"
              viewBox="0 0 64 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 h-9 sm:w-16 sm:h-10 text-[#F5E6BE] drop-shadow-[0_0_14px_rgba(245,230,190,0.7)]"
            >
              <defs>
                <linearGradient id="champagneGrad" x1="0" y1="0" x2="64" y2="40">
                  <stop offset="0%" stopColor="#FFF7E3" />
                  <stop offset="50%" stopColor="#F5E6BE" />
                  <stop offset="100%" stopColor="#E2C875" />
                </linearGradient>
              </defs>
              {/* Left Fine-Line Interlocking Ring */}
              <ellipse
                cx="24"
                cy="20"
                rx="16"
                ry="15"
                fill="none"
                stroke="url(#champagneGrad)"
                strokeWidth="1.5"
                strokeOpacity="0.9"
              />
              {/* Right Fine-Line Interlocking Ring */}
              <ellipse
                cx="40"
                cy="20"
                rx="16"
                ry="15"
                fill="none"
                stroke="url(#champagneGrad)"
                strokeWidth="1.5"
                strokeOpacity="0.9"
              />
              {/* Central Luminous Intertwined Intersection Accent */}
              <path
                d="M 32,10 Q 35,20 32,30 Q 29,20 32,10 Z"
                fill="#FFF9E6"
                fillOpacity="0.4"
              />
            </svg>
          </div>

          {/* STAGE 5: Invitation Message ("Come, let us begin." + "Tap to enter") */}
          <div
            className={`flex flex-col items-center gap-3 transition-all duration-1000 ${
              animStage >= 5 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-[0.2em] text-[#F5E6BE] font-light drop-shadow-[0_0_15px_rgba(245,230,190,0.35)]">
              Come, let us begin.
            </h2>

            <div className="animate-tap-breath mt-3 flex flex-col items-center gap-1">
              <span className="text-[11px] sm:text-xs font-mono tracking-[0.35em] text-[#F5E6BE]/70 uppercase font-light">
                Tap to enter
              </span>
              <span className="text-[10px] text-[#F5E6BE]/50 tracking-widest">
                ♡
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
