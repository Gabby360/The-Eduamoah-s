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
  // 1: Ring 1 draws -> 2: Ring 2 interlocks -> 3: G appears -> 4: & appears -> 5: C appears -> 6: atmosphere -> 7: invitation ready
  const [animStage, setAnimStage] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);

  // 1. MASTER TIMELINE FOR STYLIZED INTERLOCKING GOLD BANDS + SPACIOUS MONOGRAM G & C
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setAnimStage(7);
      return;
    }

    // Stage 2: Ring 2 interlocks diagonally (1.2s)
    const t2 = setTimeout(() => setAnimStage(2), 1200);

    // Stage 3: G appears (2.2s)
    const t3 = setTimeout(() => setAnimStage(3), 2200);

    // Stage 4: & appears (3.4s)
    const t4 = setTimeout(() => setAnimStage(4), 3400);

    // Stage 5: C appears (4.2s)
    const t5 = setTimeout(() => setAnimStage(5), 4200);

    // Stage 6: Golden Atmosphere Glow (5.4s)
    const t6 = setTimeout(() => setAnimStage(6), 5400);

    // Stage 7: Invitation Message Reveal (6.4s)
    const t7 = setTimeout(() => setAnimStage(7), 6400);

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
    const dustCount = isMobile ? 30 : 65;
    const sparkleCount = isMobile ? 45 : 90;

    // Ambient background dust
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

    // Rich sparkling dust focused around G & C monogram, rings, and open surrounding space
    const goldColors = ['#FFF9EB', '#F5E6BE', '#F1C65A', '#E2C875', '#D4B04C'];
    const sparkles: SparkleParticle[] = Array.from({ length: sparkleCount }, () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const isClustered = Math.random() < 0.6;
      return {
        x: isClustered ? rand(centerX - 240, centerX + 240) : rand(0, window.innerWidth),
        y: isClustered ? rand(centerY - 220, centerY + 220) : rand(0, window.innerHeight),
        r: rand(0.5, 2.0),
        vx: rand(-0.1, 0.1),
        vy: rand(-0.18, -0.03),
        alpha: rand(0.05, 0.45),
        maxAlpha: rand(0.45, 0.9),
        pulseSpeed: rand(0.008, 0.028),
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
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
      ctx.clearRect(0, 0, W, H);

      /* 1. Ambient Background Dust */
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

      /* 2. Magical Sparkling Dust Particles */
      sparkles.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha += Math.sin(now * s.pulseSpeed) * 0.025;

        if (s.y < 0 || s.x < -20 || s.x > W + 20 || s.alpha < 0.02) {
          s.x = rand(50, W - 50);
          s.y = H + rand(10, 40);
          s.alpha = rand(0.05, 0.4);
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

  // NATIVE ONCLICK & TOUCH USER GESTURE HANDLER: Starts audio SYNCHRONOUSLY inside gesture loop & triggers cinematic heart reveal
  const handleSplashTap = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (isProcessingRef.current || isTransitioning || isComplete) return;
    isProcessingRef.current = true;

    // Execute audio.play() SYNCHRONOUSLY inside native onClick/touch gesture call stack
    globalAudio.playDirect();

    // Trigger Slow Cinematic Heart-Shaped Reveal Transition (1.9 seconds)
    setIsTransitioning(true);

    setTimeout(() => {
      setIsComplete(true);
      document.body.style.overflow = '';
    }, 1900);
  };

  if (isComplete) return null;

  return (
    <div
      onClick={handleSplashTap}
      onTouchEnd={handleSplashTap}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#050c08] overflow-hidden select-none cursor-pointer transition-opacity duration-1000 ${isTransitioning ? 'pointer-events-none opacity-0 transition-opacity duration-1900' : 'opacity-100'
        }`}
    >
      <style>{`
        /* Ring 1 (Left Gold Band Draw) */
        @keyframes ringLeftDraw {
          0% {
            stroke-dasharray: 480;
            stroke-dashoffset: 480;
            opacity: 0;
            transform: translateX(-12px) scale(0.96);
          }
          30% {
            opacity: 0.85;
          }
          100% {
            stroke-dasharray: 480;
            stroke-dashoffset: 0;
            opacity: 1.0;
            transform: translateX(0) scale(1.0);
          }
        }

        /* Ring 2 (Right Interlocking Gold Band Draw) */
        @keyframes ringRightDraw {
          0% {
            stroke-dasharray: 480;
            stroke-dashoffset: 480;
            opacity: 0;
            transform: translateX(12px) scale(0.96);
          }
          30% {
            opacity: 0.85;
          }
          100% {
            stroke-dasharray: 480;
            stroke-dashoffset: 0;
            opacity: 1.0;
            transform: translateX(0) scale(1.0);
          }
        }

        /* Monogram Letter G Fade In from Left */
        @keyframes monogramGFadeIn {
          0% {
            opacity: 0;
            transform: translateX(-16px);
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

        /* Monogram Letter C Fade In from Right */
        @keyframes monogramCFadeIn {
          0% {
            opacity: 0;
            transform: translateX(16px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Subtle Glow Atmosphere */
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

        /* Breathing "Tap gently to enter" Callout */
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

        /* Photorealistic Ring Breathing Float & Shimmer Glow */
        @keyframes ringFloatGlow {
          0% {
            transform: translateY(0px) scale(1.0);
            filter: drop-shadow(0 15px 35px rgba(241, 198, 90, 0.35));
          }
          50% {
            transform: translateY(-8px) scale(1.03);
            filter: drop-shadow(0 25px 50px rgba(241, 198, 90, 0.65));
          }
          100% {
            transform: translateY(0px) scale(1.0);
            filter: drop-shadow(0 15px 35px rgba(241, 198, 90, 0.35));
          }
        }

        .animate-rings-float-glow {
          animation: ringFloatGlow 5s ease-in-out infinite;
        }

        /* Slow Romantic Heart Reveal Opening Expansion (1.9s) */
        @keyframes heartStrokeExpand {
          0% {
            transform: scale(0.05);
            opacity: 0.95;
            stroke-width: 3px;
          }
          60% {
            transform: scale(14.0);
            opacity: 0.85;
            stroke-width: 1.2px;
          }
          100% {
            transform: scale(28.0);
            opacity: 0;
            stroke-width: 0.4px;
          }
        }

        .animate-ring-left {
          animation: ringLeftDraw 2.0s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .animate-ring-right {
          animation: ringRightDraw 2.0s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .animate-monogram-g {
          animation: monogramGFadeIn 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .animate-monogram-amp {
          animation: monogramAmpFadeIn 1.0s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .animate-monogram-c {
          animation: monogramCFadeIn 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .animate-atmosphere {
          animation: atmosphereGlow 4s ease-in-out infinite;
        }

        .animate-tap-float {
          animation: tapBreathFloat 2.6s ease-in-out infinite;
        }

        .animate-heart-stroke-expand {
          transform-origin: 160px 150px;
          animation: heartStrokeExpand 1.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-ring-left, .animate-ring-right, .animate-monogram-g, .animate-monogram-amp, .animate-monogram-c, .animate-tap-float, .animate-heart-stroke-expand {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* EXPANDING GOLDEN HEART REVEAL OUTLINE OVERLAY */}
      {isTransitioning && (
        <div className="fixed inset-0 z-[110] pointer-events-none flex items-center justify-center">
          <svg
            width="320"
            height="300"
            viewBox="0 0 320 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-80 h-75 overflow-visible"
          >
            <path
              d="M 160 270 C 160 270 45 175 45 92 C 45 45 88 35 124 68 C 142 84 160 102 160 102 C 160 102 178 84 196 68 C 232 35 275 45 275 92 C 275 175 160 270 160 270 Z"
              stroke="url(#bandGoldGrad)"
              strokeWidth="1.2"
              fill="none"
              filter="drop-shadow(0 0 10px rgba(245,230,190,0.5))"
              className="animate-heart-stroke-expand"
            />
          </svg>
        </div>
      )}

      {/* Atmospheric Sparkling Dust Particles Canvas */}
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

      {/* MAIN ANIMATION CONTAINER (STYLIZED 3D INTERLOCKING BANDS + SPACIOUS MONOGRAM G & C) */}
      <div
        className={`relative z-[20] flex flex-col items-center justify-center text-center px-4 w-full max-w-xl pointer-events-auto cursor-pointer transition-all duration-700 ${isTransitioning ? 'opacity-20 scale-95' : 'opacity-100'
          }`}
        onClick={handleSplashTap}
        onTouchEnd={handleSplashTap}
      >

        {/* PHOTOREALISTIC ANIMATED 3D RINGS WITH G & C MONOGRAM INSIDE THE RINGS */}
        <div className="relative flex flex-col items-center justify-center transition-all duration-1000">
          
          {/* Ring & Monogram Composite Stage with Floating Animation */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center pointer-events-none select-none animate-rings-float-glow">
            
            {/* Realistic 3D Interlocking Gold Rings Image */}
            <img
              src="/realistic-wedding-rings-transparent.png"
              alt="Realistic Interlocking Gold Wedding Rings with Solitaire Diamond"
              className="w-full h-full object-contain filter drop-shadow-[0_15px_40px_rgba(241,198,90,0.45)]"
            />

            {/* MONOGRAM G & C DIRECTLY INSIDE THE RINGS */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              
              {/* Letter G - Inside Left Gold Ring Center */}
              <span
                className={`absolute left-[31%] top-[50%] -translate-y-1/2 font-serif text-3xl sm:text-5xl font-light tracking-wide bg-gradient-to-br from-[#FFFFFF] via-[#FDE68A] to-[#D97706] bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] transition-all duration-1000 ${
                  animStage >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
              >
                G
              </span>

              {/* Symbol & - In Center Interlocking Overlap */}
              <span
                className={`absolute left-[48.5%] top-[51%] -translate-x-1/2 -translate-y-1/2 font-script text-xl sm:text-3xl italic text-[#FFF7E3] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] transition-all duration-1000 ${
                  animStage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
              >
                &amp;
              </span>

              {/* Letter C - Inside Right Solitaire Diamond Ring Center */}
              <span
                className={`absolute left-[64%] top-[53%] -translate-y-1/2 font-serif text-3xl sm:text-5xl font-light tracking-wide bg-gradient-to-br from-[#FFFFFF] via-[#FDE68A] to-[#D97706] bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] transition-all duration-1000 ${
                  animStage >= 5 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
              >
                C
              </span>

            </div>

          </div>

        </div>

        {/* ROMANTIC SPLASH TEXT REVEAL ("A beautiful story begins here." + "Tap gently to enter") */}
        <div
          className={`mt-5 flex flex-col items-center gap-3 transition-all duration-1000 ${animStage >= 7 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
        >
          {/* Main Romantic Message */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-serif tracking-[0.16em] sm:tracking-[0.2em] text-[#F5E6BE] font-light drop-shadow-[0_0_15px_rgba(245,230,190,0.35)] leading-tight px-2">
            A beautiful story begins here.
          </h2>

          {/* Interaction Instruction CTA with Generous Touch Padding & High Z-Index */}
          <div
            onClick={handleSplashTap}
            onTouchEnd={handleSplashTap}
            className={`animate-tap-float mt-1 flex flex-col items-center justify-center p-3 sm:p-4 cursor-pointer pointer-events-auto transition-all duration-1000 delay-500 ${animStage >= 7 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
              }`}
          >
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.3em] text-[#F5E6BE]/85 hover:text-[#FFF9EB] uppercase font-light italic drop-shadow-[0_0_12px_rgba(245,230,190,0.5)] transition-colors duration-300">
              Tap gently to enter
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
