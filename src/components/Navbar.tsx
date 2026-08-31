import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { weddingDetails } from '../mocks/weddingData';
import { MusicPlayer } from './MusicPlayer';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileState, setMobileState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');

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
    { name: 'GIFTS', href: '#gifts' },
    { name: 'LOCATION', href: '#location' },
  ];

  // Open & Close Mobile Menu with Heart Portal Expansion Sequence
  const toggleMobileMenu = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (mobileState === 'closed') {
      if (prefersReduced) {
        setMobileState('open');
        return;
      }
      setMobileState('opening');
      setTimeout(() => {
        setMobileState('open');
      }, 750);
    } else if (mobileState === 'open') {
      if (prefersReduced) {
        setMobileState('closed');
        return;
      }
      setMobileState('closing');
      setTimeout(() => {
        setMobileState('closed');
      }, 700);
    }
  };

  const handleLinkClick = (href: string) => {
    toggleMobileMenu();
    const target = document.querySelector(href);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }
  };

  const isOpen = mobileState === 'opening' || mobileState === 'open';
  const isTransitioning = mobileState === 'opening' || mobileState === 'closing';

  return (
    <>
      {/* SVG Responsive Heart Clip-Path Mask Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="heart-portal-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0.18 C 0.33,-0.06 0,0.08 0,0.36 C 0,0.62 0.5,0.88 0.5,0.98 C 0.5,0.88 1,0.62 1,0.36 C 1,0.08 0.67,-0.06 0.5,0.18 Z" />
          </clipPath>
        </defs>
      </svg>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#0a1713] ${
          isScrolled
            ? 'border-b border-[#f1c65a]/30 py-4 shadow-2xl shadow-black/80'
            : 'border-b border-[#f1c65a]/10 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Monogram Logo & Beside-Logo Music Control */}
          <div className="flex items-center gap-3 sm:gap-4 z-50 relative">
            <a
              href="#"
              className="font-script text-2xl md:text-3xl bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent hover:opacity-90 transition-opacity tracking-wide relative z-50"
            >
              {weddingDetails.couple.coupleName}
            </a>

            {/* Music Control Bar Beside "THE EDUAMOAH'S" */}
            <MusicPlayer />
          </div>

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

          {/* Mobile Menu Button with Animated Hamburger & Heart Badge Accent */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-[#BFAC90] hover:text-[#f1c65a] p-2 focus:outline-none transition-all duration-300 z-50 relative flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#f1c65a]' : 'rotate-0'}`}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </div>

            {/* Glowing Heart Indicator Badge during transition */}
            {isTransitioning && (
              <div className="absolute -inset-1 flex items-center justify-center pointer-events-none animate-ping opacity-75">
                <Heart size={32} className="text-[#f1c65a] fill-[#f1c65a]/40" />
              </div>
            )}
          </button>
        </div>
      </header>

      {/* ── MOBILE HEART PORTAL NAVIGATION OVERLAY ── */}
      {mobileState !== 'closed' && (
        <div
          className={`lg:hidden fixed inset-0 z-40 flex flex-col justify-center items-center overflow-hidden transition-colors duration-500 ${
            mobileState === 'open' ? 'bg-[#0a1713] pointer-events-auto' : 'pointer-events-auto'
          }`}
        >
          {/* Heart-Shaped Expanding / Contracting Mask Layer */}
          <div
            className={`absolute inset-0 bg-[#0a1713] border-4 border-[#f1c65a]/40 shadow-2xl transition-all ease-out ${
              mobileState === 'opening'
                ? 'animate-heart-expand'
                : mobileState === 'open'
                ? 'scale-[8] opacity-100'
                : 'animate-heart-contract'
            }`}
            style={{
              clipPath: 'url(#heart-portal-clip)',
              transformOrigin: '90% 40px', // Centers heart portal expansion on top-right menu button
              willChange: 'transform, opacity',
            }}
          >
            {/* Champagne Glow inside Heart Portal */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(241,198,90,0.25)_0%,rgba(241,198,90,0.05)_60%,transparent_80%)]" />
          </div>

          {/* Keyframes for Heart Portal Animation */}
          <style>{`
            @keyframes heartExpand {
              0%   { transform: scale(0.05); opacity: 0.2; }
              30%  { transform: scale(0.45); opacity: 0.85; }
              75%  { transform: scale(2.8); opacity: 0.95; }
              100% { transform: scale(8.0); opacity: 1.0; }
            }
            @keyframes heartContract {
              0%   { transform: scale(8.0); opacity: 1.0; }
              35%  { transform: scale(2.8); opacity: 0.9; }
              75%  { transform: scale(0.3); opacity: 0.6; }
              100% { transform: scale(0.0); opacity: 0.0; }
            }
            @keyframes navLinkFadeUp {
              from { opacity: 0; transform: translateY(16px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .animate-heart-expand {
              animation: heartExpand 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            .animate-heart-contract {
              animation: heartContract 0.70s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
            }
            .animate-nav-link {
              animation: navLinkFadeUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
          `}</style>

          {/* Navigation Links (Clean & Focused) */}
          <div
            className={`relative z-10 w-full max-w-sm px-8 text-center flex flex-col items-center justify-center transition-opacity duration-300 ${
              mobileState === 'open' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex flex-col space-y-4 w-full">
              {navLinks.map((link, idx) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className={`text-base font-medium tracking-[0.25em] text-[#FBF7EF] hover:text-[#f1c65a] transition-colors py-3 border-b border-[#f1c65a]/15 uppercase ${
                    mobileState === 'open' ? 'animate-nav-link' : ''
                  }`}
                  style={{ animationDelay: `${idx * 50 + 100}ms` }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
