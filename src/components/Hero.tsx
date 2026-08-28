import React, { useEffect, useRef } from 'react';
import { weddingDetails } from '../mocks/weddingData';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));

interface Particle { x: number; y: number; r: number; vx: number; vy: number; alpha: number; dir: number; speed: number; }
interface Petal    { x: number; y: number; size: number; rot: number; rotSpd: number; vx: number; vy: number; alpha: number; startAt: number; active: boolean; }
type BDepth = 'fg' | 'mid' | 'bg';
interface Butterfly {
  startX: number; startY: number; endX: number; endY: number;
  cx: number; cy: number;
  wingPhase: number; wingSpd: number;
  glideTimer: number; glideDur: number; isGliding: boolean;
  wobble: number; wobbleSpd: number; wobbleAmp: number;
  curveSign: number; // +1 or -1 for S-curve variation
  size: number; alpha: number; depth: BDepth;
  elapsed: number; duration: number;
  visible: boolean; revealAt: number;
}

/* 12 edge/corner zones avoiding central text safe-zone (x:30-70%, y:20-80%) */
const ZONES = [
  () => ({ startX: rand(0.01,0.10), startY: rand(0.75,0.95), endX: rand(0.05,0.22), endY: rand(0.08,0.28) }), // left-bottom → upper-left
  () => ({ startX: rand(0.80,0.97), startY: rand(0.72,0.93), endX: rand(0.68,0.88), endY: rand(0.06,0.26) }), // right-bottom → upper-right
  () => ({ startX: rand(0.01,0.10), startY: rand(0.05,0.22), endX: rand(0.18,0.30), endY: rand(0.65,0.85) }), // upper-left → lower-mid
  () => ({ startX: rand(0.82,0.98), startY: rand(0.05,0.20), endX: rand(0.70,0.85), endY: rand(0.68,0.88) }), // upper-right → lower-right
  () => ({ startX: rand(0.15,0.30), startY: rand(0.88,0.98), endX: rand(0.70,0.88), endY: rand(0.80,0.96) }), // lower-left → lower-right (stays low)
  () => ({ startX: rand(0.02,0.14), startY: rand(0.40,0.60), endX: rand(0.20,0.30), endY: rand(0.12,0.28) }), // mid-left → upper
  () => ({ startX: rand(0.86,0.98), startY: rand(0.38,0.58), endX: rand(0.70,0.82), endY: rand(0.10,0.26) }), // mid-right → upper
  () => ({ startX: rand(0.22,0.30), startY: rand(0.03,0.14), endX: rand(0.04,0.16), endY: rand(0.50,0.70) }), // upper-left area → mid-left
  () => ({ startX: rand(0.70,0.80), startY: rand(0.03,0.14), endX: rand(0.84,0.97), endY: rand(0.48,0.68) }), // upper-right area → mid-right
  () => ({ startX: rand(0.04,0.18), startY: rand(0.62,0.78), endX: rand(0.22,0.30), endY: rand(0.82,0.95) }), // left-mid → lower-left
  () => ({ startX: rand(0.72,0.88), startY: rand(0.60,0.76), endX: rand(0.80,0.96), endY: rand(0.80,0.94) }), // right-mid → lower-right
  () => ({ startX: rand(0.40,0.58), startY: rand(0.91,0.99), endX: rand(0.10,0.25), endY: rand(0.72,0.88) }), // bottom-center → lower-left
];

function newPath() {
  return ZONES[randInt(0, ZONES.length - 1)]();
}

function mkButterflies(mobile: boolean, now: number): Butterfly[] {
  const total = mobile ? 6 : 10;
  // depth distribution: 3 fg, 5 mid, 4 bg (mobile: 2/2/2)
  const depths: BDepth[] = mobile
    ? ['fg','fg','mid','mid','bg','bg']
    : ['fg','fg','fg','mid','mid','mid','mid','mid','bg','bg','bg','bg'];

  return Array.from({ length: total }, (_, i) => {
    const depth = depths[i];
    const p = newPath();
    // Reduced by ~45-50% for delicate, subtle, romantic aesthetic
    const size = mobile
      ? (depth === 'fg' ? rand(11,15) : depth === 'mid' ? rand(6,10) : rand(4,7))
      : (depth === 'fg' ? rand(14,20) : depth === 'mid' ? rand(8,12) : rand(5,8));
    const alpha = depth === 'fg' ? rand(0.60,0.80) : depth === 'mid' ? rand(0.35,0.58) : rand(0.18,0.38);
    const dur   = depth === 'fg' ? rand(11000,18000) : depth === 'mid' ? rand(14000,22000) : rand(17000,26000);
    const delay = rand(i * 800, i * 800 + rand(1500, 5000));
    return {
      ...p, cx: p.startX, cy: p.startY,
      wingPhase: rand(0, Math.PI * 2),
      wingSpd: rand(2.2, 4.0),
      glideTimer: 0, glideDur: rand(600, 1800), isGliding: false,
      wobble: rand(0, Math.PI * 2), wobbleSpd: rand(0.012, 0.030),
      wobbleAmp: rand(0.012, 0.030),
      curveSign: Math.random() > 0.5 ? 1 : -1,
      size, alpha, depth,
      elapsed: 0, duration: dur,
      visible: false, revealAt: now + delay,
    };
  });
}

