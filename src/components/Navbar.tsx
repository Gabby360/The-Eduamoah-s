import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { weddingDetails } from '../mocks/weddingData';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'COUPLE', href: '#couple' },
    { name: 'OUR STORY', href: '#story' },
    { name: 'WEDDING', href: '#wedding' },
    { name: 'PROGRAM', href: '#program' },
    { name: 'GALLERY', href: '#gallery' },
    { name: 'RSVP', href: '#rsvp' },
    { name: 'LOCATION', href: '#location' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        @keyframes floatHeart {
          0%   { transform: translateY(0px) scale(0.85) rotate(0deg); opacity: 0.20; }
          50%  { transform: translateY(-25px) scale(1.15) rotate(12deg); opacity: 0.45; }
          100% { transform: translateY(-50px) scale(0.85) rotate(-12deg); opacity: 0.20; }
        }
        @keyframes heartPulseGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.12; }
          50%      { transform: translate(-50%, -50%) scale(1.2); opacity: 0.28; }
        }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0a1713]/90 backdrop-blur-md border-b border-[#f1c65a]/20 py-4 shadow-2xl shadow-black/50'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Monogram Logo */}
          <a
            href="#"
            className="font-script text-2xl md:text-3xl bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent hover:opacity-90 transition-opacity tracking-wide z-50 relative"
          >
            {weddingDetails.couple.coupleName}
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-medium tracking-[0.2em] text-[#BFAC90] hover:text-[#f1c65a] transition-colors duration-300 relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-[#f1c65a] to-[#e2b324] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-[#BFAC90] hover:text-[#f1c65a] p-2 focus:outline-none transition-all duration-300 z-50 relative flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            <div className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90 text-[#f1c65a]' : 'rotate-0'}`}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </div>
          </button>
        </div>
      </header>

      {/* ── SOLID FULL-SCREEN MOBILE NAVIGATION OVERLAY WITH LOVE ANIMATION ── */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-[#0a1713] flex flex-col justify-center items-center overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto scale-100'
            : 'opacity-0 pointer-events-none scale-95'
        }`}
      >
        {/* Subtle champagne radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(241,198,90,0.14)_0%,rgba(241,198,90,0.02)_60%,transparent_80%)] pointer-events-none" />

        {/* Gold border accent frame */}
        <div className="absolute inset-4 sm:inset-6 border border-[#f1c65a]/20 pointer-events-none" />

        {/* ── LOVE ANIMATION (Romantic Floating & Pulsing Hearts) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Big pulsing center heart glow */}
          <div className="absolute top-1/2 left-1/2 animate-[heartPulseGlow_4.5s_ease-in-out_infinite]">
            <Heart size={180} className="text-[#f1c65a]/30 fill-[#f1c65a]/15 filter blur-[1px]" />
          </div>
          {/* Floating gold hearts */}
          <div className="absolute top-1/6 left-8 animate-[floatHeart_5s_ease-in-out_infinite]">
            <Heart size={32} className="text-[#f1c65a]/45 fill-[#f1c65a]/35" />
          </div>
          <div className="absolute bottom-1/5 right-8 animate-[floatHeart_6s_ease-in-out_1.5s_infinite]">
            <Heart size={38} className="text-[#e2b324]/45 fill-[#e2b324]/35" />
          </div>
          <div className="absolute top-2/3 left-12 animate-[floatHeart_7s_ease-in-out_3s_infinite]">
            <Heart size={24} className="text-[#f1c65a]/35 fill-[#f1c65a]/25" />
          </div>
          <div className="absolute top-1/3 right-12 animate-[floatHeart_5.5s_ease-in-out_2s_infinite]">
            <Heart size={28} className="text-[#f1c65a]/40 fill-[#f1c65a]/30" />
          </div>
        </div>

        {/* Navigation Items (Clean & Focused) */}
        <div className="relative z-10 w-full max-w-sm px-8 text-center flex flex-col items-center justify-center">
          <div className="flex flex-col space-y-4 w-full">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="text-base font-medium tracking-[0.25em] text-[#FBF7EF] hover:text-[#f1c65a] transition-colors py-3 border-b border-[#f1c65a]/15 uppercase"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
