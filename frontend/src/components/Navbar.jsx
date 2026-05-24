import React, { useState, useEffect, useContext, useRef } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import ThemeToggle from './ThemeToggle';
import translations from '../i18n';

const Navbar = ({ onNavigateHome, isResultsPage }) => {
  const { lang, setLang } = useContext(LanguageContext);
  const t = translations[lang];
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (mobileOpen && navRef.current && !navRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [mobileOpen]);

  const scrollTo = (id) => {
    setMobileOpen(false);
    if (isResultsPage) {
      onNavigateHome();
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const links = [
    { label: t.nav.home, id: 'crop-form' },
    { label: t.nav.how, id: 'how-it-works' },
    { label: t.nav.services, id: 'features' },
    { label: t.nav.schemes, id: 'govt-schemes' },
    { label: t.nav.mandi, id: 'mandi-rates' },
    { label: t.nav.blog, id: 'blog' },
    { label: t.nav.faq, id: 'faq' },
  ];

  return (
    <nav ref={navRef} className={`glass-navbar fixed top-0 left-0 w-full z-50 ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ca8a04] rounded-lg" 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              if (isResultsPage) onNavigateHome();
            }}
            role="button"
            tabIndex={0}
            aria-label="Sahi Fasal Home"
          >
            <div className="rotate-y-slow" style={{ perspective: '500px' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="16" cy="12" r="8" fill="var(--accent-primary)" opacity="0.2" />
                <path d="M12 8A6 6 0 0120 8" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 30V10" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M16 22C13 21 11 18 11 15C13 15 15 17 16 20Z" fill="var(--accent-light)" />
                <path d="M16 16C13 15 11 12 11 9C13 9 15 11 16 14Z" fill="var(--accent-light)" />
                <path d="M16 20C19 21 21 18 21 15C19 15 17 17 16 20Z" fill="var(--accent-primary)" />
                <path d="M16 14C19 15 21 12 21 9C19 9 17 11 16 14Z" fill="var(--accent-primary)" />
              </svg>
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>
              {t.brand}
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {links.map((link) => (
              <button 
                key={link.id} 
                onClick={() => scrollTo(link.id)}
                className="text-sm font-medium transition-colors duration-300 hover:text-white"
                style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Switcher */}
            <div className="lang-switcher hidden md:flex" role="group" aria-label="Language Selector">
              {[['en', 'English'], ['hi', 'हिन्दी'], ['mr', 'मराठी']].map(([code, label]) => (
                <button 
                  key={code} 
                  className={lang === code ? 'active' : ''} 
                  onClick={() => setLang(code)}
                  aria-label={`Change language to ${label}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <button 
              className="btn-gold text-sm hidden sm:block" 
              onClick={() => scrollTo('crop-form')}
            >
              {t.nav.cta}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2" 
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              aria-expanded={mobileOpen}
              aria-label="Toggle Navigation Menu"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with slide down effect */}
      <div 
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${mobileOpen ? 'max-h-screen opacity-100 border-t' : 'max-h-0 opacity-0'}`} 
        style={{ borderColor: 'var(--glass-border)', background: 'var(--nav-bg)' }}
      >
        <div className="px-4 py-4 space-y-2">
          {links.map((link) => (
            <button 
              key={link.id} 
              onClick={() => scrollTo(link.id)}
              className="block w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {link.label}
            </button>
          ))}
          <div className="lang-switcher mt-3 w-full justify-between" role="group" aria-label="Language Selector Mobile">
            {[['en', 'EN'], ['hi', 'हिं'], ['mr', 'मर']].map(([code, label]) => (
              <button 
                key={code} 
                className={`flex-1 text-center py-2 ${lang === code ? 'active' : ''}`} 
                onClick={() => setLang(code)}
              >
                {label}
              </button>
            ))}
          </div>
          <button 
            className="btn-gold text-sm w-full mt-3" 
            onClick={() => scrollTo('crop-form')}
          >
            {t.nav.cta}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
