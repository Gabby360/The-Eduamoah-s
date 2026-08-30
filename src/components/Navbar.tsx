import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { weddingDetails } from '../mocks/weddingData';

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
    { name: 'OUR STORY', href: '#story' },
    { name: 'COUPLE', href: '#couple' },
    { name: 'WEDDING', href: '#wedding' },
    { name: 'PROGRAM', href: '#program' },
    { name: 'GALLERY', href: '#gallery' },
    { name: 'RSVP', href: '#rsvp' },
    { name: 'LOCATION', href: '#location' },
  ];

  // Open Mobile Menu with Heart Portal Expansion Sequence
  const toggleMobileMenu = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (mobileState === 'closed') {
      if (prefersReduced) {
        setMobileState('open');
        return;
      }
      setMobileState('opening');
      // Step 1: Small heart pops (0-0.3s) -> Step 2: Expands (0.3-1.0s) -> Step 3: Open (1.1s)
      setTimeout(() => {
        setMobileState('open');
      }, 1000);
    } else if (mobileState === 'open') {
      if (prefersReduced) {
        setMobileState('closed');
        return;
      }
      setMobileState('closing');
      // Step 1: Links retract (0-0.3s) -> Step 2: Heart contracts (0.3-0.9s) -> Step 3: Closed (1.0s)
      setTimeout(() => {
        setMobileState('closed');
      }, 900);
    }
  };

  const handleLinkClick = (href: string) => {
    toggleMobileMenu();
    // Smooth scroll to target section
    const target = document.querySelector(href);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
      }, 400);
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

          {/* Mobile Menu Button with Animated Hamburger & Heart Icon Accent */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-[#BFAC90] hover:text-[#f1c65a] p-2 focus:outline-none transition-all duration-300 z-50 relative flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#f1c65a]' : 'rotate-0'}`}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </div>

            {/* Small Glowing Heart Badge Indicator near button during trigger */}
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
          className={`lg:hidden fixed inset-0 z-40 flex flex-col justify-center items-center overflow-hidden transition-all duration-700 ${
            mobileState === 'opening'
              ? 'pointer-events-auto'
              : mobileState === 'open'
              ? 'pointer-events-auto'
              : 'pointer-events-none'
          }`}
        >
          {/* Heart-Shaped Expanding / Contracting Mask Layer */}
          <div
            className={`absolute inset-0 bg-[#0a1713] border-4 border-[#f1c65a]/40 shadow-2xl transition-all ease-out ${
              mobileState === 'opening'
                ? 'animate-heart-expand'
                : mobileState === 'open'
                ? 'scale-[3.5] opacity-100'
                : 'animate-heart-contract'
            }`}
            style={{
              clipPath: 'url(#heart-portal-clip)',
              transformOrigin: '90% 40px', // Centers expansion on top-right menu button
              willChange: 'transform, opacity',
            }}
          >
            {/* Background Champagne Glow inside Heart Portal */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(241,198,90,0.25)_0%,rgba(241,198,90,0.05)_60%,transparent_80%)]" />
          </div>

          {/* Inline Keyframe Styles for Heart Expand & Contract */}
          <style>{`
            @keyframes heartExpand {
              0%   { transform: scale(0.05); opacity: 0.2; }
              20%  { transform: scale(0.35); opacity: 0.8; }
              70%  { transform: scale(2.2); opacity: 0.95; }
              100% { transform: scale(3.5); opacity: 1.0; }
            }
            @keyframes heartContract {
              0%   { transform: scale(3.5); opacity: 1.0; }
              40%  { transform: scale(1.8); opacity: 0.9; }
              80%  { transform: scale(0.3); opacity: 0.6; }
              100% { transform: scale(0.0); opacity: 0.0; }
            }
            @keyframes navLinkFadeUp {
              from { opacity: 0; transform: translateY(16px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .animate-heart-expand {
              animation: heartExpand 0.95s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            .animate-heart-contract {
              animation: heartContract 0.85s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
            }
            .animate-nav-link {
              animation: navLinkFadeUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
          `}</style>

          {/* Navigation Items (Visible when Heart Portal opens) */}
          <div
            className={`relative z-10 w-full max-w-sm px-8 text-center flex flex-col items-center justify-center space-y-5 transition-opacity duration-500 ${
              mobileState === 'open' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Small Monogram Logo inside Menu */}
            <div className="font-script text-3xl bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent mb-2 drop-shadow-md">
              {weddingDetails.couple.coupleName}
            </div>

            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#f1c65a] via-[#e2b324] to-transparent mb-2" />

            {/* Navigation Links */}
            <div className="flex flex-col space-y-4 w-full">
              {navLinks.map((link, idx) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className={`text-sm font-medium tracking-[0.25em] text-[#FBF7EF] hover:text-[#f1c65a] transition-colors py-2 border-b border-[#f1c65a]/15 ${
                    mobileState === 'open' ? 'animate-nav-link' : ''
                  }`}
                  style={{ animationDelay: `${idx * 60 + 200}ms` }}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Date Footer inside Menu */}
            <div className="pt-4 text-[#A69272] text-[10px] tracking-[0.3em] uppercase font-mono">
              OCTOBER 10, 2026 • ACCRA
            </div>
          </div>
        </div>
      )}
    </>
  );
};
