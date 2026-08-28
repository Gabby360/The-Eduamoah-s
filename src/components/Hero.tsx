import React, { useEffect, useRef, useMemo } from 'react';
import { weddingDetails } from '../mocks/weddingData';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Particle {
  x: number; y: number; r: number;
  vx: number; vy: number; alpha: number;
  alphaDir: number; alphaSpeed: number;
}

interface Petal {
  x: number; y: number; size: number;
  rot: number; rotSpeed: number;
  vx: number; vy: number; alpha: number;
  delay: number; active: boolean;
}

interface Butterfly {
  // base position & path params
  cx: number; cy: number;      // current canvas x/y (0-1 relative)
  angle: number;                // heading
  speed: number;
  wobble: number; wobbleSpeed: number;
  wingPhase: number; wingSpeed: number;
  size: number;
  blur: number;                 // 0-2 (far) or 0 (close)
  alpha: number;
  visible: boolean;
  delay: number;                // initial off-screen delay ms
  elapsed: number;              // ms since last reveal
  duration: number;             // ms per crossing
  startX: number; startY: number;
  endX: number; endY: number;
  // keep butterflies out of the central 30% horizontally, top 55% vertically (text zone)
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));

/** Returns a butterfly start/end that avoids the central text safe-zone:
 *  safe-zone: x 35%–65%, y 25%–80%                                      */
function safeButterflyPath(index: number): Pick<Butterfly, 'startX' | 'startY' | 'endX' | 'endY'> {
  // Three preset corridors around the edges, randomised slightly
  const corridors = [
    // left edge: start bottom-left, end upper-left/center-left
    { startX: rand(0.01, 0.12), startY: rand(0.72, 0.92), endX: rand(0.08, 0.28), endY: rand(0.10, 0.35) },
    // right edge: start lower-right, end upper-right
    { startX: rand(0.78, 0.96), startY: rand(0.68, 0.90), endX: rand(0.65, 0.88), endY: rand(0.08, 0.32) },
    // far background: cross from upper-left to lower-right at small scale
    { startX: rand(0.02, 0.18), startY: rand(0.08, 0.25), endX: rand(0.30, 0.45), endY: rand(0.55, 0.75) },
  ];
  const c = corridors[index % corridors.length];
  return { startX: c.startX, startY: c.startY, endX: c.endX, endY: c.endY };
}

function initButterflies(isMobile: boolean): Butterfly[] {
  const count = isMobile ? 2 : 3;
  return Array.from({ length: count }, (_, i) => {
    const path = safeButterflyPath(i);
    const isBackground = i === 2;
    return {
      ...path,
      cx: path.startX, cy: path.startY,
      angle: Math.atan2(path.endY - path.startY, path.endX - path.startX),
      speed: rand(0.00008, 0.00015),
      wobble: 0, wobbleSpeed: rand(0.018, 0.03),
      wingPhase: rand(0, Math.PI * 2),
      wingSpeed: rand(2.5, 4.0),
      size: isBackground ? rand(10, 14) : rand(16, 22),
      blur: isBackground ? rand(1.2, 2.0) : rand(0, 0.8),
      alpha: isBackground ? rand(0.25, 0.45) : rand(0.45, 0.70),
      visible: false,
      delay: rand(i * 2200, i * 2200 + 3500),
      elapsed: 0,
      duration: rand(18000, 28000),
    };
  });
}

function initParticles(count: number, w: number, h: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: rand(0, w), y: rand(0, h),
    r: rand(0.8, 2.2),
    vx: rand(-0.12, 0.12), vy: rand(-0.18, -0.06),
    alpha: rand(0.08, 0.32),
    alphaDir: Math.random() > 0.5 ? 1 : -1,
    alphaSpeed: rand(0.002, 0.006),
  }));
}

function initPetals(count: number, w: number): Petal[] {
  return Array.from({ length: count }, () => ({
    x: rand(0, w), y: rand(-120, -20),
    size: rand(5, 11),
    rot: rand(0, 360),
    rotSpeed: rand(-0.6, 0.6),
    vx: rand(-0.3, 0.3),
    vy: rand(0.25, 0.65),
    alpha: rand(0.12, 0.35),
    delay: rand(0, 8000),
    active: false,
  }));
}

