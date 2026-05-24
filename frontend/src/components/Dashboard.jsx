import React, { useContext, useRef, useEffect, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import translations from '../i18n';

const nutrientKeys = [
  { key: 'nitrogen', tKey: 'n' }, { key: 'phosphorus', tKey: 'p' }, { key: 'potassium', tKey: 'k' },
  { key: 'iron', tKey: 'fe' }, { key: 'calcium', tKey: 'ca' }, { key: 'organic_carbon', tKey: 'oc' },
];

const nutrientColor = (pct) => pct >= 70 ? '#22c55e' : pct >= 45 ? '#ca8a04' : '#ef4444';

const AnimNum = ({ target, suffix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); } else setVal(start);
    }, 30);
    return () => clearInterval(id);
  }, [target]);
  return <>{val}{suffix}</>;
};

const CircleScore = ({ score, size = 64 }) => {
  const r = 28, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 70 ? '#22c55e' : score >= 45 ? '#ca8a04' : '#ef4444';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label={`Match score is ${score}%`}>
      <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(74,222,128,0.1)" strokeWidth="5" />
      <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 32 32)" className="transition-all duration-1000" />
      <text x="32" y="36" textAnchor="middle" fill="var(--text-primary)" style={{ fontSize: '14px', fontWeight: 700 }}>{score}%</text>
    </svg>
  );
};

const PhMeter = ({ min, max, avg }) => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].dashboard;
  const pct = ((avg - 0) / 14) * 100;
  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>
        <span>{t.acidic}</span><span>{t.neutral}</span><span>{t.alkaline}</span>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'linear-gradient(to right, #ef4444, #f59e0b, #22c55e, #22c55e, #3b82f6, #8b5cf6)' }}>
        <div className="absolute top-0 h-full w-0.5 bg-white shadow-md" style={{ left: `${pct}%` }} />
        <div className="absolute -top-5 text-[10px] font-bold" style={{ left: `${pct}%`, transform: 'translateX(-50%)', color: 'var(--text-primary)' }}>{avg}</div>
      </div>
      <div className="text-[10px] mt-1 text-center font-bold" style={{ color: 'var(--text-muted)' }}>Range: {min} – {max}</div>
    </div>
  );
};

const CropIcon = ({ cropName }) => {
  const name = cropName.toLowerCase();
  if (name.includes('wheat') || name.includes('गहू')) {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2" aria-hidden="true">
        <path d="M12 2v20M12 4c-2 1-3 3-3 5s1 4 3 4M12 4c2 1 3 3 3 5s-1 4-3 4M12 9c-2 1-3 3-3 5s1 4 3 4M12 9c2 1 3 3 3 5s-1 4-3 4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name.includes('rice') || name.includes('भात')) {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" aria-hidden="true">
        <path d="M12 22C12 12 7 8 7 3M12 22C12 15 17 10 17 5M12 14c-1-2-3-3-4-3M12 17c1-2 3-3 4-3" strokeLinecap="round" />
      </svg>
    );
  }
  if (name.includes('cotton') || name.includes('कापूस')) {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="4" fill="rgba(200,200,200,0.15)" />
        <circle cx="9" cy="9" r="3" fill="rgba(200,200,200,0.15)" />
        <circle cx="15" cy="9" r="3" fill="rgba(200,200,200,0.15)" />
        <circle cx="9" cy="15" r="3" fill="rgba(200,200,200,0.15)" />
        <circle cx="15" cy="15" r="3" fill="rgba(200,200,200,0.15)" />
        <path d="M12 16v6" stroke="#22c55e" strokeWidth="1.5" />
      </svg>
    );
  }
  if (name.includes('tomato') || name.includes('टोमॅटो')) {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="13" r="6" fill="rgba(239,68,68,0.2)" />
        <path d="M12 7c-1-2-3-1-3-1s2 2 3 1M12 7c1-2 3-1 3-1s-2 2-3 1M12 7V4" stroke="#22c55e" strokeLinecap="round" />
      </svg>
    );
  }
  if (name.includes('onion') || name.includes('कांदा')) {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2" aria-hidden="true">
        <path d="M12 3c-4 4-6 8-6 11a6 6 0 0012 0c0-3-2-7-6-11z" fill="rgba(219,39,119,0.2)" />
        <path d="M12 20v2M9 21v1M15 21v1" strokeLinecap="round" />
      </svg>
    );
  }
  if (name.includes('sugarcane') || name.includes('ऊस')) {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" aria-hidden="true">
        <path d="M8 22L16 2M5 22l11-22M11 22l6-15" strokeLinecap="round" />
        <path d="M12 12c2 1 4 0 4-2M10 17c2 1 4 0 4-2" strokeLinecap="round" />
      </svg>
    );
  }
  if (name.includes('maize') || name.includes('मका')) {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2" aria-hidden="true">
        <path d="M12 2C8 6 8 18 12 22C16 18 16 6 12 2Z" fill="rgba(202,138,4,0.15)" />
        <path d="M12 4v14M10 8h4M10 12h4" strokeLinecap="round" />
      </svg>
    );
  }
  // Fallback crop leaf icon
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" aria-hidden="true">
      <path d="M12 3v18M5 10c2 1 4 1 7-1s5-2 7-1M3 15c2 1 4 1 9-1s6-2 9-1" strokeLinecap="round" />
    </svg>
  );
};

