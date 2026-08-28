import React, { useEffect, useState, useRef } from 'react';

/* ─────────────────────────────────────────────
   HELPERS & TYPES FOR CINEMATIC TWO HEARTS CANVAS
───────────────────────────────────────────── */
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

interface DustParticle {
  x: number; y: number; r: number;
  vx: number; vy: number;
  alpha: number; dir: number; speed: number;
}

interface BurstParticle {
  x: number; y: number;
  vx: number; vy: number;
  r: number; alpha: number; life: number; maxLife: number;
}

interface TrailPoint {
  x: number; y: number; alpha: number; r: number;
}

/* Draw elegant 3D Luminous Gold Heart on Canvas */
function drawGoldHeart(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  size: number, alpha: number, pulse: number
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  const scale = (size / 30) * pulse;
  ctx.scale(scale, scale);

  // Outer ambient glow
  const glowGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 35);
  glowGrad.addColorStop(0, 'rgba(210, 172, 94, 0.65)');
  glowGrad.addColorStop(0.4, 'rgba(194, 152, 69, 0.25)');
  glowGrad.addColorStop(1, 'rgba(194, 152, 69, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 35, 0, Math.PI * 2);
  ctx.fill();

  // Heart Path
  ctx.beginPath();
  ctx.moveTo(0, -7);
  ctx.bezierCurveTo(-5, -16, -16, -11, -16, 0);
  ctx.bezierCurveTo(-16, 10, -2, 18, 0, 22);
  ctx.bezierCurveTo(2, 18, 16, 10, 16, 0);
  ctx.bezierCurveTo(16, -11, 5, -16, 0, -7);
  ctx.closePath();

  // Gold 3D Gradient Fill
  const heartGrad = ctx.createLinearGradient(-10, -15, 10, 20);
  heartGrad.addColorStop(0, '#FFF3D1');
  heartGrad.addColorStop(0.3, '#E6C175');
  heartGrad.addColorStop(0.7, '#C29845');
  heartGrad.addColorStop(1, '#785214');

  ctx.fillStyle = heartGrad;
  ctx.shadowColor = 'rgba(210, 172, 94, 0.8)';
  ctx.shadowBlur = 18;
  ctx.fill();

  // Inner Highlight Rim
  ctx.strokeStyle = 'rgba(255, 248, 225, 0.75)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.restore();
}

