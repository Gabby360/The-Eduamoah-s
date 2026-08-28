import React, { useEffect, useState, useRef } from 'react';

/* ─────────────────────────────────────────────
   HELPERS & TYPES FOR CANVAS (PARTICLES & BUTTERFLIES)
───────────────────────────────────────────── */
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));

interface Particle {
  x: number; y: number; r: number;
  vx: number; vy: number;
  alpha: number; dir: number; speed: number;
}

type BDepth = 'fg' | 'mid' | 'bg';

interface SplashButterfly {
  startX: number; startY: number; endX: number; endY: number;
  cx: number; cy: number;
  wingPhase: number; wingSpd: number;
  glideTimer: number; glideDur: number; isGliding: boolean;
  wobble: number; wobbleSpd: number; wobbleAmp: number;
  curveSign: number;
  size: number; alpha: number; depth: BDepth;
  elapsed: number; duration: number;
  visible: boolean; revealAt: number;
}

const ZONES = [
  () => ({ startX: rand(0.02, 0.12), startY: rand(0.70, 0.90), endX: rand(0.06, 0.22), endY: rand(0.10, 0.30) }),
  () => ({ startX: rand(0.82, 0.96), startY: rand(0.70, 0.90), endX: rand(0.70, 0.88), endY: rand(0.08, 0.28) }),
  () => ({ startX: rand(0.02, 0.14), startY: rand(0.08, 0.25), endX: rand(0.16, 0.28), endY: rand(0.65, 0.85) }),
  () => ({ startX: rand(0.80, 0.96), startY: rand(0.08, 0.22), endX: rand(0.68, 0.84), endY: rand(0.68, 0.88) }),
  () => ({ startX: rand(0.15, 0.30), startY: rand(0.85, 0.96), endX: rand(0.68, 0.85), endY: rand(0.82, 0.95) }),
  () => ({ startX: rand(0.02, 0.14), startY: rand(0.40, 0.60), endX: rand(0.18, 0.28), endY: rand(0.12, 0.28) }),
  () => ({ startX: rand(0.84, 0.96), startY: rand(0.38, 0.58), endX: rand(0.68, 0.80), endY: rand(0.10, 0.26) }),
];

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

  const f = Math.abs(Math.sin(wingPhase));
  const w = size;

  const bodyDark = 'rgba(28,16,6,0.85)';
  const wingMain = depth === 'bg' ? 'rgba(38,22,8,0.60)' : 'rgba(44,25,8,0.72)';
  const wingAccent = depth === 'fg' ? 'rgba(160,110,40,0.38)' : 'rgba(120,75,25,0.25)';
  const wingStroke = 'rgba(90,55,15,0.20)';

  ctx.lineWidth = size < 14 ? 0.3 : 0.5;

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

  if (depth !== 'bg') {
    ctx.globalAlpha = alpha * 0.4;
    ctx.strokeStyle = wingAccent;
    ctx.lineWidth = size < 18 ? 0.4 : 0.6;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.bezierCurveTo(-w*f*0.5,-w*0.25,-w*0.6*f,-w*0.08,-w*0.55*f,w*0.14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,0); ctx.bezierCurveTo(w*f*0.5,-w*0.25,w*0.6*f,-w*0.08,w*0.55*f,w*0.14); ctx.stroke();
    ctx.globalAlpha = alpha;
  }

  ctx.strokeStyle = wingStroke;
  ctx.fillStyle = wingMain;
  ctx.beginPath(); ctx.moveTo(0,0);
  ctx.bezierCurveTo(-w*0.68*f,w*0.26,-w*0.82*f,w*0.68,-w*0.30*f,w*0.72);
  ctx.bezierCurveTo(-w*0.10*f,w*0.50,0,w*0.26,0,0);
  ctx.fill(); ctx.stroke();

  ctx.beginPath(); ctx.moveTo(0,0);
  ctx.bezierCurveTo(w*0.68*f,w*0.26,w*0.82*f,w*0.68,w*0.30*f,w*0.72);
  ctx.bezierCurveTo(w*0.10*f,w*0.50,0,w*0.26,0,0);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = bodyDark;
  ctx.beginPath(); ctx.ellipse(0,w*0.16,w*0.06,w*0.40,0,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
}