const Dashboard = ({ weather, soil_info, recommendations, analysis, onModify, lastQuery }) => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].dashboard;
  const ref = useRef(null);

  useEffect(() => { ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, []);

  const maxProfit = Math.max(...recommendations.map(r => r.profit_per_acre), 1);
  const getTag = (tag) => lang !== 'en' ? (translations[lang].dashboard[tag.toLowerCase()] || tag) : tag;

  const tagColors = {
    Good: 'rgba(34,197,94,0.25)', Moderate: 'rgba(202,138,4,0.25)', Poor: 'rgba(239,68,68,0.25)',
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsappShare = () => {
    const cropsText = recommendations.slice(0, 3).map(r => `${lang === 'mr' ? r.crop_name_mr : r.crop_name_en} (${r.match_score}%)`).join(', ');
    const msg = t.whatsappText
      .replace('{location}', weather.location)
      .replace('{soil}', lang === 'mr' ? soil_info.name_mr : soil_info.name_en)
      .replace('{season}', analysis.query_season)
      .replace('{crops}', cropsText);

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div ref={ref} className="section-mid texture-overlay pt-32 pb-12 px-4" style={{ scrollMarginTop: '96px' }}>
      {/* Print Specific Styles */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          nav, footer, button, .btn-gold, .no-print {
            display: none !important;
          }
          .dash-card {
            background: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #dddddd !important;
            box-shadow: none !important;
            transform: none !important;
          }
          .text-gold-gradient {
            background: none !important;
            -webkit-text-fill-color: #1a4530 !important;
            color: #1a4530 !important;
          }
          text {
            fill: #000000 !important;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Actions Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 no-print">
          <button
            onClick={onModify}
            className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ border: '1px solid var(--glass-border)', color: 'var(--text-primary)', background: 'var(--glass-bg)', cursor: 'pointer' }}
          >
            ← {t.modifyQuery}
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleWhatsappShare}
              className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ background: '#25D366', color: '#ffffff', border: 'none', cursor: 'pointer' }}
            >
              💬 {t.shareWhatsapp}
            </button>
            <button
              onClick={handlePrint}
              className="btn-gold text-sm px-4 py-2 flex items-center gap-2"
            >
              🖨️ {t.downloadPdf}
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h2 className="section-heading text-3xl md:text-4xl text-gold-gradient">📊 {t.title}</h2>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            {[
              { icon: '📍', val: weather.location }, { icon: '🌱', val: lang === 'mr' ? soil_info.name_mr : soil_info.name_en },
              { icon: '📅', val: analysis.query_season }, { icon: '💧', val: analysis.query_water },
            ].map((b, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium capitalize"
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>
                {b.icon} {b.val}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fadeIn" style={{ animationDelay: '100ms' }}>
          {[
            { label: t.analysisBadge, val: analysis.crops_evaluated, icon: '🔍' },
            { label: t.returned, val: analysis.crops_returned, icon: '🌾' },
            { label: t.topScore, val: analysis.top_match_score, icon: '🏆', suffix: '%' },
            { label: t.temp, val: weather.temp, icon: '🌡️', suffix: '°C' },
          ].map((s, i) => (
            <div key={i} className="dash-card text-center p-4">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-extrabold text-gold-gradient">
                <AnimNum target={typeof s.val === 'number' ? s.val : parseFloat(s.val)} suffix={s.suffix || ''} />
              </div>
              <div className="text-xs mt-1 capitalize font-bold" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Weather + Soil */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-2 dash-card p-6 animate-slideUp" style={{ animationDelay: '150ms' }}>
            <h3 className="dash-section-title">🌤️ {t.weatherTitle}</h3>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { val: `${weather.temp}°C`, label: t.temp, icon: weather.temp > 32 ? '🔥' : weather.temp > 25 ? '☀️' : '🌤️' },
                { val: `${weather.rainfall}mm`, label: t.rain, icon: weather.rainfall > 50 ? '🌧️' : '🌦️' },
                { val: weather.location, label: t.loc, icon: '📍', big: false },
              ].map((w, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                    {w.big !== false ? w.val : <span className="text-sm font-bold block truncate">{w.val}</span>}
                  </div>
                  <div className="text-xs mt-1 font-semibold" style={{ color: 'var(--text-muted)' }}>{w.label}</div>
                  <div className="mt-2 text-xl">{w.icon}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 dash-card p-6 animate-slideUp" style={{ animationDelay: '250ms' }}>
            <h3 className="dash-section-title">🔬 {t.soilTitle}</h3>
            <div className="flex items-center gap-4 mt-4 mb-4">
              <div className="w-14 h-14 rounded-xl shadow-inner flex-shrink-0" style={{ backgroundColor: soil_info.color_hex, border: '2px solid var(--accent-primary)' }} />
              <div>
                <div className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{lang === 'mr' ? soil_info.name_mr : soil_info.name_en}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.soilColor}: {lang === 'mr' ? soil_info.color_name_mr : soil_info.color_name_en}</div>
              </div>
            </div>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{lang === 'mr' ? soil_info.description_mr : soil_info.description_en}</p>
            <div className="mb-4">
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t.phLabel}</div>
              <PhMeter min={soil_info.ph_min} max={soil_info.ph_max} avg={soil_info.ph_avg} />
            </div>
          </div>
        </div>

        {/* Nutrients */}
        <div className="dash-card p-6 mb-8 animate-slideUp" style={{ animationDelay: '350ms' }}>
          <h3 className="dash-section-title">🧪 {t.nutrientsTitle}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
            {nutrientKeys.map(({ key, tKey }) => {
              const n = soil_info.nutrients[key];
              if (!n) return null;
              return (
                <div key={key} className="text-center">
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>{t[tKey]}</div>
                  <div className="relative mx-auto w-10 h-24 rounded-lg overflow-hidden" style={{ background: 'rgba(20,54,37,0.06)' }}>
                    <div className="absolute bottom-0 w-full rounded-b-lg transition-all duration-1000 ease-out"
                      style={{ height: `${n.pct}%`, backgroundColor: nutrientColor(n.pct) }} />
                  </div>
                  <div className="text-xs font-bold mt-1" style={{ color: nutrientColor(n.pct) }}>{n.pct}%</div>
                  <div className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>{n.level}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Properties + Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="dash-card p-6 animate-slideUp" style={{ animationDelay: '400ms' }}>
            <h3 className="dash-section-title">⚙️ {t.propsTitle}</h3>
            <div className="space-y-3 mt-4">
              {[[t.texture, soil_info.properties.texture], [t.drainage, soil_info.properties.drainage],
              [t.waterRet, soil_info.properties.water_retention], [t.porosity, soil_info.properties.porosity],
              [t.depth, soil_info.properties.depth]].map(([label, val], i) => (
                <div key={i} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="dash-card p-6 animate-slideUp" style={{ animationDelay: '450ms' }}>
            <h3 className="dash-section-title">💡 {t.tipsTitle}</h3>
            <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(202,138,4,0.08)', border: '1px solid var(--glass-border)' }}>
              <p className="text-sm leading-relaxed font-semibold" style={{ color: 'var(--text-secondary)' }}>{lang === 'mr' ? soil_info.tips_mr : soil_info.tips_en}</p>
            </div>
          </div>
        </div>

        {/* Crop Recommendations */}
        <div className="mb-8 animate-slideUp" style={{ animationDelay: '500ms' }}>
          <h3 className="dash-section-title justify-center text-2xl mb-6">🌾 {t.recsTitle}</h3>
          {recommendations.length === 0 ? (
            <div className="dash-card p-8 text-center">
              <div className="text-5xl mb-4">🌱</div>
              <p style={{ color: 'var(--text-muted)' }}>{t.noResults}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommendations.map((crop, i) => (
                <div key={i} className="dash-card p-5 hover-lift animate-slideUp" style={{ animationDelay: `${550 + i * 100}ms` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-2">
                      <div className="p-1 rounded-lg" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                        <CropIcon cropName={crop.crop_name_en} />
                      </div>
                      <div>
                        <div className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{lang === 'mr' ? crop.crop_name_mr : crop.crop_name_en}</div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{lang === 'mr' ? crop.crop_name_en : crop.crop_name_mr}</div>
                      </div>
                    </div>
                    <CircleScore score={crop.match_score} />
                  </div>
                  <p className="text-xs italic mb-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>"{lang === 'mr' ? crop.reason_mr : crop.reason_en}"</p>
                  <div className="space-y-2" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '8px' }}>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>{t.profit}</span>
                      <span className="font-bold text-sm" style={{ color: 'var(--accent-terracotta)' }}>₹{crop.profit_per_acre.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>{t.waterNeed}</span>
                      <span className="font-semibold" style={{ color: '#3b82f6' }}>💧 {crop.water_req}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>{t.weatherFit}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: tagColors[crop.weather_tag] || tagColors.Moderate, color: 'var(--text-primary)' }}>
                        {getTag(crop.weather_tag)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profit Chart */}
        {recommendations.length > 0 && (
          <div className="dash-card p-6 animate-slideUp" style={{ animationDelay: '800ms' }}>
            <h3 className="dash-section-title">💰 {t.profitTitle}</h3>
            <div className="space-y-4 mt-5">
              {recommendations.slice(0, 8).map((crop, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-32 text-right text-sm font-semibold truncate flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                    {lang === 'mr' ? crop.crop_name_mr : crop.crop_name_en}
                  </div>
                  <div className="flex-1 h-8 rounded-lg overflow-hidden relative" style={{ background: 'rgba(20,54,37,0.04)', border: '1px solid var(--glass-border)' }}>
                    <div className="h-full rounded-lg profit-bar flex items-center justify-end pr-3"
                      style={{
                        width: `${(crop.profit_per_acre / maxProfit) * 100}%`,
                        background: `linear-gradient(90deg, var(--forest-light), var(--accent-primary))`,
                        animationDelay: `${900 + i * 80}ms`
                      }}>
                      <span className="text-xs font-bold shadow-sm" style={{ color: '#ffffff' }}>₹{crop.profit_per_acre.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
