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
  // 1: ribbons-enter -> 2: approach -> 3: intertwine -> 4: heart-forming -> 5: heartbeat -> 6: atmosphere -> 7: invitation-ready
  const [animStage, setAnimStage] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);

  // 1. MASTER TIMELINE FOR THE 8-SCENE CINEMATIC ANIMATION
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setAnimStage(7);
      return;
    }

    // Scene 2: Approach (1.4s)
    const t2 = setTimeout(() => setAnimStage(2), 1400);

    // Scene 3: Meeting & Intertwining (3.0s)
    const t3 = setTimeout(() => setAnimStage(3), 3000);

    // Scene 4: Forming the Heart (4.6s)
    const t4 = setTimeout(() => setAnimStage(4), 4600);

    // Scene 5: Heartbeat Pulse (6.2s)
    const t5 = setTimeout(() => setAnimStage(5), 6200);

    // Scene 6: Golden Atmosphere & Dust (7.6s)
    const t6 = setTimeout(() => setAnimStage(6), 7600);

    // Scene 7: Invitation Message Reveal (8.4s)
    const t7 = setTimeout(() => setAnimStage(7), 8400);

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

  // 3. INTENTIONAL USER TAP / CLICK HANDLER (Preserving working mobile audio!)
  const handleSplashTap = async (e: React.MouseEvent) => {
    if (isProcessingRef.current || isComplete) return;
    isProcessingRef.current = true;

    // STEP 1: Execute playDirect() synchronously inside user click gesture event call stack
    const playSuccess = await globalAudio.playDirect();
    console.log('[SPLASH TAP RESULT]', playSuccess ? 'SUCCESS' : 'FAILED');

    // STEP 2: Start cinematic exit animation
    setIsTransitioning(true);
    document.body.style.overflow = '';

    // STEP 3: Complete transition to main website after 1.2 seconds
    setTimeout(() => {
      setIsComplete(true);
    }, 1200);
  };

  if (isComplete) return null;

  return (
    <div
      onClick={handleSplashTap}
      className={`fixed inset-0 z-[100] bg-[#050c08] flex flex-col items-center justify-center overflow-hidden select-none cursor-pointer transition-opacity duration-1000 ${
        isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      aria-label="Tap to enter wedding invitation"
    >
      <style>{`
        /* Ribbon 1 Flowing Draw (Left Journey) */
        @keyframes ribbonLeftDraw {
          0% {
            stroke-dashoffset: 1200;
            opacity: 0;
          }
          20% {
            opacity: 0.95;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.95;
          }
        }

        /* Ribbon 2 Flowing Draw (Right Journey) */
        @keyframes ribbonRightDraw {
          0% {
            stroke-dashoffset: 1200;
            opacity: 0;
          }
          20% {
            opacity: 0.95;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.95;
          }
        }

        /* Formed Golden Heart Drawing */
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

        /* Subtle Elegant Heartbeat Pulse (Scene 5) */
        @keyframes heartDoublePulse {
          0% {
            transform: scale(1.00);
            filter: drop-shadow(0 0 8px rgba(245,230,190,0.4));
          }
          18% {
            transform: scale(1.08);
            filter: drop-shadow(0 0 24px rgba(245,230,190,0.85));
          }
          34% {
            transform: scale(0.98);
            filter: drop-shadow(0 0 10px rgba(245,230,190,0.5));
          }
          48% {
            transform: scale(1.04);
            filter: drop-shadow(0 0 18px rgba(245,230,190,0.75));
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

        /* Ambient Candlelight Atmosphere Glow */
        @keyframes atmosphereGlow {
          0% {
            opacity: 0.15;
            transform: scale(0.92);
          }
          50% {
            opacity: 0.45;
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

        .animate-ribbon-left {
          stroke-dasharray: 1200;
          animation: ribbonLeftDraw 3.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .animate-ribbon-right {
          stroke-dasharray: 1200;
          animation: ribbonRightDraw 3.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .animate-heart-form {
          stroke-dasharray: 1000;
          animation: heartFormDraw 2.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
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
          .animate-ribbon-left, .animate-ribbon-right, .animate-heart-form, .animate-heartbeat, .animate-tap-float {
            animation: none !important;
          }
        }
      `}</style>

      {/* Sparse Atmospheric Dust Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* SCENE 6+: Subtle Warm Golden Candlelight Glow */}
      {animStage >= 6 && (
        <div className="absolute inset-0 z-[2] pointer-events-none flex items-center justify-center">
          <div className="animate-atmosphere w-96 h-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,230,190,0.18)_0%,rgba(241,198,90,0.03)_50%,transparent_75%)] filter blur-3xl" />
        </div>
      )}

      {/* TRANSITIONING: Golden Light Portal Expansion */}
      {isTransitioning && (
        <div className="absolute inset-0 z-[30] pointer-events-none flex items-center justify-center">
          <div className="animate-portal w-32 h-32 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,230,190,0.95)_0%,rgba(241,198,90,0.4)_40%,transparent_75%)] filter blur-xl" />
        </div>
      )}

      {/* MAIN ANIMATION CONTAINER (SCENE 1 TO 7) */}
      <div className="relative z-[20] flex flex-col items-center justify-center text-center px-4 w-full max-w-xl pointer-events-none">
        
        {/* SVG GOLDEN RIBBONS & HEART CANVAS */}
        <div
          className={`relative flex items-center justify-center transition-all duration-700 ${
            animStage >= 5 ? 'animate-heartbeat' : ''
          }`}
        >
          <svg
            width="320"
            height="260"
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-24 h-20 sm:w-32 sm:h-28 text-[#F5E6BE] filter drop-shadow-[0_0_8px_rgba(245,230,190,0.45)]"
          >
            <defs>
              <linearGradient id="silkChampagneGrad" x1="0" y1="0" x2="400" y2="300" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFF9EB" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#F5E6BE" stopOpacity="0.90" />
                <stop offset="75%" stopColor="#E2C875" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#C49E35" stopOpacity="0.80" />
              </linearGradient>

              {/* Soft Luminous Outer Edge Glow */}
              <filter id="silkGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* SCENE 1, 2, 3: Ribbon 1 (Left Journey Flowing Path) */}
            {animStage < 5 && (
              <path
                d="M -30,180 C 70,240 130,70 190,170 C 210,205 210,130 175,110 C 145,90 130,140 160,175 C 185,205 200,240 200,265"
                stroke="url(#silkChampagneGrad)"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                filter="url(#silkGlow)"
                className="animate-ribbon-left"
              />
            )}

            {/* SCENE 1, 2, 3: Ribbon 2 (Right Journey Flowing Path) */}
            {animStage < 5 && (
              <path
                d="M 430,120 C 330,60 270,230 210,130 C 190,95 190,170 225,190 C 255,210 270,160 240,125 C 215,95 200,60 200,35"
                stroke="url(#silkChampagneGrad)"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                filter="url(#silkGlow)"
                className="animate-ribbon-right"
              />
            )}

            {/* SCENE 4, 5, 6, 7: The Organic Fine-Line Heart Formed by the Intertwined Ribbons */}
            {animStage >= 4 && (
              <path
                d="M 200,265 C 200,265 80,185 80,115 C 80,60 135,50 175,85 C 190,98 200,110 200,110 C 200,110 210,98 225,85 C 265,50 320,60 320,115 C 320,185 200,265 200,265 Z"
                stroke="url(#silkChampagneGrad)"
                strokeWidth="2.0"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter="url(#silkGlow)"
                className={animStage === 4 ? 'animate-heart-form' : ''}
              />
            )}
          </svg>
        </div>

        {/* SCENE 7: INVITATION MESSAGE REVEAL ("Come, let us begin." + "Tap to enter") */}
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