/* ─────────────────────────────────────────────
   SPLASH SCREEN COMPONENT
───────────────────────────────────────────── */
export const SplashScreen: React.FC = () => {
  const [fadingOut, setFadingOut] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // 1. MASTER TIMING & FAILSAFE EFFECT
  useEffect(() => {
    // Ensure we start at top of page
    window.scrollTo(0, 0);

    // Lock scrolling while splash is active
    document.body.style.overflow = 'hidden';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setFadingOut(true);
      const rTimer = setTimeout(() => {
        setIsComplete(true);
        document.body.style.overflow = '';
      }, 600);
      return () => clearTimeout(rTimer);
    }

    // 4.0s: Begin smooth dissolve/fade-out
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 4000);

    // 5.0s: Unmount completely & restore normal page behavior
    const completeTimer = setTimeout(() => {
      setIsComplete(true);
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    }, 5000);

    // 6.0s: ABSOLUTE FAILSAFE (Guarantees splash can NEVER get stuck)
    const failsafeTimer = setTimeout(() => {
      setFadingOut(true);
      setIsComplete(true);
      document.body.style.overflow = '';
    }, 6000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
      clearTimeout(failsafeTimer);
      document.body.style.overflow = '';
    };
  }, []);

  // 2. CANVAS ANIMATION EFFECT (INDEPENDENT)
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
    const PARTICLE_N = isMobile ? 12 : 24;

    const particles: Particle[] = Array.from({ length: PARTICLE_N }, () => ({
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      r: rand(0.8, 2.0),
      vx: rand(-0.08, 0.08),
      vy: rand(-0.14, -0.04),
      alpha: rand(0.05, 0.25),
      dir: Math.random() > 0.5 ? 1 : -1,
      speed: rand(0.0015, 0.004),
    }));

    const startTime = performance.now();
    const totalButterflies = isMobile ? 6 : 10;
    const depths: BDepth[] = isMobile
      ? ['fg', 'mid', 'mid', 'mid', 'bg', 'bg']
      : ['fg', 'fg', 'mid', 'mid', 'mid', 'mid', 'bg', 'bg', 'bg', 'bg'];

    const butterflies: SplashButterfly[] = Array.from({ length: totalButterflies }, (_, i) => {
      const depth = depths[i];
      const pathFn = ZONES[i % ZONES.length];
      const p = pathFn();
      const size = depth === 'fg' ? rand(24, 34) : depth === 'mid' ? rand(14, 22) : rand(10, 14);
      const alpha = depth === 'fg' ? rand(0.60, 0.80) : depth === 'mid' ? rand(0.35, 0.58) : rand(0.18, 0.35);

      return {
        ...p, cx: p.startX, cy: p.startY,
        wingPhase: rand(0, Math.PI * 2),
        wingSpd: rand(2.2, 3.8),
        glideTimer: 0, glideDur: rand(500, 1500), isGliding: false,
        wobble: rand(0, Math.PI * 2), wobbleSpd: rand(0.012, 0.028),
        wobbleAmp: rand(0.012, 0.026),
        curveSign: Math.random() > 0.5 ? 1 : -1,
        size, alpha, depth,
        elapsed: 0, duration: rand(10000, 16000),
        visible: false, revealAt: startTime + rand(2500 + i * 200, 3200 + i * 350),
      };
    });

    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 32;

    const tick = (now: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;

      const W = canvas.width;
      const H = canvas.height;
      const dt = 16;
      const elapsedSec = (now - startTime) / 1000;

      ctx.clearRect(0, 0, W, H);

      // Particles start fading in from Scene 2 (0.6s)
      if (elapsedSec > 0.6) {
        const globalParticleAlpha = Math.min((elapsedSec - 0.6) / 0.8, 1);
        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          p.alpha += p.dir * p.speed;
          if (p.alpha > 0.26 || p.alpha < 0.04) p.dir *= -1;
          if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
          if (p.y < 0) { p.y = H; p.x = rand(0, W); }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(194,152,69,${(p.alpha * globalParticleAlpha).toFixed(3)})`;
          ctx.fill();
        });
      }

      // Butterflies start appearing in Scene 6 (around 2.8s - 3.0s)
      butterflies.forEach(b => {
        if (!b.visible) {
          if (now > b.revealAt) b.visible = true;
          return;
        }

        b.elapsed += dt;
        b.glideTimer += dt;
        if (b.glideTimer > b.glideDur) {
          b.isGliding = !b.isGliding;
          b.glideDur = b.isGliding ? rand(300, 800) : rand(700, 2000);
          b.glideTimer = 0;
        }
        if (!b.isGliding) b.wingPhase += b.wingSpd * (dt / 1000);

        b.wobble += b.wobbleSpd;

        const t = Math.min(b.elapsed / b.duration, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const px = b.startX + (b.endX - b.startX) * ease;
        const py = b.startY + (b.endY - b.startY) * ease;
        const perpX = -(b.endY - b.startY);
        const perpY = (b.endX - b.startX);
        const wamt = (Math.sin(b.wobble) * 0.6 + Math.sin(b.wobble * 0.4 + 1.2) * 0.4) * b.wobbleAmp * b.curveSign;

        b.cx = px + perpX * wamt;
        b.cy = py + perpY * wamt;

        const dx = (b.endX + perpX * wamt * 0.15) - b.cx;
        const dy = (b.endY + perpY * wamt * 0.15) - b.cy;
        const heading = Math.atan2(dy * H, dx * W);

        const fade = Math.min(t * 5, 1) * Math.min((1 - t) * 5, 1);

        drawButterfly(ctx, b.cx * W, b.cy * H, b.size, b.wingPhase, b.alpha * fade, heading, b.depth);

        if (t >= 1) {
          const pathFn = ZONES[randInt(0, ZONES.length - 1)];
          const p2 = pathFn();
          Object.assign(b, {
            ...p2, cx: p2.startX, cy: p2.startY,
            elapsed: 0, visible: false,
            revealAt: now + rand(2000, 6000),
            duration: rand(10000, 16000),
            wingPhase: rand(0, Math.PI * 2),
            wobble: rand(0, Math.PI * 2),
          });
        }
      });
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isComplete]);

  if (isComplete) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#0B0907] flex items-center justify-center overflow-hidden transition-opacity duration-1000 ease-in-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <style>{`
        /* Scene 2: Candlelight Glow Blooming (0.6s - 1.2s) */
        @keyframes candleGlow {
          0%   { opacity: 0; transform: scale(0.7); }
          50%  { opacity: 0.65; transform: scale(1.05); }
          100% { opacity: 0.50; transform: scale(1.00); }
        }

        /* Scene 3: Elegant Gold Frame Draw (1.2s - 1.9s) */
        @keyframes frameExpand {
          0%   { opacity: 0; transform: scale(0.75); }
          100% { opacity: 1; transform: scale(1.00); }
        }
        @keyframes lineDrawH {
          0%   { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes lineDrawV {
          0%   { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }

        /* Scene 4: Calligraphy Fade Up (1.7s - 2.5s) */
        @keyframes splashScriptFade1 {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashScriptFade2 {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Scene 5: Main Title & Date Reveal (2.4s - 3.2s) */
        @keyframes splashTitleFade {
          0%   { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashDateReveal {
          0%   { opacity: 0; letter-spacing: 0.55em; }
          100% { opacity: 1; letter-spacing: 0.35em; }
        }

        .splash-glow {
          animation: candleGlow 1.8s ease-out 0.6s both;
        }

        .splash-frame-box {
          animation: frameExpand 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s both;
        }
        .splash-line-top, .splash-line-bottom {
          transform-origin: center;
          animation: lineDrawH 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.3s both;
        }
        .splash-line-left, .splash-line-right {
          transform-origin: center;
          animation: lineDrawV 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.3s both;
        }

        .splash-script-1 {
          animation: splashScriptFade1 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.7s both;
        }
        .splash-script-2 {
          animation: splashScriptFade2 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.1s both;
        }
        .splash-accent-line {
          animation: lineDrawH 0.7s ease-out 2.3s both;
          transform-origin: center;
        }
        .splash-title {
          animation: splashTitleFade 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.4s both;
        }
        .splash-date {
          animation: splashDateReveal 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.9s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .splash-glow, .splash-frame-box, .splash-line-top, .splash-line-bottom,
          .splash-line-left, .splash-line-right, .splash-script-1, .splash-script-2,
          .splash-title, .splash-date {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            letter-spacing: inherit !important;
          }
        }
      `}</style>

      {/* Background Canvas: Floating particles & delicate butterflies */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Scene 2: Candlelight Warm Glow Bloom in Center */}
      <div className="splash-glow absolute inset-0 z-[2] pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(194,152,69,0.22)_0%,rgba(194,152,69,0.08)_45%,transparent_70%)] filter blur-3xl" />
      </div>

      {/* Central Invitation Content & Frame */}
      <div className="relative z-[10] max-w-lg md:max-w-xl mx-auto px-8 text-center flex flex-col items-center justify-center">
        {/* Scene 3: Elegant Minimalist Gold Frame */}
        <div className="splash-frame-box relative p-8 md:p-12 w-full flex flex-col items-center justify-center">
          {/* Top Line */}
          <div className="splash-line-top absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#C29845]/60 to-transparent" />
          {/* Bottom Line */}
          <div className="splash-line-bottom absolute bottom-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#C29845]/60 to-transparent" />
          {/* Left Line */}
          <div className="splash-line-left absolute inset-y-8 left-0 w-[1px] bg-gradient-to-b from-transparent via-[#C29845]/40 to-transparent" />
          {/* Right Line */}
          <div className="splash-line-right absolute inset-y-8 right-0 w-[1px] bg-gradient-to-b from-transparent via-[#C29845]/40 to-transparent" />

          {/* Frame Corner Accents */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#C29845]/50" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#C29845]/50" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#C29845]/50" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#C29845]/50" />

          {/* Scene 4: Romantic Calligraphy Script */}
          <div className="flex flex-col items-center justify-center mb-3">
            <span className="splash-script-1 font-script text-3xl sm:text-4xl text-[#D2AC5E] font-normal tracking-wide drop-shadow-md">
              Two hearts.
            </span>
            <span className="splash-script-2 font-script text-3xl sm:text-4xl text-[#D2AC5E] font-normal tracking-wide drop-shadow-md mt-1">
              One beautiful journey.
            </span>
          </div>

          {/* Gold Accent Divider */}
          <div className="splash-accent-line w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C29845] to-transparent my-4" />

          {/* Scene 5: Main Title */}
          <h1 className="splash-title font-heading text-2xl sm:text-4xl md:text-5xl tracking-[0.08em] text-[#FBF7EF] font-normal uppercase mb-3 text-shadow-hero whitespace-nowrap">
            THE EDUAMOAH'S
          </h1>

          {/* Scene 5: Wedding Date */}
          <div className="splash-date text-[#D2AC5E] text-xs sm:text-sm tracking-[0.35em] uppercase font-medium mt-1">
            DECEMBER 28, 2026
          </div>
        </div>
      </div>
    </div>
  );
};
