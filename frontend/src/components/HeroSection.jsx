import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import translations from '../i18n';

const renderWheatHead = (sx, sy, grainColor, awnColor) => {
  const spikelets = [];
  const count = 7;
  for (let i = 0; i < count; i++) {
    const isLeft = i % 2 === 0;
    const yOffset = i * 4.5;
    const px = sx + (isLeft ? -2.2 : 2.2);
    const py = sy + yOffset;
    
    spikelets.push(
      <g key={i}>
        {/* Spikelet husk */}
        <path 
          d={isLeft 
            ? `M ${px} ${py} C ${px-6} ${py-2} ${px-5} ${py-7} ${px-1} ${py-9} C ${px-1} ${py-5} ${px} ${py-2} ${px} ${py}` 
            : `M ${px} ${py} C ${px+6} ${py-2} ${px+5} ${py-7} ${px+1} ${py-9} C ${px+1} ${py-5} ${px} ${py-2} ${px} ${py}`
          } 
          fill={grainColor} 
        />
        {/* Awn (long hair) */}
        <line 
          x1={isLeft ? px - 4 : px + 4} 
          y1={py - 6} 
          x2={isLeft ? px - 11 : px + 11} 
          y2={py - 18} 
          stroke={awnColor} 
          strokeWidth="0.6" 
          opacity="0.8" 
        />
      </g>
    );
  }
  // Terminal spikelet at top
  spikelets.push(
    <g key="top">
      <path 
        d={`M ${sx} ${sy - 3} C ${sx-3} ${sy-7} ${sx} ${sy-12} ${sx} ${sy-12} C ${sx} ${sy-12} ${sx+3} ${sy-7} ${sx} ${sy-3}`} 
        fill={grainColor} 
      />
      <line x1={sx} y1={sy - 12} x2={sx} y2={sy - 26} stroke={awnColor} strokeWidth="0.6" opacity="0.8" />
    </g>
  );
  return spikelets;
};

const renderPaddyClump = (sx, sh, color1, color2, color3) => {
  const endY = 220 - sh;
  const midY = 220 - sh / 2;
  return (
    <g>
      {/* Background blades */}
      <path 
        d={`M ${sx} 220 Q ${sx - 15} ${midY + 12} ${sx - 24} ${endY + 15} T ${sx - 32} ${endY + 30}`} 
        stroke={color1} 
        strokeWidth="1.8" 
        fill="none" 
        strokeLinecap="round"
      />
      <path 
        d={`M ${sx} 220 Q ${sx + 15} ${midY + 12} ${sx + 24} ${endY + 15} T ${sx + 32} ${endY + 30}`} 
        stroke={color1} 
        strokeWidth="1.8" 
        fill="none" 
        strokeLinecap="round"
      />
      
      {/* Main stems */}
      <path 
        d={`M ${sx} 220 Q ${sx - 4} ${midY} ${sx - 6} ${endY}`} 
        stroke={color2} 
        strokeWidth="2.8" 
        fill="none" 
        strokeLinecap="round"
      />
      
      {/* Broad leaf blades */}
      {/* Left leaf */}
      <path 
        d={`M ${sx - 2} ${midY + 10} C ${sx - 18} ${midY} ${sx - 25} ${midY - 15} ${sx - 28} ${midY - 5} C ${sx - 20} ${midY + 10} ${sx - 8} ${midY + 18} ${sx - 2} ${midY + 10}`} 
        fill={color1} 
      />
      {/* Right leaf */}
      <path 
        d={`M ${sx - 1} ${midY - 5} C ${sx + 15} ${midY - 15} ${sx + 22} ${midY - 30} ${sx + 26} ${midY - 20} C ${sx + 18} ${midY - 5} ${sx + 8} ${midY + 5} ${sx - 1} ${midY - 5}`} 
        fill={color2} 
      />
      {/* Left upper leaf */}
      <path 
        d={`M ${sx - 4} ${endY + 15} C ${sx - 16} ${endY + 2} ${sx - 20} ${endY - 12} ${sx - 22} ${endY - 4} C ${sx - 16} ${endY + 6} ${sx - 8} ${endY + 15} ${sx - 4} ${endY + 15}`} 
        fill={color2} 
      />
      {/* Center shoot */}
      <path 
        d={`M ${sx - 5} ${endY} C ${sx - 6} ${endY - 12} ${sx - 7} ${endY - 22} ${sx - 8} ${endY - 22} C ${sx - 7} ${endY - 10} ${sx - 4} ${endY} ${sx - 4} ${endY}`} 
        fill={color3} 
      />
    </g>
  );
};

