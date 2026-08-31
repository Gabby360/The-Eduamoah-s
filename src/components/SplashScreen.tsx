import React, { useEffect, useState, useRef } from 'react';
import { globalAudio } from '../utils/audioManager';

/* ─────────────────────────────────────────────
   ATMOSPHERIC & SPARKLING DUST PARTICLES
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

interface SparkleParticle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  pulseSpeed: number;
  color: string;
}

export const SplashScreen: React.FC = () => {
  // Sequence Stage:
  // 1: Background & sparkling dust -> 2: Ring fades & slides up -> 3: G appears -> 4: & appears -> 5: A appears -> 6: atmosphere -> 7: invitation & Tap to enter ready
  const [animStage, setAnimStage] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);

  // 1. MASTER TIMELINE FOR REALISTIC RING ENTRANCE + MONOGRAM G & A
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setAnimStage(7);
      return;
    }

    // Stage 2: Realistic Ring gently fades & slides into position (1.0s)
    const t2 = setTimeout(() => setAnimStage(2), 1000);

    // Stage 3: G appears after ring settles (2.4s)
    const t3 = setTimeout(() => setAnimStage(3), 2400);

    // Stage 4: & appears (3.4s)
    const t4 = setTimeout(() => setAnimStage(4), 3400);

    // Stage 5: A appears (4.4s)
    const t5 = setTimeout(() => setAnimStage(5), 4400);

    // Stage 6: Golden Atmosphere Glow (5.6s)
    const t6 = setTimeout(() => setAnimStage(6), 5600);

    // Stage 7: Invitation Message & "Tap to enter" Reveal (6.6s)
    const t7 = setTimeout(() => setAnimStage(7), 6600);

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

  // 2. MAGICAL SPARKLING DUST & ATMOSPHERIC DUST PARTICLES
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

    const isMobile = window.innerWidth < 768;
    const dustCount = isMobile ? 12 : 24;
    const sparkleCount = isMobile ? 25 : 45;

    // Ambient background dust
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

    // Magical sparkling dust focused around & slightly above the "Tap to enter" area
    const colors = ['#FFF9EB', '#F5E6BE', '#F1C65A', '#E2C875'];
    const sparkles: SparkleParticle[] = Array.from({ length: sparkleCount }, () => {
      const centerX = window.innerWidth / 2;
      const tapZoneY = window.innerHeight * 0.68;
      return {
        x: rand(centerX - 180, centerX + 180),
        y: rand(tapZoneY - 120, tapZoneY + 60),
        r: rand(0.5, 1.8),
        vx: rand(-0.08, 0.08),
        vy: rand(-0.16, -0.03),
        alpha: rand(0.05, 0.4),
        maxAlpha: rand(0.4, 0.85),
        pulseSpeed: rand(0.008, 0.025),
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30;

    const tick = (now: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;

      const W = canvas.width;
      const H = canvas.height;
      const centerX = W / 2;
      const tapZoneY = H * 0.68;
      ctx.clearRect(0, 0, W, H);

      /* 1. Ambient Background Dust */
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

      /* 2. Magical Sparkling Dust around "Tap to enter" Callout Area */
      sparkles.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha += Math.sin(now * s.pulseSpeed) * 0.02;

        // Reset particle softly when floating out of the callout zone
        if (
          s.y < tapZoneY - 140 ||
          s.x < centerX - 240 ||
          s.x > centerX + 240 ||
          s.alpha < 0.02
        ) {
          s.x = rand(centerX - 170, centerX + 170);
          s.y = rand(tapZoneY + 10, tapZoneY + 60);
          s.alpha = rand(0.05, 0.35);
        }

        const clampedAlpha = Math.max(0.04, Math.min(s.alpha, s.maxAlpha));

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = clampedAlpha;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = s.r * 3;
        ctx.fill();
        ctx.restore();
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
        /* Realistic Ring Smooth Upward Entrance Animation */
        @keyframes ringFloatEntrance {
          0% {
            opacity: 0;
            transform: translateY(22px) scale(0.93);
          }
          60% {
            opacity: 0.95;
            transform: translateY(-2px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1.0);
          }
        }

        /* Metallic Gold Light Sweep Across Ring Surface */
        @keyframes metallicGoldSheen {
          0% {
            transform: translateX(-100%) rotate(25deg);
            opacity: 0;
          }
          40% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(100%) rotate(25deg);
            opacity: 0;
          }
        }

        /* Subtle Heartbeat Pulse */
        @keyframes heartDoublePulse {
          0% {
            transform: scale(1.00);
            filter: drop-shadow(0 0 8px rgba(245,230,190,0.4));
          }
          18% {
            transform: scale(1.04);
            filter: drop-shadow(0 0 20px rgba(245,230,190,0.8));
          }
          34% {
            transform: scale(0.98);
            filter: drop-shadow(0 0 10px rgba(245,230,190,0.45));
          }
          48% {
            transform: scale(1.02);
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
            opacity: 0.75;
          }
          50% {
            transform: translateY(-3px);
            opacity: 1.0;
          }
          100% {
            transform: translateY(0px);
            opacity: 0.75;
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

        .animate-ring-entrance {
          animation: ringFloatEntrance 2.0s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .animate-sheen-sweep {
          animation: metallicGoldSheen 2.2s ease-in-out infinite 2.0s;
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
      `}</style>

      {/* Sparse Atmospheric Dust & Sparkling Dust Particles */}
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

      {/* MAIN ANIMATION CONTAINER (REALISTIC RING IMAGE + SPACIOUS G & A MONOGRAM) */}
      <div className="relative z-[20] flex flex-col items-center justify-center text-center px-4 w-full max-w-xl pointer-events-none">
        
        {/* REALISTIC RING IMAGE & MONOGRAM G & A */}
        <div
          className={`relative flex items-center justify-center transition-all duration-1000 ${
            animStage >= 6 ? 'animate-heartbeat' : ''
          }`}
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center overflow-hidden rounded-full">
            {/* REALISTIC PHOTOGRAPHED WEDDING RINGS IMAGE ASSET */}
            {animStage >= 2 && (
              <img
                src="/realistic-interlocking-rings.png"
                alt="Realistic Gold Wedding Bands"
                className="w-full h-full object-contain filter drop-shadow-[0_12px_35px_rgba(245,230,190,0.35)] mix-blend-screen animate-ring-entrance"
                style={{
                  maskImage: 'radial-gradient(circle at center, black 50%, transparent 92%)',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 92%)',
                }}
              />
            )}

            {/* Soft Metallic Gold Light Sheen Sweep Overlay */}
            {animStage >= 2 && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#F5E6BE]/25 to-transparent animate-sheen-sweep mix-blend-screen" />
              </div>
            )}

            {/* SPACIOUS MONOGRAM TEXT (G & A) FRAMED COMFORTABLY IN CENTER OF THE RINGS */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="flex items-center justify-center gap-3 sm:gap-4 select-none px-4 py-2 bg-[#050c08]/60 backdrop-blur-[2px] rounded-full border border-[#F5E6BE]/25 shadow-2xl">
                {/* Letter G */}
                <span
                  className={`font-serif text-3xl sm:text-4xl text-[#FBF7EF] font-light uppercase tracking-wider text-shadow-hero transition-all duration-1000 ${
                    animStage >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                >
                  G
                </span>

                {/* Symbol & */}
                <span
                  className={`font-script text-2xl sm:text-3xl bg-gradient-to-r from-[#FFF7E3] via-[#F5E6BE] to-[#E2C875] bg-clip-text text-transparent font-normal transition-all duration-1000 ${
                    animStage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-80'
                  }`}
                >
                  &
                </span>

                {/* Letter A */}
                <span
                  className={`font-serif text-3xl sm:text-4xl text-[#FBF7EF] font-light uppercase tracking-wider text-shadow-hero transition-all duration-1000 ${
                    animStage >= 5 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                >
                  A
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* INVITATION MESSAGE REVEAL ("Come, let us begin." + "Tap to enter") */}
        <div
          className={`mt-2 flex flex-col items-center gap-3 transition-all duration-1000 ${
            animStage >= 7 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-[0.2em] text-[#F5E6BE] font-light drop-shadow-[0_0_15px_rgba(245,230,190,0.35)]">
            Come, let us begin.
          </h2>

          <div className="animate-tap-float mt-1 flex flex-col items-center justify-center">
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.35em] text-[#F5E6BE]/80 uppercase font-light drop-shadow-[0_0_12px_rgba(245,230,190,0.4)]">
              Tap to enter
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
