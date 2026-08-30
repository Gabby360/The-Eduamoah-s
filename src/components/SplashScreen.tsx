import React, { useEffect, useState, useRef } from 'react';

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
   Minimalist Breathing Love Symbol & Heart Portal Reveal
───────────────────────────────────────────── */
export const SplashScreen: React.FC = () => {
  // Phase state: 'breathing' (0-10s) -> 'expanding' (10-12s) -> 'complete'
  const [phase, setPhase] = useState<'breathing' | 'expanding' | 'complete'>('breathing');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // 1. MASTER TIMELINE & FAILSAFE
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPhase('expanding');
      const rTimer = setTimeout(() => {
        setPhase('complete');
        document.body.style.overflow = '';
      }, 700);
      return () => clearTimeout(rTimer);
    }

    // 10.0s: Transition from 10-second quiet breathing heartbeat into Heart Reveal Portal
    const tExpand = setTimeout(() => {
      setPhase('expanding');
    }, 10000);

    // 12.0s: Complete reveal & unlock main website page
    const tComplete = setTimeout(() => {
      setPhase('complete');
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    }, 12000);

    // Hard Failsafe at 13.5s
    const tFailsafe = setTimeout(() => {
      setPhase('complete');
      document.body.style.overflow = '';
    }, 13500);

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
      {/* SVG Clip-Path Definition for Heart-Shaped Reveal Portal */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="splash-heart-reveal-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0.18 C 0.33,-0.06 0,0.08 0,0.36 C 0,0.62 0.5,0.88 0.5,0.98 C 0.5,0.88 1,0.62 1,0.36 C 1,0.08 0.67,-0.06 0.5,0.18 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Main Full-Screen Overlay Container */}
      <div
        className={`fixed inset-0 z-[100] bg-[#0a1713] flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${
          phase === 'expanding' ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
      >
        <style>{`
          /* Gentle, quiet heartbeat breathing cycle (2.4s per breath) */
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

          /* Dramatic Heart-Shaped Expansion Reveal */
          @keyframes heartExpandReveal {
            0% {
              transform: scale(0.08);
              opacity: 1.0;
            }
            35% {
              transform: scale(2.2);
              opacity: 0.95;
            }
            75% {
              transform: scale(18.0);
              opacity: 0.85;
            }
            100% {
              transform: scale(65.0);
              opacity: 0.0;
            }
          }

          .animate-symbol-breath {
            animation: symbolBreathing 2.4s ease-in-out infinite;
          }

          .animate-halo-breath {
            animation: haloBreathing 2.4s ease-in-out infinite;
          }

          .animate-heart-reveal {
            animation: heartExpandReveal 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
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

        {/* ── EXPANDING HEART PORTAL MASK OVERLAY (Phase === 'expanding') ── */}
        {phase === 'expanding' && (
          <div
            className="absolute inset-0 z-[20] bg-[#0a1713] border-4 border-[#f1c65a]/60 animate-heart-reveal"
            style={{
              clipPath: 'url(#splash-heart-reveal-clip)',
              transformOrigin: '50% 50%',
            }}
          />
        )}

        {/* ── CENTER BREATHING TINY LOVE SYMBOL ── */}
        {phase === 'breathing' && (
          <div className="relative z-[10] flex flex-col items-center justify-center pointer-events-none">
            <div className="animate-symbol-breath flex items-center justify-center p-3">
              {/* Elegant 3D Luminous Vector Gold Heart Icon (18px) */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-5 sm:h-5 text-[#f1c65a] drop-shadow-[0_0_12px_rgba(241,198,90,0.85)]"
              >
                <defs>
                  <linearGradient id="tinyHeartGrad" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="#FFF3D1" />
                    <stop offset="35%" stopColor="#F1C65A" />
                    <stop offset="80%" stopColor="#E2B324" />
                    <stop offset="100%" stopColor="#B88D18" />
                  </linearGradient>
                </defs>
                <path
                  d="M16 5.5C13.5 1.5 7.5 1.5 4.5 5C1.5 8.5 2 13.5 6 17.5L16 27.5L26 17.5C30 13.5 30.5 8.5 27.5 5C24.5 1.5 18.5 1.5 16 5.5Z"
                  fill="url(#tinyHeartGrad)"
                  stroke="#FFF8E1"
                  strokeWidth="0.8"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