const LiveWeatherFarmVisualizer = ({ weather }) => {
  // Determine weather category: summer, rainy, winter, pleasant
  const temp = weather ? weather.temp : 28; 
  const rain = weather ? weather.rainfall : 0; 
  const cloudPercent = weather ? (weather.cloud || 0) : 0;
  const conditionText = weather ? (weather.condition || '').toLowerCase() : '';

  let type = 'pleasant'; 
  let rainSpeed = 0; // 0 = no rain, 1 = slow, 2 = medium, 3 = fast
  
  if (rain > 0 || conditionText.includes('rain') || conditionText.includes('drizzle') || conditionText.includes('shower') || conditionText.includes('storm')) {
    type = 'rainy';
    if (rain <= 2) rainSpeed = 1;      
    else if (rain <= 10) rainSpeed = 2; 
    else rainSpeed = 3;                
  } else if (temp >= 30) {
    type = 'summer';
  } else if (temp < 20) {
    type = 'winter';
  }

  // Visual parameters
  const isCloudy = cloudPercent > 35 || conditionText.includes('cloud') || conditionText.includes('overcast') || type === 'rainy';
  
  let cloudColor = 'rgba(255, 255, 255, 0.75)'; 
  let skyGradient = 'linear-gradient(180deg, #bae6fd 0%, #38bdf8 55%, #0284c7 100%)'; 
  let sunColor = 'url(#sunGold)';
  let sunSize = 28;
  let sunGlow = '0.8';
  let labelText = 'Clear & Pleasant';
  let windSpeedBack = '3.8s';
  let windSpeedMid = '3.0s';
  let windSpeedFront = '2.3s';
  let windAngleBack = '2.5deg';
  let windAngleMid = '5deg';
  let windAngleFront = '7.5deg';
  let visibleClouds = 1;

  if (type === 'summer') {
    skyGradient = 'linear-gradient(180deg, #fdba74 0%, #f97316 45%, #7c2d12 100%)';
    sunColor = 'url(#sunSummer)';
    sunSize = 38;
    sunGlow = '1.0';
    labelText = 'Sunny & Dry';
    windSpeedBack = '2.5s';
    windSpeedMid = '2.0s';
    windSpeedFront = '1.4s';
    windAngleBack = '4deg';
    windAngleMid = '7deg';
    windAngleFront = '10deg';
    visibleClouds = isCloudy ? 1 : 0;
    cloudColor = 'rgba(255, 255, 255, 0.25)'; 
  } else if (type === 'rainy') {
    skyGradient = 'linear-gradient(180deg, #374151 0%, #1f2937 60%, #111827 100%)';
    sunColor = 'url(#sunRainy)';
    sunSize = 20;
    sunGlow = '0.1';
    windSpeedBack = rainSpeed === 3 ? '1.8s' : rainSpeed === 2 ? '2.4s' : '3.2s';
    windSpeedMid = rainSpeed === 3 ? '1.4s' : rainSpeed === 2 ? '1.9s' : '2.5s';
    windSpeedFront = rainSpeed === 3 ? '1.0s' : rainSpeed === 2 ? '1.4s' : '1.8s';
    windAngleBack = rainSpeed === 3 ? '5deg' : rainSpeed === 2 ? '3.5deg' : '2deg';
    windAngleMid = rainSpeed === 3 ? '10deg' : rainSpeed === 2 ? '7deg' : '4.5deg';
    windAngleFront = rainSpeed === 3 ? '15deg' : rainSpeed === 2 ? '10deg' : '6.5deg';
    visibleClouds = 4;
    cloudColor = 'rgba(55, 65, 81, 0.9)'; 
    labelText = rainSpeed === 3 ? 'Heavy Downpour' : rainSpeed === 2 ? 'Moderate Showers' : 'Light Drizzle';
  } else if (type === 'winter') {
    skyGradient = 'linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 55%, #94a3b8 100%)';
    sunColor = 'url(#sunWinter)';
    sunSize = 24;
    sunGlow = '0.35';
    labelText = 'Cool & Foggy';
    windSpeedBack = '4.8s';
    windSpeedMid = '3.8s';
    windSpeedFront = '2.8s';
    windAngleBack = '1deg';
    windAngleMid = '2deg';
    windAngleFront = '3.5deg';
    visibleClouds = 2;
    cloudColor = 'rgba(255, 255, 255, 0.6)'; 
  } else if (isCloudy) {
    labelText = 'Cloudy Skies';
    visibleClouds = 3;
    cloudColor = 'rgba(148, 163, 184, 0.85)'; 
  }

  // Generate 36 deterministic stalks for dense rendering
  const stalks = React.useMemo(() => {
    const arr = [];
    const layers = ['back', 'mid', 'front'];
    for (let i = 0; i < 36; i++) {
      const layer = layers[i % 3];
      const fraction = i / 35;
      const baseX = 15 + fraction * 470;
      const jitter = ((i * 17) % 16) - 8; 
      const x = Math.max(10, Math.min(490, baseX + jitter));
      
      let h = 80;
      if (layer === 'back') {
        h = 55 + ((i * 13) % 12); 
      } else if (layer === 'mid') {
        h = 70 + ((i * 19) % 15); 
      } else {
        h = 85 + ((i * 23) % 20); 
      }
      
      const delay = -((i * 11) % 40) / 10 + 's'; 
      const dur = 2.2 + ((i * 7) % 18) / 10 + 's'; 
      
      arr.push({ x, h, layer, delay, dur });
    }
    
    return arr.sort((a, b) => {
      const order = { 'back': 1, 'mid': 2, 'front': 3 };
      return order[a.layer] - order[b.layer];
    });
  }, []);

  const rainDrops = [];
  if (type === 'rainy') {
    const count = rainSpeed === 3 ? 45 : rainSpeed === 2 ? 25 : 12;
    for (let i = 0; i < count; i++) {
      rainDrops.push({
        id: i,
        x: Math.random() * 550 - 50,
        yStart: Math.random() * -60 - 20,
        dur: (0.35 + Math.random() * 0.25) / (rainSpeed * 0.9) + 's',
        delay: Math.random() * -1.5 + 's',
        opacity: 0.35 + Math.random() * 0.4,
        len: 15 + Math.random() * 10
      });
    }
  }

  // Water ripples on rainy soil
  const ripples = React.useMemo(() => [
    { x: 50, y: 215, delay: '0s' },
    { x: 120, y: 217, delay: '0.4s' },
    { x: 180, y: 214, delay: '0.8s' },
    { x: 260, y: 216, delay: '0.2s' },
    { x: 330, y: 215, delay: '0.6s' },
    { x: 400, y: 217, delay: '1.0s' },
    { x: 450, y: 214, delay: '0.3s' },
    { x: 90, y: 215, delay: '0.7s' },
  ], []);

  const groundFill = type === 'summer' ? 'url(#soilSummer)' : type === 'rainy' ? 'url(#soilRainy)' : 'url(#soilPleasant)';

  return (
    <div className="hidden lg:block relative w-full h-[220px] rounded-2xl overflow-hidden mt-6" style={{ background: skyGradient, border: '1px solid var(--glass-border)' }}>
      <style>{`
        @keyframes sway-crop-back {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(${windAngleBack}); }
        }
        @keyframes sway-crop-mid {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(${windAngleMid}); }
        }
        @keyframes sway-crop-front {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(${windAngleFront}); }
        }
        @keyframes drift-cloud-1 {
          0% { transform: translate(-160px, 15px); }
          100% { transform: translate(520px, 15px); }
        }
        @keyframes drift-cloud-2 {
          0% { transform: translate(-240px, 35px); }
          100% { transform: translate(520px, 35px); }
        }
        @keyframes drift-cloud-3 {
          0% { transform: translate(-160px, 5px); }
          100% { transform: translate(520px, 5px); }
        }
        @keyframes fall-rain {
          0% { transform: translate(0px, -40px); }
          100% { transform: translate(45px, 260px); }
        }
        @keyframes sun-pulse {
          0%, 100% { transform: scale(1); opacity: ${sunGlow}; }
          50% { transform: scale(1.05); opacity: ${Math.min(1, parseFloat(sunGlow) + 0.15)}; }
        }
        @keyframes heat-wave-haze {
          0%, 100% { opacity: 0.03; transform: scaleY(1) skewX(0deg); }
          50% { opacity: 0.12; transform: scaleY(1.03) skewX(2deg); }
        }
        @keyframes fog-drift-morning {
          0%, 100% { transform: translateX(-15px) scale(1); opacity: 0.05; }
          50% { transform: translateX(20px) scale(1.04); opacity: 0.18; }
        }
        @keyframes ripple-scale {
          0% { transform: scale(0); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes wind-drift {
          0% { transform: translateX(-150px); }
          100% { transform: translateX(550px); }
        }
        .anim-stalk-back {
          transform-origin: bottom center;
          animation: sway-crop-back ease-in-out infinite alternate;
        }
        .anim-stalk-mid {
          transform-origin: bottom center;
          animation: sway-crop-mid ease-in-out infinite alternate;
        }
        .anim-stalk-front {
          transform-origin: bottom center;
          animation: sway-crop-front ease-in-out infinite alternate;
        }
        .anim-cloud-1 { animation: drift-cloud-1 45s linear infinite; }
        .anim-cloud-2 { animation: drift-cloud-2 30s linear infinite; }
        .anim-cloud-3 { animation: drift-cloud-3 55s linear infinite; }
        .anim-rain { animation: fall-rain linear infinite; }
        .anim-sun { transform-origin: 420px 70px; animation: sun-pulse 4.5s ease-in-out infinite; }
        .anim-ripple {
          transform-origin: center;
          animation: ripple-scale 1.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .wind-line {
          animation: wind-drift linear infinite;
        }
        .heat-haze-overlay {
          pointer-events: none;
          background: repeating-linear-gradient(0deg, rgba(245,158,11,0.05) 0px, rgba(245,158,11,0) 10px);
          animation: heat-wave-haze 2.2s ease-in-out infinite;
        }
        .fog-haze-overlay {
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 80%);
          animation: fog-drift-morning 4.5s ease-in-out infinite;
        }
      `}</style>

      {type === 'summer' && <div className="absolute inset-0 heat-haze-overlay" />}
      {type === 'winter' && <div className="absolute inset-0 fog-haze-overlay" />}

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="sunGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <linearGradient id="sunSummer" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="sunRainy" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="sunWinter" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          {/* Grain Head & Stem Gradients */}
          <linearGradient id="wheatHusk" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="wheatStem" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Paddy Gradients */}
          <linearGradient id="paddyDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14532d" />
            <stop offset="100%" stopColor="#0f3d21" />
          </linearGradient>
          <linearGradient id="paddyMedium" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="paddyLight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>

          {/* Winter Paddy Gradients */}
          <linearGradient id="paddyWinterDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>
          <linearGradient id="paddyWinterMedium" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f766e" />
            <stop offset="100%" stopColor="#0f4c2c" />
          </linearGradient>

          {/* Rain streak & ripple gradients */}
          <linearGradient id="rainStreak" x1="0" y1="0" x2="0.15" y2="1">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="40%" stopColor="rgba(186, 230, 253, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.95)" />
          </linearGradient>
          <radialGradient id="rippleGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(147, 197, 253, 0.7)" />
            <stop offset="80%" stopColor="rgba(147, 197, 253, 0.2)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>

          {/* Ground Soil Gradients */}
          <linearGradient id="soilSummer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="soilRainy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="soilPleasant" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b4d24" />
            <stop offset="100%" stopColor="#0a230e" />
          </linearGradient>
        </defs>

        {/* Sun */}
        <circle cx="420" cy="70" r={sunSize} fill={sunColor} className="anim-sun" />

        {/* Hills */}
        <path d="M-50 240 Q150 140 350 200 T750 240" fill={type === 'rainy' ? '#1e293b' : type === 'summer' ? '#291b07' : '#143e21'} opacity="0.6" />
        <path d="M-100 240 Q100 120 300 180 T700 240" fill={type === 'rainy' ? '#0f172a' : type === 'summer' ? '#1c1002' : '#0c2e15'} />
        <path d="M50 240 Q250 160 450 220 T850 240" fill={type === 'rainy' ? '#020617' : type === 'summer' ? '#38250c' : '#1b5a2b'} opacity="0.4" />

        {/* Clouds */}
        {visibleClouds > 0 && (
          <g>
            {/* Cloud 1 */}
            <path 
              d="M 20 60 C 20 45 35 35 50 35 C 58 20 78 20 90 30 C 102 20 122 20 130 35 C 145 35 155 45 155 60 Z" 
              fill={cloudColor} 
              className="anim-cloud-1" 
              opacity={type === 'rainy' ? 0.9 : 0.75}
            />
            {/* Cloud 2 */}
            {visibleClouds >= 2 && (
              <path 
                d="M 10 40 C 10 30 20 22 30 22 C 35 12 50 12 58 18 C 65 12 80 12 85 22 C 95 22 102 30 102 40 Z" 
                fill={cloudColor} 
                className="anim-cloud-2" 
                style={{ animationDelay: '-12s' }} 
                opacity={type === 'rainy' ? 0.8 : 0.65}
              />
            )}
            {/* Cloud 3 */}
            {visibleClouds >= 3 && (
              <path 
                d="M 30 50 C 30 38 42 30 55 30 C 62 18 80 18 90 28 C 100 18 120 18 128 28 C 138 28 148 38 148 50 Z" 
                fill={cloudColor} 
                className="anim-cloud-3" 
                style={{ animationDelay: '-6s' }} 
                opacity={type === 'rainy' ? 0.85 : 0.7}
              />
            )}
            {/* Cloud 4 */}
            {visibleClouds >= 4 && (
              <path 
                d="M 120 30 C 120 20 132 12 145 12 C 152 2 170 2 180 10 C 190 2 208 2 215 12 C 225 12 232 20 232 30 Z" 
                fill={cloudColor} 
                className="anim-cloud-2" 
                style={{ animationDelay: '-22s' }} 
                opacity={0.8}
              />
            )}
          </g>
        )}

        {/* Wind lines for extra atmosphere */}
        {(type === 'rainy' || type === 'summer') && (
          <g>
            <path 
              d="M -100 80 Q 50 65 200 80 T 500 80" 
              stroke="rgba(255,255,255,0.08)" 
              strokeWidth="1.5" 
              strokeDasharray="40 80" 
              fill="none" 
              className="wind-line" 
              style={{ animationDuration: '3.2s', animationDelay: '-1s' }} 
            />
            <path 
              d="M -100 130 Q 80 120 220 130 T 500 130" 
              stroke="rgba(255,255,255,0.06)" 
              strokeWidth="1.2" 
              strokeDasharray="30 90" 
              fill="none" 
              className="wind-line" 
              style={{ animationDuration: '2.5s', animationDelay: '-2.5s' }} 
            />
          </g>
        )}

        {/* Swaying Crops */}
        {stalks.map((s, idx) => {
          const startY = 220;
          const endY = 220 - s.h;
          const midY = 220 - s.h / 2;
          
          if (type === 'summer') {
            // Summer Wheat ear husks and leaves using gradients
            const stemColor = 'url(#wheatStem)';
            const grainColor = 'url(#wheatHusk)';
            const awnColor = s.layer === 'back' ? '#78350f' : s.layer === 'mid' ? '#a16207' : '#ca8a04';
            const strokeWidth = s.layer === 'back' ? 1.5 : s.layer === 'mid' ? 2.2 : 2.8;

            return (
              <g 
                key={idx} 
                className={`anim-stalk-${s.layer}`} 
                style={{ 
                  transformOrigin: `${s.x}px 220px`, 
                  animationDelay: s.delay, 
                  animationDuration: s.dur 
                }}
              >
                {/* Stem */}
                <path 
                  d={`M ${s.x} ${startY} Q ${s.x + 3} ${midY} ${s.x + 5} ${endY}`} 
                  stroke={stemColor} 
                  strokeWidth={strokeWidth} 
                  strokeLinecap="round" 
                  fill="none" 
                />
                
                {/* Drooping thin leaves */}
                <path 
                  d={`M ${s.x + 1} ${midY + 12} Q ${s.x - 12} ${midY + 18} ${s.x - 15} ${midY + 28} Q ${s.x - 5} ${midY + 22} ${s.x + 1} ${midY + 15}`} 
                  fill="url(#wheatStem)" 
                  opacity="0.85" 
                />
                <path 
                  d={`M ${s.x + 2} ${midY - 8} Q ${s.x + 14} ${midY - 2} ${s.x + 18} ${midY + 8} Q ${s.x + 7} ${midY + 1} ${s.x + 2} ${midY - 4}`} 
                  fill="url(#wheatStem)" 
                  opacity="0.85" 
                />
                
                {/* Advanced Braided Wheat Head (spikelets) */}
                {renderWheatHead(s.x + 5, endY, grainColor, awnColor)}
              </g>
            );
          } else {
            // Dense Green Crops (Rainy/Pleasant/Winter)
            let color1, color2, color3;
            
            if (type === 'winter') {
              color1 = 'url(#paddyWinterDark)';
              color2 = 'url(#paddyWinterMedium)';
              color3 = 'url(#paddyMedium)';
            } else {
              color1 = 'url(#paddyDark)';
              color2 = 'url(#paddyMedium)';
              color3 = 'url(#paddyLight)';
            }

            return (
              <g 
                key={idx} 
                className={`anim-stalk-${s.layer}`} 
                style={{ 
                  transformOrigin: `${s.x}px 220px`, 
                  animationDelay: s.delay, 
                  animationDuration: s.dur 
                }}
              >
                {/* Volumetric Paddy Tillers */}
                {renderPaddyClump(s.x, s.h, color1, color2, color3)}
              </g>
            );
          }
        })}

        {/* Soil Base Anchor with gradient */}
        <path d="M -10 214 Q 120 217 260 214 T 510 215 L 510 225 L -10 225 Z" fill={groundFill} />

        {/* Splash Ripples on rainy soil */}
        {type === 'rainy' && ripples.map((r, idx) => (
          <g key={idx} transform={`translate(${r.x}, ${r.y})`}>
            <ellipse 
              cx="0" 
              cy="0" 
              rx="12" 
              ry="4" 
              stroke="url(#rippleGrad)" 
              strokeWidth="0.8" 
              fill="none" 
              className="anim-ripple" 
              style={{ animationDelay: r.delay }} 
            />
          </g>
        ))}

        {/* Rain Drops using Streak Gradient */}
        {type === 'rainy' && (
          <g>
            {rainDrops.map((d) => (
              <line
                key={d.id}
                x1={d.x}
                y1={d.yStart}
                x2={d.x + 8}
                y2={d.yStart + d.len}
                stroke="url(#rainStreak)"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity={d.opacity}
                className="anim-rain"
                style={{
                  animationDuration: d.dur,
                  animationDelay: d.delay
                }}
              />
            ))}
          </g>
        )}
      </svg>

      {/* Weather Label Badge */}
      <div className="absolute bottom-4 left-4 text-xs font-semibold px-2 py-1 rounded shadow-md flex items-center gap-1.5" 
           style={{ background: 'rgba(15, 45, 31, 0.85)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="w-2.5 h-2.5 rounded-full" 
              style={{ 
                background: type === 'summer' ? '#f59e0b' : type === 'rainy' ? '#3b82f6' : type === 'winter' ? '#bae6fd' : '#22c55e',
                boxShadow: '0 0 8px currentColor'
              }} 
        />
        {labelText} — Live Farm View
      </div>
    </div>
  );
};

const HeroSection = ({ onSubmit, initialData }) => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang];
  const f = t.form;
  const [weather, setWeather] = useState(null);
  const [listening, setListening] = useState(false);
  const [formData, setFormData] = useState({ 
    location: '', 
    soilType: '', 
    season: '', 
    waterAvailability: '', 
    landSize: '' 
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Load fallback weather on init
  useEffect(() => {
    const fetchDefaultWeather = async () => {
      try {
        const res = await fetch('http://localhost:8000/weather?q=Pune');
        if (res.ok) {
          const data = await res.json();
          setWeather(data);
        }
      } catch (err) {
        // Fallback simulated if backend is not running yet
        setWeather({ temp: 28, rainfall: 15, location: 'Pune' });
      }
    };
    fetchDefaultWeather();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    onSubmit(formData); 
  };

  const autoDetect = () => {
    if (!navigator.geolocation) {
      alert(t.hero.voiceError || "Geolocation not supported");
      return;
    }
    setFormData(prev => ({ ...prev, location: t.hero.detecting }));
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`http://localhost:8000/weather?q=${latitude},${longitude}`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          setWeather(data);
          setFormData(prev => ({ ...prev, location: data.location }));
        } catch (err) {
          alert("Failed to auto-detect location name. Please type manually.");
          setFormData(prev => ({ ...prev, location: '' }));
        }
      },
      () => {
        alert("Location access denied or unavailable. Please type manually.");
        setFormData(prev => ({ ...prev, location: '' }));
      }
    );
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t.hero.voiceError);
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = lang === 'en' ? 'en-IN' : lang === 'hi' ? 'hi-IN' : 'mr-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      const cleanText = text.replace(/\.$/, '');
      setFormData(prev => ({ ...prev, location: cleanText }));
    };
    rec.start();
  };

  const soilValues = ['Red', 'Black', 'Alluvial', 'Sandy', 'Loamy'];
  const seasonValues = ['Kharif', 'Rabi', 'Zaid'];
  const waterValues = ['Low', 'Medium', 'High'];

  return (
    <section className="hero-bg texture-overlay leaf-texture min-h-screen pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(42,95,66,0.1) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Column */}
          <div className="flex flex-col space-y-6 animate-fadeIn">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full w-fit" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
              <span className="w-2 h-2 rounded-full gold-pulse" style={{ background: 'var(--accent-primary)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.brand} — Smart Advisory</span>
            </div>

            {/* Headline */}
            <h1 className="section-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
              <span className="text-gold-gradient block">{t.tagline}</span>
            </h1>

            <p className="text-base lg:text-lg leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
              {t.subtitle}
            </p>

            {/* Weather Widget */}
            <div className="weather-widget max-w-sm">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>☁️ {t.hero.weather}</span>
                {weather && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(42,95,66,0.2)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}>📍 {weather.location}</span>}
              </div>
              {weather ? (
                <div className="grid grid-cols-4 gap-3 text-center">
                  {[
                    { label: t.hero.temp, val: `${weather.temp}°C`, icon: '🌡️' },
                    { label: t.hero.rain, val: `${weather.rainfall}mm`, icon: '🌧️' },
                    { label: 'Weather', val: weather.temp > 32 ? 'Sunny' : 'Clear', icon: '☀️' },
                    { label: 'Status', val: 'Active', icon: '🛰️' },
                  ].map((w, idx) => (
                    <div key={idx}>
                      <div className="text-lg">{w.icon}</div>
                      <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{w.val}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{w.label}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t.hero.detecting}</p>
              )}
            </div>

            {/* Live Interactive Climate/Farm Visualizer */}
            <LiveWeatherFarmVisualizer weather={weather} />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
              {[
                { v: '10K+', l: t.hero.stats.points, sub: t.hero.stats.pointsSub }, 
                { v: '95%', l: t.hero.stats.accuracy, sub: t.hero.stats.accuracySub }, 
                { v: '5K+', l: t.hero.stats.farmers, sub: t.hero.stats.farmersSub }
              ].map((s, idx) => (
                <div key={idx}>
                  <div className="text-2xl font-bold text-gold-gradient">{s.v}</div>
                  <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{s.l}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Form */}
          <div id="crop-form" className="animate-float-slow">
            <div className="glass-card p-6 sm:p-8 gold-pulse">
              <h2 className="section-heading text-2xl text-gold-gradient mb-6">{f.title}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Location */}
                <div>
                  <label htmlFor="location-input" className="section-label block mb-1.5">{f.location}</label>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <input 
                        id="location-input"
                        type="text" 
                        name="location" 
                        placeholder={f.locPh} 
                        value={formData.location} 
                        onChange={handleChange} 
                        required
                        className="glass-input w-full px-4 py-3 pr-10 text-sm" 
                      />
                      <button 
                        type="button" 
                        onClick={startVoiceInput}
                        className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full ${listening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-white'}`}
                        aria-label={listening ? t.hero.voiceListening : t.hero.speakLoc}
                        title={t.hero.speakLoc}
                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                      >
                        🎙️
                      </button>
                    </div>
                    <button 
                      type="button" 
                      onClick={autoDetect} 
                      className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-[#ca8a04]/20 transition-all"
                      style={{ background: 'rgba(202, 138, 4, 0.15)', color: 'var(--accent-primary)', border: '1px solid var(--glass-border)', cursor: 'pointer' }}
                    >
                      📍 {f.autoDetect.split(' ')[0]}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Soil */}
                  <div>
                    <label htmlFor="soilType-select" className="section-label block mb-1.5">{f.soil}</label>
                    <select 
                      id="soilType-select"
                      name="soilType" 
                      value={formData.soilType} 
                      onChange={handleChange} 
                      required 
                      className="glass-input w-full px-4 py-3 text-sm cursor-pointer"
                    >
                      <option value="" disabled>{f.soilOpts[0]}</option>
                      {soilValues.map((v, i) => <option key={v} value={v}>{f.soilOpts[i + 1]}</option>)}
                    </select>
                  </div>
                  {/* Season */}
                  <div>
                    <label htmlFor="season-select" className="section-label block mb-1.5">{f.season}</label>
                    <select 
                      id="season-select"
                      name="season" 
                      value={formData.season} 
                      onChange={handleChange} 
                      required 
                      className="glass-input w-full px-4 py-3 text-sm cursor-pointer"
                    >
                      <option value="" disabled>{f.seasonOpts[0]}</option>
                      {seasonValues.map((v, i) => <option key={v} value={v}>{f.seasonOpts[i + 1]}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Water */}
                  <div>
                    <label htmlFor="waterAvailability-select" className="section-label block mb-1.5">{f.water}</label>
                    <select 
                      id="waterAvailability-select"
                      name="waterAvailability" 
                      value={formData.waterAvailability} 
                      onChange={handleChange} 
                      required 
                      className="glass-input w-full px-4 py-3 text-sm cursor-pointer"
                    >
                      <option value="" disabled>{f.waterOpts[0]}</option>
                      {waterValues.map((v, i) => <option key={v} value={v}>{f.waterOpts[i + 1]}</option>)}
                    </select>
                  </div>
                  {/* Land */}
                  <div>
                    <label htmlFor="landSize-input" className="section-label block mb-1.5">{f.land}</label>
                    <input 
                      id="landSize-input"
                      type="number" 
                      name="landSize" 
                      placeholder={f.landPh} 
                      value={formData.landSize} 
                      onChange={handleChange}
                      className="glass-input w-full px-4 py-3 text-sm" 
                      min="0" 
                      step="any" 
                    />
                  </div>
                </div>

                <button type="submit" className="btn-gold w-full py-4 text-base mt-2 flex items-center justify-center gap-2">
                  {f.submit}
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
