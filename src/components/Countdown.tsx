import React, { useState, useEffect, useRef } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/* Helper to compute exact time remaining */
function getTimeRemaining(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/* Unit Card component with digit roll animation & blur transition */
interface UnitCardProps {
  label: string;
  value: number;
  isLocked: boolean;
  rollingValue: number;
  isChanging: boolean;
  isLast?: boolean;
}

const UnitCard: React.FC<UnitCardProps> = ({
  label,
  value,
  isLocked,
  rollingValue,
  isChanging,
  isLast = false,
}) => {
  const displayVal = isLocked ? value : rollingValue;
  const formatted = String(displayVal).padStart(2, '0');

  return (
    <div
      className={`relative py-6 px-3 text-center flex flex-col items-center justify-center ${
        !isLast ? 'md:border-r border-[#f1c65a]/25' : ''
      }`}
    >
      {/* Number Display Container */}
      <div className="relative overflow-hidden min-h-[4rem] sm:min-h-[5.5rem] md:min-h-[6.5rem] flex items-center justify-center">
        <span
          className={`font-heading text-5xl sm:text-7xl md:text-8xl font-normal block transition-all duration-300 ${
            isLast ? 'bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-shadow-hero' : 'text-[#FBF7EF]'
          } ${
            !isLocked
              ? 'blur-[1.5px] scale-105 opacity-80 animate-pulse'
              : isChanging
              ? 'blur-[1px] translate-y-[-6px] transition-transform duration-300'
              : 'blur-0 translate-y-0 scale-100'
          }`}
          style={{ willChange: 'transform, filter, opacity' }}
        >
          {formatted}
        </span>
      </div>

      {/* Label */}
      <span className="text-[#A69272] text-[10px] sm:text-xs tracking-[0.3em] uppercase font-medium mt-3 block">
        {label}
      </span>

      {/* Gold Accent Indicator when locked */}
      <div
        className={`w-6 h-[1px] bg-gradient-to-r from-[#f1c65a] to-[#e2b324] mt-2 transition-all duration-500 ${
          isLocked ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
      />
    </div>
  );
};

export const Countdown: React.FC = () => {
  // Wedding Target Date: OCTOBER 10, 2026
  const targetDate = useRef(new Date('2026-10-10T14:00:00'));

  const [realTime, setRealTime] = useState<TimeLeft>(() => getTimeRemaining(targetDate.current));
  const [displayed, setDisplayed] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [locked, setLocked] = useState({ days: false, hours: false, minutes: false, seconds: false });
  const [changing, setChanging] = useState({ days: false, hours: false, minutes: false, seconds: false });
  const [hasRevealed, setHasRevealed] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const prevRealTime = useRef<TimeLeft>(realTime);

  // 1. Intersection Observer for viewport trigger
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setHasRevealed(true);
      setLocked({ days: true, hours: true, minutes: true, seconds: true });
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealed) {
          setHasRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [hasRevealed]);

  // 2. Rolling Introductory Animation when revealed
  useEffect(() => {
    if (!hasRevealed) return;

    const target = getTimeRemaining(targetDate.current);
    setRealTime(target);

    // Staggered rolling sequences for each unit
    // DAYS (0.3s -> 1.8s)
    const runRolling = (
      unit: keyof TimeLeft,
      startDelay: number,
      duration: number,
      finalVal: number
    ) => {
      setTimeout(() => {
        const intervalTime = 60;
        const steps = Math.floor(duration / intervalTime);
        let step = 0;

        const timer = setInterval(() => {
          step++;
          if (step < steps) {
            // Generate intermediate rolling numbers
            const progress = step / steps;
            const pseudo = Math.floor(progress * finalVal + (Math.random() * 20 - 10));
            setDisplayed(prev => ({
              ...prev,
              [unit]: Math.max(0, pseudo),
            }));
          } else {
            clearInterval(timer);
            setDisplayed(prev => ({ ...prev, [unit]: finalVal }));
            setLocked(prev => ({ ...prev, [unit]: true }));
          }
        }, intervalTime);
      }, startDelay);
    };

    runRolling('days', 300, 1500, target.days);
    runRolling('hours', 700, 1500, target.hours);
    runRolling('minutes', 1100, 1500, target.minutes);
    runRolling('seconds', 1500, 1500, target.seconds);
  }, [hasRevealed]);

  // 3. Live Interval Updates after intro
  useEffect(() => {
    const interval = setInterval(() => {
      const latest = getTimeRemaining(targetDate.current);

      // Detect changed units for roll transition
      if (locked.seconds) {
        setChanging({
          days: latest.days !== prevRealTime.current.days,
          hours: latest.hours !== prevRealTime.current.hours,
          minutes: latest.minutes !== prevRealTime.current.minutes,
          seconds: latest.seconds !== prevRealTime.current.seconds,
        });

        // Reset changing blur after 300ms
        setTimeout(() => {
          setChanging({ days: false, hours: false, minutes: false, seconds: false });
        }, 300);
      }

      prevRealTime.current = latest;
      setRealTime(latest);
      if (locked.days) setDisplayed(latest);
    }, 1000);

    return () => clearInterval(interval);
  }, [locked]);

  return (
    <section
      ref={sectionRef}
      className="py-12 bg-[#11221c] border-y border-[#f1c65a]/20 relative overflow-hidden"
    >
      {/* Background Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(241,198,90,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">

        {/* Section Header */}
        <div
          className={`transition-all duration-1000 ease-out ${
            hasRevealed ? 'opacity-100 translateY-0' : 'opacity-0 translateY-6'
          }`}
        >
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs font-semibold tracking-[0.35em] uppercase block mb-2">
            COUNTDOWN
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em] mb-8">
            Until We Say I Do
          </h2>
        </div>

        {/* Digital Counter Grid */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 items-center justify-center transition-all duration-1000 delay-300 ${
            hasRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <UnitCard
            label="DAYS"
            value={realTime.days}
            rollingValue={displayed.days}
            isLocked={locked.days}
            isChanging={changing.days}
          />
          <UnitCard
            label="HOURS"
            value={realTime.hours}
            rollingValue={displayed.hours}
            isLocked={locked.hours}
            isChanging={changing.hours}
          />
          <UnitCard
            label="MINUTES"
            value={realTime.minutes}
            rollingValue={displayed.minutes}
            isLocked={locked.minutes}
            isChanging={changing.minutes}
          />
          <UnitCard
            label="SECONDS"
            value={realTime.seconds}
            rollingValue={displayed.seconds}
            isLocked={locked.seconds}
            isChanging={changing.seconds}
            isLast={true}
          />
        </div>

        {/* Bottom Date Subtitle */}
        <div
          className={`mt-12 text-[#A69272] text-xs tracking-[0.25em] uppercase font-mono transition-all duration-1000 delay-700 ${
            hasRevealed ? 'opacity-100' : 'opacity-0'
          }`}
        >
          10TH OCTOBER 2026 • KASOA, GHANA
        </div>

      </div>
    </section>
  );
};