/* Draw butterfly — dark silhouette with warm gold highlights, no ctx.filter */
function drawButterfly(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number,
  wingPhase: number, alpha: number,
  heading: number, depth: BDepth
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(heading - Math.PI / 2);

  const f = Math.abs(Math.sin(wingPhase)); // 0 = closed, 1 = open
  const w = size;

  // Dark silhouette base — warm dark brown, not bright gold
  const bodyDark   = 'rgba(28,16,6,0.82)';
  const wingMain   = depth === 'bg' ? 'rgba(38,22,8,0.65)' : 'rgba(42,24,8,0.72)';
  const wingAccent = depth === 'fg' ? 'rgba(160,110,40,0.40)' : 'rgba(120,75,25,0.28)';
  const wingStroke = 'rgba(90,55,15,0.20)';

  ctx.lineWidth = size < 14 ? 0.3 : 0.6;

  // ── upper wings ──
  ctx.strokeStyle = wingStroke;
  ctx.fillStyle = wingMain;
  ctx.beginPath(); ctx.moveTo(0,0);
  ctx.bezierCurveTo(-w*f,-w*0.52,-w*1.08*f,-w*0.20,-w*0.88*f,w*0.26);
  ctx.bezierCurveTo(-w*0.40*f,w*0.16,0,w*0.06,0,0);
  ctx.fill(); ctx.stroke();

  ctx.beginPath(); ctx.moveTo(0,0);
  ctx.bezierCurveTo(w*f,-w*0.52,w*1.08*f,-w*0.20,w*0.88*f,w*0.26);
  ctx.bezierCurveTo(w*0.40*f,w*0.16,0,w*0.06,0,0);
  ctx.fill(); ctx.stroke();

  // warm gold vein highlight on upper wing (fg/mid only)
  if (depth !== 'bg') {
    ctx.globalAlpha = alpha * 0.45;
    ctx.strokeStyle = wingAccent;
    ctx.lineWidth = size < 18 ? 0.4 : 0.7;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.bezierCurveTo(-w*f*0.5,-w*0.25,-w*0.6*f,-w*0.08,-w*0.55*f,w*0.14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,0); ctx.bezierCurveTo(w*f*0.5,-w*0.25,w*0.6*f,-w*0.08,w*0.55*f,w*0.14); ctx.stroke();
    ctx.globalAlpha = alpha;
  }

  // ── lower wings ──
  ctx.strokeStyle = wingStroke;
  ctx.fillStyle = wingMain;
  ctx.lineWidth = size < 14 ? 0.3 : 0.5;
  ctx.beginPath(); ctx.moveTo(0,0);
  ctx.bezierCurveTo(-w*0.68*f,w*0.26,-w*0.82*f,w*0.68,-w*0.30*f,w*0.72);
  ctx.bezierCurveTo(-w*0.10*f,w*0.50,0,w*0.26,0,0);
  ctx.fill(); ctx.stroke();

  ctx.beginPath(); ctx.moveTo(0,0);
  ctx.bezierCurveTo(w*0.68*f,w*0.26,w*0.82*f,w*0.68,w*0.30*f,w*0.72);
  ctx.bezierCurveTo(w*0.10*f,w*0.50,0,w*0.26,0,0);
  ctx.fill(); ctx.stroke();

  // ── body ──
  ctx.fillStyle = bodyDark;
  ctx.beginPath(); ctx.ellipse(0,w*0.16,w*0.060,w*0.40,0,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
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
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef     = useRef<number>(0);
  const activeRef  = useRef(false);   // pause when off-screen
  const lastFrame  = useRef(0);       // throttle to ~30fps
  const dataRef    = useRef<{
    particles: Particle[];
    petals: Petal[];
    butterflies: Butterfly[];
    startTime: number;
  } | null>(null);

  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    if (prefersReduced) return;

    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const PARTICLE_N = isMobile ? 14 : 22;
    const PETAL_N    = isMobile ? 2  : 4;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const now = performance.now();
    const particles: Particle[] = Array.from({ length: PARTICLE_N }, () => ({
      x: rand(0, canvas.width), y: rand(0, canvas.height),
      r: rand(0.7, 2.0),
      vx: rand(-0.10, 0.10), vy: rand(-0.16, -0.05),
      alpha: rand(0.06, 0.28), dir: Math.random() > 0.5 ? 1 : -1, speed: rand(0.0018, 0.005),
    }));

    const startTime = now;
    const petals: Petal[] = Array.from({ length: PETAL_N }, () => ({
      x: rand(0, canvas.width), y: rand(-100, -10),
      size: rand(5, 10), rot: rand(0,360), rotSpd: rand(-0.5, 0.5),
      vx: rand(-0.25, 0.25), vy: rand(0.22, 0.58),
      alpha: rand(0.10, 0.30),
      startAt: now + rand(0, 8000), active: false,
    }));

    dataRef.current = {
      particles, petals,
      butterflies: mkButterflies(isMobile, now),
      startTime,
    };

    /* ── visibility — pause RAF when hero scrolled away ── */
    const io = new IntersectionObserver(
      ([e]) => { activeRef.current = e.isIntersecting; },
      { threshold: 0.01 }
    );
    io.observe(section);

    const FRAME_INTERVAL = 1000 / 32; // ~32fps max

    const tick = (ts: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (!activeRef.current) return;                  // paused off-screen
      if (ts - lastFrame.current < FRAME_INTERVAL) return; // throttled
      lastFrame.current = ts;

      const d = dataRef.current!;
      const W = canvas.width, H = canvas.height;
      const dt = 16; // fixed step

      ctx.clearRect(0, 0, W, H);

      /* particles */
      d.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.alpha += p.dir * p.speed;
        if (p.alpha > 0.28 || p.alpha < 0.04) p.dir *= -1;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) { p.y = H; p.x = rand(0, W); }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(194,152,69,${p.alpha.toFixed(3)})`;
        ctx.fill();
      });

      /* petals */
      d.petals.forEach(p => {
        if (!p.active) { if (ts > p.startAt) p.active = true; return; }
        p.x += p.vx; p.y += p.vy; p.rot += p.rotSpd;
        if (p.y > H + 20) {
          p.y = rand(-80,-10); p.x = rand(0, W);
          p.startAt = ts + rand(5000, 14000); p.active = false;
        }
        drawPetal(ctx, p);
      });

      /* butterflies */
      d.butterflies.forEach(b => {
        if (!b.visible) { if (ts > b.revealAt) b.visible = true; return; }

        b.elapsed += dt;

        // Wing flutter with occasional glide pause
        b.glideTimer += dt;
        if (b.glideTimer > b.glideDur) {
          b.isGliding = !b.isGliding;
          b.glideDur = b.isGliding ? rand(300, 900) : rand(800, 2200);
          b.glideTimer = 0;
        }
        if (!b.isGliding) b.wingPhase += b.wingSpd * (dt / 1000);

        b.wobble += b.wobbleSpd;

        const t    = Math.min(b.elapsed / b.duration, 1);
        // Ease in-out for smooth start/end
        const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

        // Primary lerp path
        const px = b.startX + (b.endX - b.startX) * ease;
        const py = b.startY + (b.endY - b.startY) * ease;

        // Perpendicular S-curve offset — makes path feel natural, not straight
        const perpX = -(b.endY - b.startY);
        const perpY =  (b.endX - b.startX);
        // Double sine for organic S-curve
        const wamt = (Math.sin(b.wobble) * 0.6 + Math.sin(b.wobble * 0.4 + 1.2) * 0.4) * b.wobbleAmp * b.curveSign;

        b.cx = px + perpX * wamt;
        b.cy = py + perpY * wamt;

        // Heading follows actual movement direction
        const dx = (b.endX + perpX * wamt * 0.15) - b.cx;
        const dy = (b.endY + perpY * wamt * 0.15) - b.cy;
        const heading = Math.atan2(dy * H, dx * W);

        // Fade in at start, fade out at end
        const fade = Math.min(t * 6, 1) * Math.min((1-t) * 6, 1);

        drawButterfly(ctx, b.cx * W, b.cy * H, b.size, b.wingPhase, b.alpha * fade, heading, b.depth);

        if (t >= 1) {
          const p2 = newPath();
          const newDur = b.depth === 'fg' ? rand(10000,18000) : b.depth === 'mid' ? rand(13000,22000) : rand(16000,26000);
          Object.assign(b, {
            ...p2, cx: p2.startX, cy: p2.startY,
            elapsed: 0, visible: false,
            revealAt: ts + rand(4000, 14000),
            duration: newDur,
            wingPhase: rand(0, Math.PI * 2),
            wobble: rand(0, Math.PI * 2),
            glideTimer: 0, glideDur: rand(600,1800), isGliding: false,
            curveSign: Math.random() > 0.5 ? 1 : -1,
          });
        }
      });
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      io.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0907]"
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
        @keyframes lineGrow {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1);  opacity: 1; }
        }
        @keyframes goldReveal {
          from { opacity: 0; letter-spacing: 0.5em; }
          to   { opacity: 1; letter-spacing: 0.35em; }
        }
        .hero-ken-burns {
          animation: kenBurns 24s ease-in-out infinite;
          transform-origin: center center;
          will-change: transform;
        }
        .hero-line-top    { transform-origin: center; animation: lineGrow    1.1s cubic-bezier(.25,.46,.45,.94) 0.4s  both; }
        .hero-becoming    {                            animation: heroFadeUp  1.1s cubic-bezier(.25,.46,.45,.94) 0.9s  both; }
        .hero-title       {                            animation: heroFadeUp  1.1s cubic-bezier(.25,.46,.45,.94) 1.5s  both; }
        .hero-line-bottom { transform-origin: center; animation: lineGrow    1.1s cubic-bezier(.25,.46,.45,.94) 1.9s  both; }
        .hero-tagline     {                            animation: heroFadeIn  1.2s ease-out                      2.3s  both; }
        .hero-date        {                            animation: goldReveal  1.4s cubic-bezier(.25,.46,.45,.94) 2.8s  both; }
        @media (prefers-reduced-motion: reduce) {
          .hero-ken-burns,.hero-line-top,.hero-becoming,.hero-title,
          .hero-line-bottom,.hero-tagline,.hero-date {
            animation: none !important; opacity: 1 !important;
            transform: none !important; letter-spacing: inherit !important;
          }
        }
      `}</style>

      {/* Background with Ken Burns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={weddingDetails.couple.heroImage}
          alt={weddingDetails.couple.coupleName}
          className="hero-ken-burns w-full h-full object-cover object-[50%_22%] md:object-[50%_25%] lg:object-[50%_28%] filter brightness-[0.78] contrast-[1.2] sepia-[35%] hue-rotate-[-10deg] saturate-[1.15]"
        />
        <div className="absolute inset-0 bg-[#C29845]/25 mix-blend-color pointer-events-none" />
        <div className="absolute inset-0 bg-[#372A14]/40 mix-blend-multiply pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#0B0907] via-[#0B0907]/70 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-[#0B0907] via-[#0B0907]/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#0B0907] via-[#0B0907]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#0B0907] via-[#0B0907]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0B0907_95%)] opacity-85 pointer-events-none" />
      </div>

      {/* Canvas — particles, butterflies, petals */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Hero Text Content — unchanged */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16 flex flex-col items-center justify-center min-h-screen">
        <div className="hero-line-top w-16 h-[1px] bg-[#C29845] mb-4 mx-auto" />
        <span className="hero-becoming font-script text-4xl sm:text-5xl md:text-6xl text-[#D2AC5E] mb-1 font-normal tracking-wide drop-shadow-md">
          Becoming
        </span>
        <h1 className="hero-title font-heading text-2xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[0.06em] md:tracking-[0.12em] text-[#FBF7EF] font-normal uppercase mb-4 text-shadow-hero whitespace-nowrap">
          {weddingDetails.couple.coupleName}
        </h1>
        <div className="hero-line-bottom w-28 h-[1px] bg-gradient-to-r from-transparent via-[#C29845] to-transparent mb-6" />
        <p className="hero-tagline font-heading italic text-lg sm:text-xl md:text-2xl text-[#FBF7EF] font-light mb-6 text-shadow-hero">
          {weddingDetails.hero.tagline}
        </p>
        <div className="hero-date text-[#D2AC5E] text-xs sm:text-sm md:text-base tracking-[0.35em] uppercase font-medium">
          {weddingDetails.wedding.date}
        </div>
      </div>
    </section>
  );
};
