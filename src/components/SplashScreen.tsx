import React, { useEffect, useState, useRef } from 'react';
import { globalAudio } from '../utils/audioManager';

/* ─────────────────────────────────────────────
   HELPERS & DUST PARTICLES FOR ATMOSPHERIC CANVAS
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

/* ─────────────────────────────────────────────
   SPLASH SCREEN COMPONENT
   Minimalist Breathing Love Symbol & Slower Heart Aperture Reveal (Bright Inside)
───────────────────────────────────────────── */
export const SplashScreen: React.FC = () => {
  // Phase state: 'breathing' (0-10s) -> 'expanding' (10-11.2s) -> 'complete'
  const [phase, setPhase] = useState<'breathing' | 'expanding' | 'complete'>('breathing');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // 1. MASTER TIMELINE & FAILSAFE
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    // Controlled autoplay attempt on splash screen mount
    globalAudio.attemptPlay();

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPhase('complete');
      document.body.style.overflow = '';
      return;
    }

    // ~10.0s: Transition into Heart Aperture Reveal & UNLOCK SCROLLING
    const tExpand = setTimeout(() => {
      setPhase('expanding');
      document.body.style.overflow = '';
    }, 10000);

    // 11.2s: Complete reveal & unmount splash
    const tComplete = setTimeout(() => {
      setPhase('complete');
      document.body.style.overflow = '';
    }, 11200);

    // Hard Failsafe at 12.0s
    const tFailsafe = setTimeout(() => {
      setPhase('complete');
      document.body.style.overflow = '';
    }, 12000);

    return () => {
      clearTimeout(tExpand);
      clearTimeout(tComplete);
      clearTimeout(tFailsafe);
      document.body.style.overflow = '';
    };
  }, []);


  // 2. SPARSE ATMOSPHERIC GOLD DUST CANVAS
  useEffect(() => {
    if (phase === 'complete') return;

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

    const dustCount = window.innerWidth < 768 ? 12 : 24;

    const dust: DustParticle[] = Array.from({ length: dustCount }, () => ({
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      r: rand(0.7, 1.8),
      vx: rand(-0.06, 0.06),
      vy: rand(-0.10, -0.03),
      alpha: rand(0.05, 0.22),
      dir: Math.random() > 0.5 ? 1 : -1,
      speed: rand(0.0015, 0.004),
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
        if (p.alpha > 0.22 || p.alpha < 0.03) p.dir *= -1;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) {
          p.y = H;
          p.x = rand(0, W);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(241, 198, 90, ${p.alpha.toFixed(3)})`;
        ctx.fill();
      });
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [phase]);

  if (phase === 'complete') return null;

  return (
    <>
      {/* SVG Mask Definition for Heart Aperture Reveal (Cutout hole reveals website inside) */}
      <svg className="fixed w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <mask id="heart-aperture-mask" maskUnits="objectBoundingBox">
            {/* White area keeps the dark curtain visible */}
            <rect x="0" y="0" width="1" height="1" fill="white" />
            {/* Black heart in center cuts out transparent window to reveal website behind */}
            <path
              d="M 0.5,0.18 C 0.33,-0.06 0,0.08 0,0.36 C 0,0.62 0.5,0.88 0.5,0.98 C 0.5,0.88 1,0.62 1,0.36 C 1,0.08 0.67,-0.06 0.5,0.18 Z"
              fill="black"
              className={phase === 'expanding' ? 'animate-heart-aperture' : ''}
            />
          </mask>
        </defs>
      </svg>

      {/* Main Full-Screen Overlay Container */}
      <div
        onClick={() => {
          globalAudio.attemptPlay();
          if (phase === 'breathing') {
            setPhase('expanding');
            document.body.style.overflow = '';
            setTimeout(() => setPhase('complete'), 1200);
          }
        }}
        className={`fixed inset-0 z-[100] bg-[#0a1713] flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${
          phase === 'expanding' ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'
        }`}
        style={
          phase === 'expanding'
            ? {
                mask: 'url(#heart-aperture-mask)',
                WebkitMask: 'url(#heart-aperture-mask)',
              }
            : {}
        }
      >
        <style>{`
          /* Quiet heartbeat breathing cycle (2.4s per breath) */
          @keyframes symbolBreathing {
            0% {
              transform: scale(0.92);
              opacity: 0.65;
              filter: drop-shadow(0 0 6px rgba(241,198,90,0.35));
            }
            50% {
              transform: scale(1.28);
              opacity: 1.00;
              filter: drop-shadow(0 0 22px rgba(241,198,90,0.85));
            }
            100% {
              transform: scale(0.92);
              opacity: 0.65;
              filter: drop-shadow(0 0 6px rgba(241,198,90,0.35));
            }
          }

          /* Ambient radial halo breathing rhythm */
          @keyframes haloBreathing {
            0% {
              transform: scale(0.85);
              opacity: 0.30;
            }
            50% {
              transform: scale(1.15);
              opacity: 0.70;
            }
            100% {
              transform: scale(0.85);
              opacity: 0.30;
            }
          }

          /* Slower, Cinematic Heart Aperture Reveal (Cutout Hole Opening to Website) */
          @keyframes heartApertureExpand {
            0% {
              transform: scale(0.01);
              transform-origin: 50% 50%;
            }
            15% {
              transform: scale(0.3);
              transform-origin: 50% 50%;
            }
            45% {
              transform: scale(2.2);
              transform-origin: 50% 50%;
            }
            75% {
              transform: scale(12.0);
              transform-origin: 50% 50%;
            }
            100% {
              transform: scale(50.0);
              transform-origin: 50% 50%;
            }
          }

          /* Expanding Golden Heart Rim Line */
          @keyframes heartRimExpand {
            0% {
              transform: scale(0.1);
              opacity: 1.0;
            }
            50% {
              transform: scale(4.0);
              opacity: 0.85;
            }
            100% {
              transform: scale(40.0);
              opacity: 0.0;
            }
          }

          .animate-symbol-breath {
            animation: symbolBreathing 2.4s ease-in-out infinite;
          }

          .animate-halo-breath {
            animation: haloBreathing 2.4s ease-in-out infinite;
          }

          .animate-heart-aperture {
            animation: heartApertureExpand 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
            transform-origin: 50% 50%;
            will-change: transform;
          }

          .animate-heart-rim {
            animation: heartRimExpand 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
            transform-origin: center center;
            will-change: transform, opacity;
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-symbol-breath, .animate-halo-breath {
              animation: none !important;
            }
          }
        `}</style>

        {/* Sparse Ambient Gold Dust Particles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
          aria-hidden="true"
        />

        {/* Quiet Ambient Golden Glow Halo behind symbol */}
        <div className="absolute inset-0 z-[2] pointer-events-none flex items-center justify-center">
          <div className="animate-halo-breath w-72 h-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(241,198,90,0.22)_0%,rgba(241,198,90,0.05)_55%,transparent_80%)] filter blur-2xl" />
        </div>

        {/* ── EXPANDING GOLDEN HEART RIM PORTAL (Phase === 'expanding') ── */}
        {phase === 'expanding' && (
          <div className="absolute inset-0 z-[25] flex items-center justify-center pointer-events-none">
            <svg
              width="200"
              height="200"
              viewBox="0 0 100 100"
              className="animate-heart-rim text-[#f1c65a] drop-shadow-[0_0_25px_rgba(241,198,90,0.9)]"
            >
              <path
                d="M 50,18 C 33,-6 0,8 0,36 C 0,62 50,88 50,98 C 50,88 100,62 100,36 C 100,8 67,-6 50,18 Z"
                fill="none"
                stroke="#F1C65A"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        )}

        {/* ── CENTER BREATHING LOVE SYMBOL ── */}
        {phase === 'breathing' && (
          <div className="relative z-[10] flex flex-col items-center justify-center pointer-events-none">
            <div className="animate-symbol-breath flex items-center justify-center p-3">
              {/* Elegant 3D Luminous Vector Gold Heart Icon with Outer Gold Outline Ring */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#f1c65a] drop-shadow-[0_0_16px_rgba(241,198,90,0.9)]"
              >
                <defs>
                  <linearGradient id="tinyHeartGrad" x1="0" y1="0" x2="36" y2="36">
                    <stop offset="0%" stopColor="#FFF3D1" />
                    <stop offset="35%" stopColor="#F1C65A" />
                    <stop offset="80%" stopColor="#E2B324" />
                    <stop offset="100%" stopColor="#B88D18" />
                  </linearGradient>
                </defs>
                {/* Outer Delicate Gold Accent Outline Ring */}
                <path
                  d="M18 4.2C15.2 -0.2 8.4 -0.2 5.0 3.8C1.6 7.8 2.2 13.5 6.7 18.0L18 29.3L29.3 18.0C33.8 13.5 34.4 7.8 31.0 3.8C27.6 -0.2 20.8 -0.2 18 4.2Z"
                  fill="none"
                  stroke="#F1C65A"
                  strokeWidth="1.2"
                  strokeOpacity="0.85"
                />
                {/* Main Heart with Crisp Gold Border Line */}
                <path
                  d="M18 6.5C15.5 2.5 9.5 2.5 6.5 6C3.5 9.5 4 14.5 8 18.5L18 28.5L28 18.5C32 14.5 32.5 9.5 29.5 6C26.5 2.5 20.5 2.5 18 6.5Z"
                  fill="url(#tinyHeartGrad)"
                  stroke="#FFF8E1"
                  strokeWidth="1.4"
                />
              </svg>
            </div>
          </div>
        )}

      </div>
    </>
  );
};
