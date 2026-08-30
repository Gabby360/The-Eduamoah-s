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

type SplashPhase = 'breathing' | 'anticipation' | 'opening' | 'complete';

/* ─────────────────────────────────────────────
   SPLASH SCREEN COMPONENT
   Multi-Stage Cinematic Heart Opening Transition (10s Breathing + 6s Opening)
───────────────────────────────────────────── */
export const SplashScreen: React.FC = () => {
  const [phase, setPhase] = useState<SplashPhase>('breathing');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // 1. MASTER TIMELINE & FAILSAFE
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPhase('opening');
      const rTimer = setTimeout(() => {
        setPhase('complete');
        document.body.style.overflow = '';
      }, 700);
      return () => clearTimeout(rTimer);
    }

    // 10.0s: Stage 1 Breathing completes -> Stage 2 Anticipation (glow & pulse pause 0.8s)
    const tAnticipation = setTimeout(() => {
      setPhase('anticipation');
    }, 10000);

    // 10.8s: Stage 2 Anticipation completes -> Stage 3-6 Multi-Stage Heart Opening Sequence (5.2s)
    const tOpening = setTimeout(() => {
      setPhase('opening');
    }, 10800);

    // 16.0s: Stage 6 Complete reveal & unlock main website page
    const tComplete = setTimeout(() => {
      setPhase('complete');
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    }, 16000);

    // Hard Failsafe at 17.5s
    const tFailsafe = setTimeout(() => {
      setPhase('complete');
      document.body.style.overflow = '';
    }, 17500);

    return () => {
      clearTimeout(tAnticipation);
      clearTimeout(tOpening);
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

    const dustCount = window.innerWidth < 768 ? 14 : 28;

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
              className={phase === 'opening' ? 'animate-multi-stage-aperture' : ''}
            />
          </mask>
        </defs>
      </svg>

      {/* Main Full-Screen Overlay Container */}
      <div
        className={`fixed inset-0 z-[100] bg-[#0a1713] flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${
          phase === 'opening' ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
        style={
          phase === 'opening'
            ? {
                mask: 'url(#heart-aperture-mask)',
                WebkitMask: 'url(#heart-aperture-mask)',
              }
            : {}
        }
      >
        <style>{`
          /* Stage 1: Gentle heartbeat breathing cycle (2.4s per breath) */
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

          /* Stage 2: Pre-reveal anticipation moment (glow intensifies & gentle single pulse) */
          @keyframes symbolAnticipation {
            0% {
              transform: scale(1.0);
              opacity: 0.8;
              filter: drop-shadow(0 0 10px rgba(241,198,90,0.5));
            }
            50% {
              transform: scale(1.4);
              opacity: 1.0;
              filter: drop-shadow(0 0 35px rgba(241,198,90,0.95));
            }
            100% {
              transform: scale(1.15);
              opacity: 0.9;
              filter: drop-shadow(0 0 25px rgba(241,198,90,0.8));
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

          /* Multi-stage Heart Aperture Reveal (Stages 3 to 6: 5.2s duration) */
          @keyframes multiStageHeartAperture {
            /* Stage 3: Grows slowly from tiny to medium (0s to 2.0s = 0% to 38%) */
            0% {
              transform: scale(0.01);
              transform-origin: 50% 50%;
            }
            25% {
              transform: scale(0.5);
              transform-origin: 50% 50%;
            }
            38% {
              transform: scale(1.8);
              transform-origin: 50% 50%;
            }

            /* Stage 4: Heartbeat pulse expand -> contract -> expand (2.0s to 2.7s = 38% to 52%) */
            44% {
              transform: scale(2.6);
              transform-origin: 50% 50%;
            }
            48% {
              transform: scale(2.2);
              transform-origin: 50% 50%;
            }
            52% {
              transform: scale(3.5);
              transform-origin: 50% 50%;
            }

            /* Stage 5: Full Viewport Heart Expansion (2.7s to 4.2s = 52% to 82%) */
            68% {
              transform: scale(14.0);
              transform-origin: 50% 50%;
            }
            82% {
              transform: scale(45.0);
              transform-origin: 50% 50%;
            }

            /* Stage 6: Final handoff to homepage (4.2s to 5.2s = 82% to 100%) */
            100% {
              transform: scale(65.0);
              transform-origin: 50% 50%;
            }
          }

          /* Multi-stage Expanding Golden Heart Rim Line */
          @keyframes multiStageHeartRim {
            0% { transform: scale(0.05); opacity: 1.0; }
            38% { transform: scale(1.8); opacity: 0.95; }
            44% { transform: scale(2.6); opacity: 1.0; }
            48% { transform: scale(2.2); opacity: 0.9; }
            52% { transform: scale(3.5); opacity: 0.95; }
            82% { transform: scale(35.0); opacity: 0.4; }
            100% { transform: scale(55.0); opacity: 0.0; }
          }

          /* Stage 6: Soft Warm Golden Illumination Light Burst at 80-90% viewport */
          @keyframes warmLightBurst {
            0%, 65% { opacity: 0; }
            80% { opacity: 0.35; }
            100% { opacity: 0; }
          }

          .animate-symbol-breath {
            animation: symbolBreathing 2.4s ease-in-out infinite;
          }

          .animate-symbol-anticipation {
            animation: symbolAnticipation 0.8s ease-out forwards;
          }

          .animate-halo-breath {
            animation: haloBreathing 2.4s ease-in-out infinite;
          }

          .animate-multi-stage-aperture {
            animation: multiStageHeartAperture 5.2s cubic-bezier(0.25, 0.9, 0.35, 1) forwards;
            transform-origin: 50% 50%;
            will-change: transform;
          }

          .animate-multi-stage-rim {
            animation: multiStageHeartRim 5.2s cubic-bezier(0.25, 0.9, 0.35, 1) forwards;
            transform-origin: center center;
            will-change: transform, opacity;
          }

          .animate-light-burst {
            animation: warmLightBurst 5.2s ease-out forwards;
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-symbol-breath, .animate-halo-breath, .animate-symbol-anticipation {
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

        {/* Soft Warm Illumination Light Burst Layer */}
        {phase === 'opening' && (
          <div className="animate-light-burst absolute inset-0 z-[30] bg-[radial-gradient(circle_at_center,rgba(241,198,90,0.5)_0%,rgba(241,198,90,0.15)_60%,transparent_85%)] pointer-events-none" />
        )}

        {/* Quiet Ambient Golden Glow Halo behind symbol */}
        <div className="absolute inset-0 z-[2] pointer-events-none flex items-center justify-center">
          <div
            className={`w-72 h-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(241,198,90,0.22)_0%,rgba(241,198,90,0.05)_55%,transparent_80%)] filter blur-2xl ${
              phase === 'breathing' ? 'animate-halo-breath' : 'opacity-80 scale-125'
            }`}
          />
        </div>

        {/* ── EXPANDING GOLDEN HEART RIM PORTAL (Phase === 'opening') ── */}
        {phase === 'opening' && (
          <div className="absolute inset-0 z-[25] flex items-center justify-center pointer-events-none">
            <svg
              width="200"
              height="200"
              viewBox="0 0 100 100"
              className="animate-multi-stage-rim text-[#f1c65a] drop-shadow-[0_0_25px_rgba(241,198,90,0.9)]"
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

        {/* ── CENTER BREATHING / ANTICIPATION TINY LOVE SYMBOL ── */}
        {(phase === 'breathing' || phase === 'anticipation') && (
          <div className="relative z-[10] flex flex-col items-center justify-center pointer-events-none">
            <div
              className={`flex items-center justify-center p-3 ${
                phase === 'breathing' ? 'animate-symbol-breath' : 'animate-symbol-anticipation'
              }`}
            >
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
