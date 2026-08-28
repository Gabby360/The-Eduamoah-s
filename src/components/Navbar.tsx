import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { weddingDetails } from '../mocks/weddingData';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { name: 'LOVE', href: '#blessings' },
    { name: 'LOCATION', href: '#location' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0B0907]/90 backdrop-blur-md border-b border-[#C29845]/20 py-4 shadow-2xl shadow-black/50'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Monogram Logo */}
        <a
          href="#"
          className="font-script text-2xl md:text-3xl text-[#D2AC5E] hover:text-[#FBF3DF] transition-colors tracking-wide"
        >
          {weddingDetails.couple.coupleName}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-medium tracking-[0.2em] text-[#BFAC90] hover:text-[#C29845] transition-colors duration-300 relative py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C29845] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-[#BFAC90] hover:text-[#C29845] p-2 focus:outline-none transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0907]/98 backdrop-blur-xl border-b border-[#C29845]/30 px-6 py-8 animate-fade-in shadow-2xl">
          <div className="flex flex-col space-y-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium tracking-[0.25em] text-[#BFAC90] hover:text-[#C29845] transition-colors py-2 border-b border-white/5"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
