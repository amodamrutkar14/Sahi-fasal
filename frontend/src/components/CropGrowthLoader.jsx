import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import translations from '../i18n';

const CropGrowthLoader = ({ onComplete }) => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].loader;
  const [stage, setStage] = useState(1);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const intervals = [
      setTimeout(() => { setFade(false); setTimeout(() => { setStage(2); setFade(true); }, 300); }, 1500),
      setTimeout(() => { setFade(false); setTimeout(() => { setStage(3); setFade(true); }, 300); }, 3000),
      setTimeout(() => { if (onComplete) onComplete(); }, 4500)
    ];
    return () => intervals.forEach(clearTimeout);
  }, [onComplete]);

  const msg = stage === 1 ? t.s1 : stage === 2 ? t.s2 : t.s3;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center" style={{ background: 'radial-gradient(circle, #1a4530 0%, #102e1f 100%)' }}>
      {/* 3D Techno-Earthy Loading Visual */}
      <div className="relative w-56 h-56 flex items-center justify-center mb-10" style={{ perspective: '1000px' }}>
        {/* Outer glowing ring */}
        <div className="absolute w-full h-full rounded-full border border-[rgba(74,222,128,0.2)] border-t-[rgba(74,222,128,0.8)] shadow-[0_0_30px_rgba(74,222,128,0.15)] animate-spin" style={{ animationDuration: '4s' }}></div>
        {/* Inner reverse ring */}
        <div className="absolute w-44 h-44 rounded-full border border-[rgba(236,72,153,0.1)] border-b-[rgba(236,72,153,0.5)] animate-spin" style={{ animationDuration: '7s', animationDirection: 'reverse' }}></div>
        {/* Floating grid base */}
        <div className="absolute bottom-4 w-32 h-10 rounded-[50%] border border-[rgba(74,222,128,0.3)] shadow-[0_0_20px_rgba(74,222,128,0.2)]" style={{ transform: 'rotateX(70deg)' }}></div>

        {/* Central Flower */}
        <div className="relative z-10 flex items-end justify-center translate-y-2">
          <svg viewBox="0 0 120 160" className="w-[100px] h-[130px]">
            <rect x="58" y="60" width="4" height="78" fill="#4ade80" className="animate-stem" style={{ transformOrigin: 'bottom center' }} />
            <ellipse cx="60" cy="138" rx="7" ry="5" fill="#8b5e3c" className="animate-seed" />
            <ellipse cx="60" cy="145" rx="30" ry="6" fill="#112d1e" /> {/* 3D Shadow for soil */}
            <path d="M60 100 Q40 80 30 90 Q40 110 60 100" fill="#2a5f42" className="animate-left-leaf" />
            <path d="M60 85 Q80 65 90 75 Q80 95 60 85" fill="#2a5f42" className="animate-right-leaf" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
              <ellipse key={angle} cx="60" cy="44" rx="6" ry="14" fill="#ec4899"
                className="animate-petal"
                style={{ transformOrigin: '60px 58px', '--rot': `${angle}deg`, animationDelay: `${1.7 + index * 0.1}s` }} />
            ))}
            <circle cx="60" cy="58" r="8" fill="#eab308" className="animate-bud" />
          </svg>
        </div>
      </div>

      <div className={`text-center transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] to-[#86efac] tracking-wide uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {msg}
        </p>
        <p className="text-sm mt-2 text-gray-400">Powered by AI Analytics</p>
      </div>
    </div>
  );
};

export default CropGrowthLoader;
