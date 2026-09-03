import React, { useEffect, useRef } from 'react';
import { weddingDetails } from '../mocks/weddingData';
import { MusicPlayer } from './MusicPlayer';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

interface AmbientParticle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  dir: number;
  speed: number;
}

interface GlowingDust {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  pulseSpeed: number;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  rot: number;
  rotSpd: number;
  vx: number;
  vy: number;
  alpha: number;
  startAt: number;
  active: boolean;
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Petal) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rot * Math.PI) / 180);
  ctx.fillStyle = 'rgba(210,172,94,0.50)';
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size * 0.38, p.size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ─────────────────────────────────────────────
   HERO COMPONENT
───────────────────────────────────────────── */
export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);
  const lastFrame = useRef(0);

  const dataRef = useRef<{
    particles: AmbientParticle[];
    glowingDust: GlowingDust[];
    petals: Petal[];
  } | null>(null);

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  useEffect(() => {
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const AMBIENT_N = isMobile ? 12 : 20;
    const GLOWING_DUST_N = isMobile ? 25 : 45;
    const PETAL_N = isMobile ? 2 : 4;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const now = performance.now();

    // Ambient floating particles
    const particles: AmbientParticle[] = Array.from({ length: AMBIENT_N }, () => ({
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      r: rand(0.8, 2.2),
      vx: rand(-0.10, 0.10),
      vy: rand(-0.16, -0.05),
      alpha: rand(0.06, 0.28),
      dir: Math.random() > 0.5 ? 1 : -1,
      speed: rand(0.0018, 0.005),
    }));

    // Tiny glowing gold dust / embers rising specifically from the bottom gradient area
    const glowingDust: GlowingDust[] = Array.from({ length: GLOWING_DUST_N }, () => ({
      x: rand(0, canvas.width),
      y: rand(canvas.height * 0.45, canvas.height + 20),
      r: rand(0.8, 2.5),
      vx: rand(-0.25, 0.25),
      vy: rand(-0.45, -0.15),
      alpha: rand(0.1, 0.7),
      maxAlpha: rand(0.5, 0.95),
      pulseSpeed: rand(0.008, 0.025),
    }));

    // Soft falling gold petals
    const petals: Petal[] = Array.from({ length: PETAL_N }, () => ({
      x: rand(0, canvas.width),
      y: rand(-100, -10),
      size: rand(5, 10),
      rot: rand(0, 360),
      rotSpd: rand(-0.5, 0.5),
      vx: rand(-0.25, 0.25),
      vy: rand(0.22, 0.58),
      alpha: rand(0.10, 0.30),
      startAt: now + rand(0, 8000),
      active: false,
    }));

    dataRef.current = {
      particles,
      glowingDust,
      petals,
    };

    const io = new IntersectionObserver(
      ([e]) => {
        activeRef.current = e.isIntersecting;
      },
      { threshold: 0.01 }
    );
    io.observe(section);

    const FRAME_INTERVAL = 1000 / 32;

    const tick = (ts: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (!activeRef.current) return;
      if (ts - lastFrame.current < FRAME_INTERVAL) return;
      lastFrame.current = ts;

      const d = dataRef.current!;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      /* 1. Ambient Particles */
      d.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.dir * p.speed;
        if (p.alpha > 0.28 || p.alpha < 0.04) p.dir *= -1;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) {
          p.y = H;
          p.x = rand(0, W);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(241,198,90,${p.alpha.toFixed(3)})`;
        ctx.fill();
      });

      /* 2. Tiny Luminous Gold Dust / Embers Rising from Bottom Gradient */
      d.glowingDust.forEach((gd) => {
        gd.x += gd.vx;
        gd.y += gd.vy;
        gd.alpha += Math.sin(ts * gd.pulseSpeed) * 0.015;

        // Reset when moving above middle-upper section or boundary
        if (gd.y < H * 0.25 || gd.x < -10 || gd.x > W + 10) {
          gd.y = rand(H * 0.65, H + 20);
          gd.x = rand(0, W);
          gd.alpha = rand(0.1, 0.4);
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(gd.x, gd.y, gd.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(241,198,90,${Math.max(0.05, Math.min(gd.alpha, gd.maxAlpha)).toFixed(3)})`;
        ctx.shadowColor = 'rgba(241,198,90,0.8)';
        ctx.shadowBlur = gd.r * 3;
        ctx.fill();
        ctx.restore();
      });

      /* 3. Falling Petals */
      d.petals.forEach((p) => {
        if (!p.active) {
          if (ts > p.startAt) p.active = true;
          return;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpd;
        if (p.y > H + 20) {
          p.y = rand(-80, -10);
          p.x = rand(0, W);
          p.startAt = ts + rand(5000, 14000);
          p.active = false;
        }
        drawPetal(ctx, p);
      });
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      io.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a1713]"
    >
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1.00); }
          50%  { transform: scale(1.032) translate(-0.5%, 0.3%); }
          100% { transform: scale(1.00); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        .hero-ken-burns {
          animation: kenBurns 24s ease-in-out infinite;
          transform-origin: center center;
          will-change: transform;
        }
        .hero-becoming    { animation: heroFadeUp 1.1s cubic-bezier(.25,.46,.45,.94) 0.3s both; }
        .hero-title       { animation: heroFadeUp 1.1s cubic-bezier(.25,.46,.45,.94) 0.6s both; }
        .hero-line-bottom { transform-origin: center center; }
        .hero-tagline     { animation: heroFadeIn 1.2s ease-out 0.8s both; }

        @media (prefers-reduced-motion: reduce) {
          .hero-ken-burns, .hero-becoming, .hero-title,
          .hero-line-bottom, .hero-tagline {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>

      {/* Background with Ken Burns - Original Untouched Photo */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={weddingDetails.couple.heroImage}
          alt={weddingDetails.couple.coupleName}
          className="hero-ken-burns w-full h-full object-cover object-[50%_25%] lg:object-[50%_50%]"
        />
        {/* Top subtle shade for navbar legibility */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#0a1713]/80 via-[#0a1713]/40 to-transparent pointer-events-none" />
        {/* Bottom Dark Gradient Overlay — Seamless full bottom coverage on mobile & desktop */}
        <div className="absolute bottom-0 inset-x-0 h-[60%] md:h-[50%] bg-gradient-to-t from-[#0a1713] via-[#0a1713]/85 via-[#0a1713]/40 to-transparent pointer-events-none" />
      </div>

      {/* Canvas — particles, glowing dust/embers, petals */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Hero Text Content — Lowered slightly toward bottom */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-36 pb-16 flex flex-col items-center justify-end min-h-screen">
        {/* Static Script "Becoming" Calligraphy — Shifted 28px downward for natural balance */}
        <span className="hero-becoming font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent inline-block py-2 px-4 leading-normal overflow-visible z-10 font-normal tracking-wide drop-shadow-md translate-y-7">
          Becoming
        </span>

        {/* Static Heading for "THE EDUAMOAH'S" — 100% Viewport Centered */}
        <h1 className="hero-title font-heading text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl tracking-[0.06em] md:tracking-[0.1em] text-[#FBF7EF] font-normal uppercase text-shadow-hero mb-4 leading-none text-center z-10">
          {weddingDetails.couple.coupleName}
        </h1>

        <p className="hero-tagline font-heading italic text-lg sm:text-xl md:text-2xl text-[#FBF7EF] font-light mb-6 text-shadow-hero">
          {weddingDetails.hero.tagline}
        </p>
      </div>
    </section>
  );
};