/* ─────────────────────────────────────────────
   SPLASH SCREEN COMPONENT
───────────────────────────────────────────── */
export const SplashScreen: React.FC = () => {
  const [fadingOut, setFadingOut] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0); // 0: Dark, 1: Appear, 2: Merge, 3: Single, 4: Message, 5: Title
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // 1. MASTER TIMELINE & FAILSAFE EFFECT
  useEffect(() => {
    window.scrollTo(0, 0);
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

    // Timeline triggers
    const t1 = setTimeout(() => setSceneIndex(1), 1000);  // 1.0s: Two hearts appear
    const t2 = setTimeout(() => setSceneIndex(2), 3500);  // 3.5s: Hearts move together
    const t3 = setTimeout(() => setSceneIndex(3), 6500);  // 6.5s: Merge in center
    const t4 = setTimeout(() => setSceneIndex(4), 7800);  // 7.8s: "Two hearts. One beautiful journey."
    const t5 = setTimeout(() => setSceneIndex(5), 9800);  // 9.8s: "THE EDUAMOAH'S" & Date
    const tFade = setTimeout(() => setFadingOut(true), 11800); // 11.8s: Begin smooth dissolve
    const tComp = setTimeout(() => {                     // 13.0s: Unmount & unlock page
      setIsComplete(true);
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    }, 13000);

    // Hard Failsafe at 14.5s
    const tFail = setTimeout(() => {
      setFadingOut(true);
      setIsComplete(true);
      document.body.style.overflow = '';
    }, 14500);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5); clearTimeout(tFade);
      clearTimeout(tComp); clearTimeout(tFail);
      document.body.style.overflow = '';
    };
  }, []);

  // 2. ANIMATED CANVAS EFFECT (TWO HEARTS, TRAILS, PARTICLES, RIPPLE)
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
    const dustCount = isMobile ? 16 : 30;

    // Atmospheric Dust
    const dust: DustParticle[] = Array.from({ length: dustCount }, () => ({
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      r: rand(0.8, 2.2),
      vx: rand(-0.08, 0.08),
      vy: rand(-0.12, -0.04),
      alpha: rand(0.06, 0.28),
      dir: Math.random() > 0.5 ? 1 : -1,
      speed: rand(0.002, 0.005),
    }));

    const leftTrail: TrailPoint[] = [];
    const rightTrail: TrailPoint[] = [];
    let burstParticles: BurstParticle[] = [];
    let rippleRadius = 0;
    let rippleAlpha = 0;

    const startTime = performance.now();
    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 32;

    const tick = (now: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;

      const W = canvas.width;
      const H = canvas.height;
      const sec = (now - startTime) / 1000;
      ctx.clearRect(0, 0, W, H);

      /* ── 1. Atmospheric Dust ── */
      dust.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.alpha += p.dir * p.speed;
        if (p.alpha > 0.28 || p.alpha < 0.04) p.dir *= -1;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) { p.y = H; p.x = rand(0, W); }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(194, 152, 69, ${p.alpha.toFixed(3)})`;
        ctx.fill();
      });

      /* ── 2. Heart Calculations & Animation ── */
      const startXOffset = isMobile ? Math.min(W * 0.32, 130) : 220;
      const centerY = H * 0.44;
      const timeSec = sec;

      let leftX = W / 2 - startXOffset;
      let leftY = centerY + Math.sin(timeSec * 2.2) * 12;
      let rightX = W / 2 + startXOffset;
      let rightY = centerY + Math.cos(timeSec * 2.2) * 12;
      let heartAlpha = 0;
      let isMerged = false;

      // Stage 1: Fade in hearts (1.0s - 3.5s)
      if (sec >= 1.0 && sec < 3.5) {
        heartAlpha = Math.min((sec - 1.0) / 1.5, 1);
      }
      // Stage 2: Move together (3.5s - 6.5s)
      else if (sec >= 3.5 && sec < 6.5) {
        heartAlpha = 1;
        const moveT = Math.min((sec - 3.5) / 3.0, 1);
        const easeT = moveT < 0.5 ? 2 * moveT * moveT : -1 + (4 - 2 * moveT) * moveT; // cubic ease
        const currentDist = startXOffset * (1 - easeT);

        leftX = W / 2 - currentDist;
        leftY = centerY + Math.sin(timeSec * 2.5) * (12 * (1 - easeT * 0.7));
        rightX = W / 2 + currentDist;
        rightY = centerY + Math.cos(timeSec * 2.5) * (12 * (1 - easeT * 0.7));

        // Add Light Trails
        if (moveT > 0.05) {
          leftTrail.push({ x: leftX, y: leftY, alpha: 0.5, r: rand(1.5, 3) });
          rightTrail.push({ x: rightX, y: rightY, alpha: 0.5, r: rand(1.5, 3) });
        }
      }
      // Stage 3: Merge in center (6.5s - 7.8s)
      else if (sec >= 6.5 && sec < 7.8) {
        heartAlpha = Math.max(1 - (sec - 6.5) / 1.2, 0);
        leftX = W / 2;
        leftY = centerY;
        rightX = W / 2;
        rightY = centerY;
        isMerged = true;

        // Trigger Ripple & Burst at 6.5s
        if (rippleRadius === 0) {
          rippleRadius = 10;
          rippleAlpha = 0.8;
          burstParticles = Array.from({ length: 26 }, () => {
            const angle = rand(0, Math.PI * 2);
            const spd = rand(1.2, 3.8);
            return {
              x: W / 2, y: centerY,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              r: rand(1.5, 3.5),
              alpha: rand(0.7, 1.0),
              life: 0, maxLife: rand(30, 50),
            };
          });
        }
      }

      /* ── 3. Draw Light Trails ── */
      [leftTrail, rightTrail].forEach(trail => {
        for (let i = trail.length - 1; i >= 0; i--) {
          const pt = trail[i];
          pt.alpha -= 0.015;
          if (pt.alpha <= 0) {
            trail.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(210, 172, 94, ${pt.alpha.toFixed(2)})`;
          ctx.fill();
        }
      });

      /* ── 4. Draw Gold Ripple & Burst Particles ── */
      if (rippleAlpha > 0) {
        rippleRadius += 2.2;
        rippleAlpha -= 0.014;
        ctx.save();
        ctx.strokeStyle = `rgba(210, 172, 94, ${Math.max(rippleAlpha, 0).toFixed(2)})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(W / 2, centerY, rippleRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      burstParticles.forEach((p, idx) => {
        p.x += p.vx; p.y += p.vy;
        p.life++;
        p.alpha = Math.max(1 - p.life / p.maxLife, 0);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 193, 117, ${p.alpha.toFixed(2)})`;
        ctx.fill();
      });

      /* ── 5. Draw Hearts ── */
      if (heartAlpha > 0.01) {
        const pulseVal = 1 + Math.sin(timeSec * 3) * 0.04;
        if (!isMerged) {
          drawGoldHeart(ctx, leftX, leftY, 28, heartAlpha, pulseVal);
          drawGoldHeart(ctx, rightX, rightY, 28, heartAlpha, pulseVal);
        } else {
          // Merged golden heart pulsing & dissolving
          const mergePulse = 1 + Math.sin((sec - 6.5) * 6) * 0.08;
          drawGoldHeart(ctx, W / 2, centerY, 34, heartAlpha, mergePulse);
        }
      }
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
        /* Scene Glow */
        @keyframes candleGlow {
          0%   { opacity: 0; transform: scale(0.7); }
          50%  { opacity: 0.7; transform: scale(1.05); }
          100% { opacity: 0.5; transform: scale(1.00); }
        }

        /* Script Calligraphy Fade (Scene 4: ~7.8s) */
        @keyframes splashScriptLine1 {
          0%   { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashScriptLine2 {
          0%   { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Title & Date Fade (Scene 5: ~9.8s) */
        @keyframes splashTitleFade {
          0%   { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashDateReveal {
          0%   { opacity: 0; letter-spacing: 0.55em; }
          100% { opacity: 1; letter-spacing: 0.35em; }
        }
        @keyframes lineGrowH {
          0%   { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        .splash-glow {
          animation: candleGlow 2.2s ease-out 1.0s both;
        }

        .splash-script-1 {
          animation: splashScriptLine1 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        .splash-script-2 {
          animation: splashScriptLine2 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s both;
        }

        .splash-title-card {
          animation: splashTitleFade 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        .splash-accent-line {
          animation: lineGrowH 0.8s ease-out 0.3s both;
          transform-origin: center;
        }
        .splash-date {
          animation: splashDateReveal 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .splash-glow, .splash-script-1, .splash-script-2, .splash-title-card, .splash-date {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            letter-spacing: inherit !important;
          }
        }
      `}</style>

      {/* Background Canvas: Two Glowing Gold Hearts, Particle Trails & Dust */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Warm Ambient Golden Center Glow */}
      <div className="splash-glow absolute inset-0 z-[2] pointer-events-none flex items-center justify-center">
        <div className="w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(194,152,69,0.20)_0%,rgba(194,152,69,0.06)_50%,transparent_75%)] filter blur-3xl" />
      </div>

      {/* Typography Overlay (Triggered by sceneIndex >= 4) */}
      <div className="relative z-[10] max-w-lg md:max-w-xl mx-auto px-6 text-center flex flex-col items-center justify-center mt-32 md:mt-40">
        
        {/* Scene 4 (7.8s+): "Two hearts. One beautiful journey." */}
        {sceneIndex >= 4 && sceneIndex < 5 && (
          <div className="flex flex-col items-center justify-center">
            <span className="splash-script-1 font-script text-4xl sm:text-5xl text-[#D2AC5E] font-normal tracking-wide drop-shadow-md">
              Two hearts.
            </span>
            <span className="splash-script-2 font-script text-4xl sm:text-5xl text-[#D2AC5E] font-normal tracking-wide drop-shadow-md mt-2">
              One beautiful journey.
            </span>
          </div>
        )}

        {/* Scene 5 (9.8s+): "THE EDUAMOAH'S" Title Card & Date */}
        {sceneIndex >= 5 && (
          <div className="splash-title-card flex flex-col items-center justify-center">
            <span className="font-script text-2xl sm:text-3xl text-[#D2AC5E] mb-2">
              Becoming
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl tracking-[0.08em] text-[#FBF7EF] font-normal uppercase mb-3 text-shadow-hero whitespace-nowrap">
              THE EDUAMOAH'S
            </h1>
            <div className="splash-accent-line w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C29845] to-transparent my-3" />
            <div className="splash-date text-[#D2AC5E] text-xs sm:text-sm tracking-[0.35em] uppercase font-medium">
              DECEMBER 28, 2026
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