/* ─────────────────────────────────────────────
   DRAW BUTTERFLY (SVG path via Path2D)
───────────────────────────────────────────── */
function drawButterfly(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number,
  wingAngle: number, // 0 open, 1 closed
  alpha: number, blur: number,
  heading: number
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  if (blur > 0) ctx.filter = `blur(${blur}px)`;
  ctx.translate(x, y);
  ctx.rotate(heading - Math.PI / 2);

  const w = size;
  const fold = Math.abs(Math.sin(wingAngle)); // 0–1 wing openness

  // upper wings
  ctx.fillStyle = 'rgba(194,152,69,0.55)';
  ctx.strokeStyle = 'rgba(120,80,20,0.3)';
  ctx.lineWidth = 0.5;

  // left upper wing
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-w * fold, -w * 0.5, -w * 1.1 * fold, -w * 0.2, -w * 0.9 * fold, w * 0.3);
  ctx.bezierCurveTo(-w * 0.4 * fold, w * 0.2, 0, w * 0.1, 0, 0);
  ctx.fill(); ctx.stroke();

  // right upper wing
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(w * fold, -w * 0.5, w * 1.1 * fold, -w * 0.2, w * 0.9 * fold, w * 0.3);
  ctx.bezierCurveTo(w * 0.4 * fold, w * 0.2, 0, w * 0.1, 0, 0);
  ctx.fill(); ctx.stroke();

  // lower wings (slightly smaller)
  ctx.fillStyle = 'rgba(180,130,50,0.40)';
  // left lower
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-w * 0.7 * fold, w * 0.3, -w * 0.85 * fold, w * 0.75, -w * 0.3 * fold, w * 0.8);
  ctx.bezierCurveTo(-w * 0.1 * fold, w * 0.55, 0, w * 0.3, 0, 0);
  ctx.fill(); ctx.stroke();

  // right lower
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(w * 0.7 * fold, w * 0.3, w * 0.85 * fold, w * 0.75, w * 0.3 * fold, w * 0.8);
  ctx.bezierCurveTo(w * 0.1 * fold, w * 0.55, 0, w * 0.3, 0, 0);
  ctx.fill(); ctx.stroke();

  // body
  ctx.fillStyle = 'rgba(80,50,10,0.65)';
  ctx.beginPath();
  ctx.ellipse(0, w * 0.2, w * 0.07, w * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* ─────────────────────────────────────────────
   PETAL DRAW
───────────────────────────────────────────── */
function drawPetal(ctx: CanvasRenderingContext2D, p: Petal) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rot * Math.PI) / 180);
  ctx.fillStyle = 'rgba(210,172,94,0.55)';
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ─────────────────────────────────────────────
   HERO COMPONENT
