import React, { useContext, useEffect, useRef, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import translations from '../i18n';

/* ── Scroll Reveal Hook ── */
const useScrollReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    const el = ref.current;
    if (el) {
      el.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right').forEach((c) => observer.observe(c));
    }
    return () => observer.disconnect();
  }, []);
  return ref;
};

/* ── Custom SVG Farmer Avatar ── */
const FarmerAvatar = ({ seed }) => {
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[var(--accent-primary)] bg-[var(--bg-primary)] flex-shrink-0" aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2">
        <circle cx="12" cy="8" r="4" fill="var(--accent-glow)" />
        <path d="M4 20c0-3 3-5 8-5s8 2 8 5" strokeLinecap="round" />
        <path d="M9 4L12 2L15 4" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

/* ══════════ HOW IT WORKS ══════════ */
const HowItWorks = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].how;
  const ref = useScrollReveal();

  const steps = [
    { icon: '📍', title: t.s1, desc: t.s1d },
    { icon: '🌱', title: t.s2, desc: t.s2d },
    { icon: '🤖', title: t.s3, desc: t.s3d },
    { icon: '📊', title: t.s4, desc: t.s4d },
  ];

  return (
    <section id="how-it-works" className="section-mid texture-overlay py-20 px-4" ref={ref}>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="section-label">{translations[lang].nav.how}</span>
          <h2 className="section-heading text-3xl sm:text-4xl mt-3 text-gold-gradient">{t.title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className={`glass-card p-6 text-center hover-lift ${i % 2 === 0 ? 'scroll-reveal-left' : 'scroll-reveal-right'}`}
              style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="text-4xl mb-4">{s.icon}</div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3"
                style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-light))', color: '#fff' }}>
                {i + 1}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════ FEATURES ══════════ */
