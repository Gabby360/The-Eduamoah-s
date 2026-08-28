import React, { useState, useEffect } from 'react';

export const Countdown: React.FC = () => {
  const targetDate = new Date('2026-10-10T14:00:00');

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-[#141110] border-y border-[#C29845]/20 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        
        {/* Tag & Title */}
        <span className="text-[#C29845] text-xs font-medium tracking-[0.3em] uppercase block mb-2">
          COUNTDOWN
        </span>
        <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em] mb-4">
          Until We Say I Do
        </h2>
        <div className="w-16 h-[1px] bg-[#C29845] mx-auto mb-12" />

        {/* Live Counter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 items-center justify-center">
          
          {/* Days */}
          <div className="md:border-r border-[#C29845]/30 py-4 px-2">
            <span className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#FBF7EF] font-normal block mb-2">
              {timeLeft.days}
            </span>
            <span className="text-[#A69272] text-xs tracking-[0.25em] uppercase font-medium">
              DAYS
            </span>
          </div>

          {/* Hours */}
          <div className="md:border-r border-[#C29845]/30 py-4 px-2">
            <span className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#FBF7EF] font-normal block mb-2">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[#A69272] text-xs tracking-[0.25em] uppercase font-medium">
              HOURS
            </span>
          </div>

          {/* Minutes */}
          <div className="md:border-r border-[#C29845]/30 py-4 px-2">
            <span className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#FBF7EF] font-normal block mb-2">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[#A69272] text-xs tracking-[0.25em] uppercase font-medium">
              MINUTES
            </span>
          </div>

          {/* Seconds */}
          <div className="py-4 px-2">
            <span className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#D2AC5E] font-normal block mb-2 animate-pulse-glow">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[#A69272] text-xs tracking-[0.25em] uppercase font-medium">
              SECONDS
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
