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
  // 1: G appears -> 2: & appears -> 3: A appears -> 4: delicate heart draws -> 5: heartbeat -> 6: atmosphere -> 7: invitation-ready
  const [animStage, setAnimStage] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);

  // 1. MASTER TIMELINE FOR THE MONOGRAM G & A ANIMATION
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setAnimStage(7);
      return;
    }

    // Stage 2: & appears (1.0s)
    const t2 = setTimeout(() => setAnimStage(2), 1000);

    // Stage 3: A appears (2.0s)
    const t3 = setTimeout(() => setAnimStage(3), 2000);

    // Stage 4: Delicate Heart Ring Draws (3.2s)
    const t4 = setTimeout(() => setAnimStage(4), 3200);

    // Stage 5: Heartbeat Pulse (4.8s)
    const t5 = setTimeout(() => setAnimStage(5), 4800);

    // Stage 6: Golden Atmosphere & Glow (6.0s)
    const t6 = setTimeout(() => setAnimStage(6), 6000);

    // Stage 7: Invitation Message Reveal (6.8s)
    const t7 = setTimeout(() => setAnimStage(7), 6800);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      document.body.style.overflow = '';
    };
  }, []);

  // 2. SPARSE ATMOSPHERIC CANDLELIGHT DUST PARTICLES
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

    const dustCount = window.innerWidth < 768 ? 10 : 20;

    const dust: DustParticle[] = Array.from({ length: dustCount }, () => ({
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      r: rand(0.6, 1.5),
      vx: rand(-0.03, 0.03),
      vy: rand(-0.07, -0.02),
      alpha: rand(0.04, 0.16),
      dir: Math.random() > 0.5 ? 1 : -1,
      speed: rand(0.001, 0.0025),
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
        if (p.alpha > 0.16 || p.alpha < 0.03) p.dir *= -1;
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

  // NATIVE ONCLICK USER GESTURE HANDLER: Starts audio SYNCHRONOUSLY inside gesture loop
  const handleSplashTap = () => {
    if (isProcessingRef.current || isTransitioning || isComplete) return;
    isProcessingRef.current = true;

    // Execute audio.play() SYNCHRONOUSLY on line 1 inside native onClick gesture call stack
    globalAudio.playDirect();

    // Trigger Golden Portal Exit Expansion
    setIsTransitioning(true);

    setTimeout(() => {
      setIsComplete(true);
      document.body.style.overflow = '';
    }, 1200);
  };

  if (isComplete) return null;

  return (
    <div
      onClick={handleSplashTap}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#050c08] overflow-hidden select-none cursor-pointer transition-opacity duration-1000 ${
        isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <style>{`
        /* Monogram Letter G Fade In from Left */
        @keyframes monogramGFadeIn {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Monogram Symbol & Fade In */
        @keyframes monogramAmpFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Monogram Letter A Fade In from Right */
        @keyframes monogramAFadeIn {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Delicate Heart Line Drawing */
        @keyframes heartFormDraw {
          0% {
            stroke-dashoffset: 1000;
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1.0;
          }
        }

        /* Subtle Heartbeat Pulse */
        @keyframes heartDoublePulse {
          0% {
            transform: scale(1.00);
            filter: drop-shadow(0 0 8px rgba(245,230,190,0.4));
          }
          18% {
            transform: scale(1.06);
            filter: drop-shadow(0 0 20px rgba(245,230,190,0.8));
          }
          34% {
            transform: scale(0.98);
            filter: drop-shadow(0 0 10px rgba(245,230,190,0.45));
          }
          48% {
            transform: scale(1.03);
            filter: drop-shadow(0 0 16px rgba(245,230,190,0.7));
          }
          65% {
            transform: scale(1.00);
            filter: drop-shadow(0 0 8px rgba(245,230,190,0.4));
          }
          100% {
            transform: scale(1.00);
            filter: drop-shadow(0 0 8px rgba(245,230,190,0.4));
          }
        }

        /* Atmosphere Glow */
        @keyframes atmosphereGlow {
          0% {
            opacity: 0.15;
            transform: scale(0.92);
          }
          50% {
            opacity: 0.40;
            transform: scale(1.08);
          }
          100% {
            opacity: 0.15;
            transform: scale(0.92);
          }
        }

        /* Breathing "Tap to enter" Callout */
        @keyframes tapBreathFloat {
          0% {
            transform: translateY(0px);
            opacity: 0.70;
          }
          50% {
            transform: translateY(-3px);
            opacity: 1.0;
          }
          100% {
            transform: translateY(0px);
            opacity: 0.70;
          }
        }

        /* Transition Expanding Light Portal */
        @keyframes portalExpand {
          0% {
            transform: scale(0.2);
            opacity: 0.8;
          }
          50% {
            transform: scale(8.0);
            opacity: 0.9;
          }
          100% {
            transform: scale(45.0);
            opacity: 0;
          }
        }

        .animate-monogram-g {
          animation: monogramGFadeIn 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .animate-monogram-amp {
          animation: monogramAmpFadeIn 1.0s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .animate-monogram-a {
          animation: monogramAFadeIn 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .animate-heart-form {
          stroke-dasharray: 1000;
          animation: heartFormDraw 2.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .animate-heartbeat {
          animation: heartDoublePulse 2.8s ease-in-out infinite;
        }

        .animate-atmosphere {
          animation: atmosphereGlow 4s ease-in-out infinite;
        }

        .animate-tap-float {
          animation: tapBreathFloat 2.6s ease-in-out infinite;
        }

        .animate-portal {
          animation: portalExpand 1.3s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-monogram-g, .animate-monogram-amp, .animate-monogram-a, .animate-heart-form, .animate-heartbeat, .animate-tap-float {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* Sparse Atmospheric Dust Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Stage 6+: Subtle Warm Golden Candlelight Glow */}
      {animStage >= 6 && (
        <div className="absolute inset-0 z-[2] pointer-events-none flex items-center justify-center">
          <div className="animate-atmosphere w-80 h-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,230,190,0.18)_0%,rgba(241,198,90,0.03)_50%,transparent_75%)] filter blur-3xl" />
        </div>
      )}

      {/* TRANSITIONING: Golden Light Portal Expansion */}
      {isTransitioning && (
        <div className="absolute inset-0 z-[30] pointer-events-none flex items-center justify-center">
          <div className="animate-portal w-32 h-32 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,230,190,0.95)_0%,rgba(241,198,90,0.4)_40%,transparent_75%)] filter blur-xl" />
        </div>
      )}

      {/* MAIN ANIMATION CONTAINER (MONOGRAM G & A + INVITATION) */}
      <div className="relative z-[20] flex flex-col items-center justify-center text-center px-4 w-full max-w-xl pointer-events-none">
        
        {/* ANIMATED MONOGRAM G & A CANVAS */}
        <div
          className={`relative flex items-center justify-center transition-all duration-700 ${
            animStage >= 5 ? 'animate-heartbeat' : ''
          }`}
        >
          <svg
            width="320"
            height="240"
            viewBox="0 0 320 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-48 h-36 sm:w-60 sm:h-44 text-[#F5E6BE] filter drop-shadow-[0_0_10px_rgba(245,230,190,0.45)]"
          >
            <defs>
              <linearGradient id="monogramGoldGrad" x1="0" y1="0" x2="320" y2="240" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFF9EB" stopOpacity="0.98" />
                <stop offset="45%" stopColor="#F5E6BE" stopOpacity="0.92" />
                <stop offset="80%" stopColor="#E2C875" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#C49E35" stopOpacity="0.82" />
              </linearGradient>
              <filter id="silkGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Stage 4+: Thin Delicate Heart Outline Drawing around Monogram */}
            {animStage >= 4 && (
              <path
                d="M 160,205 C 160,205 75,145 75,95 C 75,55 115,48 142,75 C 153,85 160,94 160,94 C 160,94 167,85 178,75 C 205,48 245,55 245,95 C 245,145 160,205 160,205 Z"
                stroke="url(#monogramGoldGrad)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter="url(#silkGlow)"
                className={animStage === 4 ? 'animate-heart-form' : ''}
              />
            )}

            {/* Monogram Text (G & A) */}
            <g className="font-serif select-none">
              {/* Letter G */}
              <text
                x="105"
                y="132"
                fontSize="54"
                fontFamily="serif"
                fontWeight="300"
                fill="url(#monogramGoldGrad)"
                textAnchor="middle"
                className={animStage >= 1 ? 'animate-monogram-g' : 'opacity-0'}
              >
                G
              </text>

              {/* Symbol & */}
              <text
                x="160"
                y="126"
                fontSize="32"
                fontFamily="serif"
                fontStyle="italic"
                fontWeight="300"
                fill="#FFF7E3"
                textAnchor="middle"
                className={animStage >= 2 ? 'animate-monogram-amp' : 'opacity-0'}
              >
                &
              </text>

              {/* Letter A */}
              <text
                x="215"
                y="132"
                fontSize="54"
                fontFamily="serif"
                fontWeight="300"
                fill="url(#monogramGoldGrad)"
                textAnchor="middle"
                className={animStage >= 3 ? 'animate-monogram-a' : 'opacity-0'}
              >
                A
              </text>
            </g>
          </svg>
        </div>

        {/* INVITATION MESSAGE REVEAL ("Come, let us begin." + "Tap to enter") */}
        <div
          className={`mt-4 flex flex-col items-center gap-3 transition-all duration-1000 ${
            animStage >= 7 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-[0.2em] text-[#F5E6BE] font-light drop-shadow-[0_0_15px_rgba(245,230,190,0.35)]">
            Come, let us begin.
          </h2>

          <div className="animate-tap-float mt-2 flex flex-col items-center gap-1">
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.35em] text-[#F5E6BE]/70 uppercase font-light">
              Tap to enter
            </span>
            <span className="text-[10px] text-[#F5E6BE]/50 tracking-widest">
              ♡
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