const Features = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].features;
  const ref = useScrollReveal();

  const feats = [
    { icon: '☀️', title: t.f1, desc: t.f1d },
    { icon: '🌿', title: t.f2, desc: t.f2d },
    { icon: '💧', title: t.f3, desc: t.f3d },
    { icon: '📈', title: t.f4, desc: t.f4d },
    { icon: '📅', title: t.f5, desc: t.f5d },
    { icon: '📋', title: t.f6, desc: t.f6d },
  ];

  return (
    <section id="features" className="section-alt texture-overlay py-20 px-4" ref={ref}>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="section-label">{translations[lang].nav.services}</span>
          <h2 className="section-heading text-3xl sm:text-4xl mt-3 text-gold-gradient">{t.title}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {feats.map((f, i) => (
            <div key={i} className="scroll-reveal glass-card p-6 text-center group cursor-pointer" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="perspective-card mx-auto mb-4">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
              </div>
              <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--accent-primary)' }}>{f.title}</h3>
              <p className="text-[11px] font-semibold leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════ GOVERNMENT SCHEMES ══════════ */
const GovtSchemes = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].schemes;
  const ref = useScrollReveal();
  const [selectedScheme, setSelectedScheme] = useState(null);

  const list = [
    { title: t.s1Title, desc: t.s1Desc, full: t.s1Full, link: "https://pmkisan.gov.in/" },
    { title: t.s2Title, desc: t.s2Desc, full: t.s2Full, link: "https://pmfby.gov.in/" },
    { title: t.s3Title, desc: t.s3Desc, full: t.s3Full, link: "https://soilhealth.dac.gov.in/" }
  ];

  return (
    <section id="govt-schemes" className="section-mid texture-overlay py-20 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="section-label">{translations[lang].nav.schemes}</span>
          <h2 className="section-heading text-3xl sm:text-4xl mt-3 text-gold-gradient">{t.title}</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((s, i) => (
            <div key={i} className="scroll-reveal glass-card p-6 flex flex-col justify-between hover-lift" style={{ transitionDelay: `${i * 150}ms` }}>
              <div>
                <div className="text-3xl mb-3">🏛️</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                <p className="text-xs font-semibold leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
              <button 
                onClick={() => setSelectedScheme(s)}
                className="w-full text-center py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                style={{ background: 'var(--accent-glow)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', cursor: 'pointer' }}
              >
                {t.apply}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Scheme Modal */}
      {selectedScheme && (
        <div className="modal-overlay" onClick={() => setSelectedScheme(null)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedScheme(null)} aria-label="Close modal">×</button>
            <div className="text-4xl mb-3">🏛️</div>
            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{selectedScheme.title}</h3>
            <p className="text-sm font-semibold leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{selectedScheme.full}</p>
            <a 
              href={selectedScheme.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-gold text-sm block text-center py-3 w-full"
            >
              🚀 {t.apply}
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

/* ══════════ MANDI RATES ══════════ */
const MandiPrices = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].mandi;
  const ref = useScrollReveal();

  const rates = [
    { crop: t.wheat, price: "₹2,275", trend: t.rising, color: "#22c55e", icon: "📈" },
    { crop: t.rice, price: "₹2,183", trend: t.stable, color: "#ca8a04", icon: "➖" },
    { crop: t.cotton, price: "₹6,620", trend: t.rising, color: "#22c55e", icon: "📈" },
    { crop: t.onion, price: "₹1,850", trend: t.falling, color: "#ef4444", icon: "📉" },
    { crop: t.tomato, price: "₹2,200", trend: t.rising, color: "#22c55e", icon: "📈" },
    { crop: t.soybean, price: "₹4,600", trend: t.stable, color: "#ca8a04", icon: "➖" },
  ];

  return (
    <section id="mandi-rates" className="section-alt texture-overlay py-20 px-4" ref={ref}>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="section-label">{translations[lang].nav.mandi}</span>
          <h2 className="section-heading text-3xl sm:text-4xl mt-3 text-gold-gradient">{t.title}</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{t.subtitle}</p>
        </div>

        <div className="glass-card p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-4 pb-3" style={{ borderBottom: '1px solid var(--glass-border)' }}>
            <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>{t.updated}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rates.map((r, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'rgba(20,54,37,0.03)', border: '1px solid var(--glass-border)' }}>
                <div>
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{r.crop}</div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{t.price}</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black" style={{ color: 'var(--accent-terracotta)' }}>{r.price}</div>
                  <div className="text-[10px] font-bold flex items-center justify-end gap-0.5" style={{ color: r.color }}>
                    {r.icon} {r.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ══════════ SEASONAL CALENDAR ══════════ */
const SeasonalCalendar = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].calendar;
  const ref = useScrollReveal();

  const seasons = [
    { label: t.kharif, crops: t.crops.kharif, icon: '🌧️', color: '#22c55e' },
    { label: t.rabi, crops: t.crops.rabi, icon: '❄️', color: '#3b82f6' },
    { label: t.zaid, crops: t.crops.zaid, icon: '☀️', color: '#f59e0b' },
  ];

  return (
    <section id="seasonal-calendar" className="section-mid texture-overlay py-20 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="section-label">📅 {translations[lang].nav.home}</span>
          <h2 className="section-heading text-3xl sm:text-4xl mt-3 text-gold-gradient">{t.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {seasons.map((s, i) => (
            <div key={i} className="scroll-reveal glass-card p-6 hover-lift" style={{ transitionDelay: `${i * 150}ms`, borderLeft: `3px solid ${s.color}` }}>
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: s.color }}>{s.label}</h3>
              <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.crops}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════ TESTIMONIALS ══════════ */
const Testimonials = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].testimonials;
  const ref = useScrollReveal();

  const items = [
    { quote: t.t1, author: t.t1a, seed: 1 },
    { quote: t.t2, author: t.t2a, seed: 2 },
    { quote: t.t3, author: t.t3a, seed: 3 },
  ];

  return (
    <section id="testimonials" className="section-alt texture-overlay py-20 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="section-label">💬 {t.title}</span>
          <h2 className="section-heading text-3xl sm:text-4xl mt-3 text-gold-gradient">{t.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="scroll-reveal testimonial-card hover-lift" style={{ transitionDelay: `${i * 150}ms` }}>
              <p className="text-sm leading-relaxed mb-4 relative z-10 font-semibold" style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>
                "{item.quote}"
              </p>
              <div className="flex items-center gap-3">
                <FarmerAvatar seed={item.seed} />
                <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>{item.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════ BLOG PREVIEW ══════════ */
const BlogPreview = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].blog;
  const ref = useScrollReveal();
  const [selectedPost, setSelectedPost] = useState(null);

  const posts = [
    { title: t.b1, desc: t.b1d, content: t.b1Content, icon: '🌾', tag: 'Farming' },
    { title: t.b2, desc: t.b2d, content: t.b2Content, icon: '🧪', tag: 'Science' },
    { title: t.b3, desc: t.b3d, content: t.b3Content, icon: '💧', tag: 'Irrigation' },
  ];

  return (
    <section id="blog" className="section-mid texture-overlay py-20 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="section-label">📰 {translations[lang].nav.blog}</span>
          <h2 className="section-heading text-3xl sm:text-4xl mt-3 text-gold-gradient">{t.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <div key={i} className="scroll-reveal glass-card p-6 hover-lift cursor-pointer group flex flex-col justify-between" 
              onClick={() => setSelectedPost(p)}
              style={{ transitionDelay: `${i * 150}ms` }}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{p.icon}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(74,222,128,0.12)', color: 'var(--accent-primary)' }}>{p.tag}</span>
                </div>
                <h3 className="text-base font-bold mb-2 group-hover:text-[var(--accent-light)] transition-colors" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
                <p className="text-xs font-semibold leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
              </div>
              <div className="mt-4 text-xs font-bold flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
                {t.readMore} →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog modal dialog */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPost(null)} aria-label="Close modal">×</button>
            <div className="text-4xl mb-3">{selectedPost.icon}</div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit mb-2 block" style={{ background: 'rgba(74,222,128,0.12)', color: 'var(--accent-primary)' }}>{selectedPost.tag}</span>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{selectedPost.title}</h3>
            <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{selectedPost.content}</p>
          </div>
        </div>
      )}
    </section>
  );
};

/* ══════════ FAQ ══════════ */
const FAQ = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].faq;
  const ref = useScrollReveal();
  const [open, setOpen] = useState(null);

  const items = [
    { q: t.q1, a: t.a1 },
    { q: t.q2, a: t.a2 },
    { q: t.q3, a: t.a3 },
    { q: t.q4, a: t.a4 },
    { q: t.q5, a: t.a5 },
    { q: t.q6, a: t.a6 },
  ];

  return (
    <section id="faq" className="section-alt texture-overlay py-20 px-4" ref={ref}>
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="section-label">❓ {translations[lang].nav.faq}</span>
          <h2 className="section-heading text-3xl sm:text-4xl mt-3 text-gold-gradient">{t.title}</h2>
        </div>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="scroll-reveal glass-card overflow-hidden" style={{ transitionDelay: `${i * 100}ms` }}>
              <button 
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer focus:outline-none"
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}
                aria-expanded={open === i}
              >
                <span className="text-sm font-semibold pr-4">{item.q}</span>
                <span className="text-lg flex-shrink-0 transition-transform duration-300 font-bold" style={{ color: 'var(--accent-primary)', transform: open === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
              </button>
              <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open === i ? '200px' : '0', opacity: open === i ? 1 : 0 }}>
                <p className="px-5 pb-5 text-sm font-semibold leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { HowItWorks, Features, GovtSchemes, MandiPrices, SeasonalCalendar, Testimonials, BlogPreview, FAQ };
