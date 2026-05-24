import React, { useState, useRef, useContext } from 'react';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import HeroSection from './components/HeroSection';
import { HowItWorks, Features, GovtSchemes, MandiPrices, SeasonalCalendar, Testimonials, BlogPreview, FAQ } from './components/HomeSections';
import CropGrowthLoader from './components/CropGrowthLoader';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { LanguageContext } from './context/LanguageContext';
import translations from './i18n';

const API_BASE = 'http://localhost:8000';

function App() {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang];
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState(null);
  const pendingRequest = useRef(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setLastQuery(formData);
    
    const payload = {
      location: formData.location,
      soil_type: formData.soilType.toLowerCase(),
      season: formData.season.toLowerCase(),
      water_availability: formData.waterAvailability.toLowerCase(),
      land_size: formData.landSize ? parseFloat(formData.landSize) : null,
    };

    pendingRequest.current = fetch(`${API_BASE}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error (${res.status})`);
      }
      return res.json();
    }).catch((err) => {
      // Distinguish network errors (backend not running) from server errors
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        throw new Error(
          'Cannot connect to the backend server. Please make sure the server is running on port 8000.\n\n' +
          'Run: cd backend && uvicorn main:app --reload'
        );
      }
      throw err;
    });
  };

  const handleLoadingComplete = async () => {
    try {
      const data = await pendingRequest.current;
      setResults(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      pendingRequest.current = null;
    }
  };

  const handleModifyQuery = () => {
    setResults(null);
  };

  if (!preloaderDone) {
    return <Preloader onComplete={() => setPreloaderDone(true)} />;
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Noto Sans Devanagari', sans-serif" }} className="texture-overlay min-h-screen flex flex-col justify-between">
      {/* Accessibility Skip Nav Link */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      <Navbar onNavigateHome={handleModifyQuery} isResultsPage={!!results} />

      <main id="main-content" className="flex-grow">
        {loading && <CropGrowthLoader onComplete={handleLoadingComplete} />}

        {error && (
          <div className="section-mid pt-32 pb-12 px-4">
            <div className="max-w-xl mx-auto glass-card p-6 text-center" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
              <div className="text-4xl mb-3" role="img" aria-label="warning">⚠️</div>
              <p className="font-medium" style={{ color: 'var(--accent-terracotta)' }}>{error}</p>
              <button onClick={() => { setError(null); setResults(null); }}
                className="btn-gold mt-4 text-sm px-6 py-2">
                Dismiss & Go Back
              </button>
            </div>
          </div>
        )}

        {results ? (
          <Dashboard
            weather={results.weather}
            soil_info={results.soil_info}
            recommendations={results.recommendations}
            analysis={results.analysis}
            onModify={handleModifyQuery}
            lastQuery={lastQuery}
          />
        ) : (
          <>
            <HeroSection onSubmit={handleSubmit} initialData={lastQuery} />
            <HowItWorks />
            <Features />
            <GovtSchemes />
            <MandiPrices />
            <SeasonalCalendar />
            <Testimonials />
            <BlogPreview />
            <FAQ />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