───────────────────────────────────────────── */
export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const butterfliesRef = useRef<Butterfly[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const petalsRef = useRef<Petal[]>([]);
  const prefersReduced = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  /* ── canvas animation loop ── */
  useEffect(() => {
    if (prefersReduced.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 18 : 32;
    const PETAL_COUNT = isMobile ? 2 : 4;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    butterfliesRef.current = initButterflies(isMobile);
    particlesRef.current = initParticles(PARTICLE_COUNT, canvas.width, canvas.height);
    petalsRef.current = initPetals(PETAL_COUNT, canvas.width);

    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* ── PARTICLES ── */
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaDir * p.alphaSpeed;
        if (p.alpha >= 0.32 || p.alpha <= 0.04) p.alphaDir *= -1;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) { p.y = H; p.x = rand(0, W); }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(194,152,69,${p.alpha.toFixed(3)})`;
        ctx.fill();
      });

      /* ── PETALS ── */
      petalsRef.current.forEach(p => {
        if (!p.active) {
          if (elapsed > p.delay) p.active = true;
          return;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        if (p.y > H + 20) {
          p.y = rand(-80, -20);
          p.x = rand(0, W);
          p.delay = elapsed + rand(4000, 12000);
          p.active = false;
        }
        drawPetal(ctx, p);
      });

      /* ── BUTTERFLIES ── */
      butterfliesRef.current.forEach(b => {
        if (!b.visible) {
          if (elapsed > b.delay) b.visible = true;
          return;
        }

        b.elapsed += 16; // ~60fps tick
        b.wingPhase += (b.wingSpeed * 0.016);
        b.wobble += b.wobbleSpeed;

        // lerp along path with natural wobble
        const t = Math.min(b.elapsed / b.duration, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const px = b.startX + (b.endX - b.startX) * ease;
        const py = b.startY + (b.endY - b.startY) * ease;

        // perpendicular wobble amplitude
        const perpX = -(b.endY - b.startY);
        const perpY = (b.endX - b.startX);
        const wobbleAmt = Math.sin(b.wobble) * 0.025;

        b.cx = px + perpX * wobbleAmt;
        b.cy = py + perpY * wobbleAmt;

        // recalculate heading
        const dx = (b.endX + perpX * wobbleAmt * 0.1) - b.cx;
        const dy = (b.endY + perpY * wobbleAmt * 0.1) - b.cy;
        const heading = Math.atan2(dy * H, dx * W);

        // fade in/out at journey edges
        const fadeIn = Math.min(t * 5, 1);
        const fadeOut = Math.min((1 - t) * 5, 1);
        const alphaMultiplier = fadeIn * fadeOut;

        drawButterfly(
          ctx,
          b.cx * W,
          b.cy * H,
          b.size,
          b.wingPhase,
          b.alpha * alphaMultiplier,
          b.blur,
          heading
        );

        // reset after journey
        if (t >= 1) {
          const path = safeButterflyPath(randInt(0, 2));
          Object.assign(b, {
            ...path,
            cx: path.startX, cy: path.startY,
            elapsed: 0,
            visible: false,
            delay: elapsed + rand(5000, 14000),
            duration: rand(18000, 28000),
            wingPhase: rand(0, Math.PI * 2),
            wobbleSpeed: rand(0.018, 0.03),
            speed: rand(0.00008, 0.00015),
          });
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0907]">
      {/* ── CSS keyframes ── */}
      <style>{`
        /* Ken Burns – very slow, barely noticeable */
        @keyframes kenBurns {
          0%   { transform: scale(1.00) translate(0,0); }
          50%  { transform: scale(1.035) translate(-0.6%, 0.4%); }
          100% { transform: scale(1.00) translate(0,0); }
        }
        /* Text stagger entrance */
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        /* Gold line draw */
        @keyframes lineGrow {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
        /* Gold date reveal */
        @keyframes goldReveal {
          from { opacity: 0; letter-spacing: 0.5em; }
          to   { opacity: 1; letter-spacing: 0.35em; }
        }

        .hero-ken-burns {
          animation: kenBurns 22s ease-in-out infinite;
          transform-origin: center center;
        }
        .hero-line-top {
          transform-origin: center;
          animation: lineGrow 1.1s cubic-bezier(0.25,0.46,0.45,0.94) 0.4s both;
        }
        .hero-becoming {
          animation: heroFadeUp 1.1s cubic-bezier(0.25,0.46,0.45,0.94) 0.9s both;
        }
        .hero-title {
          animation: heroFadeUp 1.1s cubic-bezier(0.25,0.46,0.45,0.94) 1.5s both;
        }
        .hero-line-bottom {
          transform-origin: center;
          animation: lineGrow 1.1s cubic-bezier(0.25,0.46,0.45,0.94) 1.9s both;
        }
        .hero-tagline {
          animation: heroFadeIn 1.2s ease-out 2.3s both;
        }
        .hero-date {
          animation: goldReveal 1.4s cubic-bezier(0.25,0.46,0.45,0.94) 2.8s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-ken-burns,
          .hero-line-top,
          .hero-becoming,
          .hero-title,
          .hero-line-bottom,
          .hero-tagline,
          .hero-date {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            letter-spacing: inherit !important;
          }
        }
      `}</style>

      {/* ── Background Image with Ken Burns + existing filters ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={weddingDetails.couple.heroImage}
          alt={weddingDetails.couple.coupleName}
          className="hero-ken-burns w-full h-full object-cover object-[50%_22%] md:object-[50%_25%] lg:object-[50%_28%] filter brightness-[0.78] contrast-[1.2] sepia-[35%] hue-rotate-[-10deg] saturate-[1.15]"
        />
        {/* Warm Golden/Amber Champagne Tint Overlay — untouched */}
        <div className="absolute inset-0 bg-[#C29845]/25 mix-blend-color pointer-events-none" />
        <div className="absolute inset-0 bg-[#372A14]/40 mix-blend-multiply pointer-events-none" />
        {/* Top Edge Dark Gradient — untouched */}
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#0B0907] via-[#0B0907]/70 to-transparent pointer-events-none" />
        {/* Bottom Edge Dark Gradient — untouched */}
        <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-[#0B0907] via-[#0B0907]/80 to-transparent pointer-events-none" />
        {/* Left Side Dark Gradient — untouched */}
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#0B0907] via-[#0B0907]/60 to-transparent pointer-events-none" />
        {/* Right Side Dark Gradient — untouched */}
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#0B0907] via-[#0B0907]/60 to-transparent pointer-events-none" />
        {/* Radial Center Vignette — untouched */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0B0907_95%)] opacity-85 pointer-events-none" />
      </div>

      {/* ── Canvas: particles + butterflies + petals (above bg, below text) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Hero Central Content — same layout, same classes, same text ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16 flex flex-col items-center justify-center min-h-screen">

        {/* Short Top Gold Line Accent */}
        <div className="hero-line-top w-16 h-[1px] bg-[#C29845] mb-4 mx-auto" />

        {/* Script Subheading */}
        <span className="hero-becoming font-script text-4xl sm:text-5xl md:text-6xl text-[#D2AC5E] mb-1 font-normal tracking-wide drop-shadow-md">
          Becoming
        </span>

        {/* Main Heading */}
        <h1 className="hero-title font-heading text-2xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[0.06em] md:tracking-[0.12em] text-[#FBF7EF] font-normal uppercase mb-4 text-shadow-hero whitespace-nowrap">
          {weddingDetails.couple.coupleName}
        </h1>

        {/* Bottom Gold Line Accent */}
        <div className="hero-line-bottom w-28 h-[1px] bg-gradient-to-r from-transparent via-[#C29845] to-transparent mb-6" />

        {/* Tagline */}
        <p className="hero-tagline font-heading italic text-lg sm:text-xl md:text-2xl text-[#FBF7EF] font-light mb-6 text-shadow-hero">
          {weddingDetails.hero.tagline}
        </p>

        {/* Date */}
        <div className="hero-date text-[#D2AC5E] text-xs sm:text-sm md:text-base tracking-[0.35em] uppercase font-medium">
          {weddingDetails.wedding.date}
        </div>

      </div>
    </section>
  );
};
