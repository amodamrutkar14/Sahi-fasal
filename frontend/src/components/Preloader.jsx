import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import translations from '../i18n';

const Preloader = ({ onComplete }) => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang];
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
      setTimeout(() => onComplete && onComplete(), 600);
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`preloader ${hidden ? 'hidden' : ''}`} style={{ background: 'radial-gradient(circle, #1a4530 0%, #102e1f 100%)' }} role="status" aria-live="polite">
      <div className="flex flex-col items-center justify-center">
        {/* Minimalistic Logo Loader */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          {/* Loading elements (spinning rings) */}
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#ca8a04] border-b-[#ca8a04] animate-spin" style={{ animationDuration: '1.5s' }}></div>
          <div className="absolute inset-3 rounded-full border-[3px] border-transparent border-l-[#ca8a04] border-r-[#ca8a04] animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }}></div>
          
          <div className="preloader-pulse">
            <svg width="64" height="64" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <path d="M20 4L36 20L20 36L4 20L20 4Z" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 36V16" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 26C15 26 12 21 12 16C17 16 20 21 20 26Z" fill="var(--accent-light)"/>
              <path d="M20 20C25 20 28 15 28 10C23 10 20 15 20 20Z" fill="var(--accent-primary)"/>
            </svg>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-gold-gradient" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800 }}>
            {t.brand}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', letterSpacing: '0.05em', fontWeight: '600' }}>
            {t.tagline}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
