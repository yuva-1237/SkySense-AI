import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import MapView from './components/MapView';
import ChatbotView from './components/ChatbotView';
import AuthModal from './components/AuthModal';
import { HealthCenter, TravelMode, FarmerMode, AdminPanel, Settings } from './components/SpecializedModes';
import { fetchWeather } from './services/api';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [activeLocation, setActiveLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [unit, setUnit] = useState('c');
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });

  // Sync unit with user preferences once logged in
  useEffect(() => {
    if (user?.preferences?.unit) setUnit(user.preferences.unit);
  }, [user]);

  const loadWeather = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(query);
      setWeatherData(data);
      setActiveLocation({
        name: data.location.name,
        lat: data.location.lat,
        lon: data.location.lon,
        country: data.location.country
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not fetch weather data. Please try another query.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadWeather('Manchester');
  }, []);

  const handleSearchSubmit = (query) => loadWeather(query);
  const handleLocationSelect = (coords) => loadWeather(coords);
  const toggleUnit = () => setUnit(prev => prev === 'c' ? 'f' : 'c');
  const openAuth = (mode = 'login') => setAuthModal({ open: true, mode });

  const renderActiveTab = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-xs text-on-surface-variant font-medium">Fetching atmospheric observations...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="glass-panel p-8 rounded-xl text-center max-w-md mx-auto space-y-4">
          <span className="material-symbols-outlined text-error text-5xl">error</span>
          <h3 className="text-lg font-bold text-white">Observation Load Failure</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">{error}</p>
          <button
            onClick={() => loadWeather('Manchester')}
            className="px-6 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:bg-primary-fixed transition"
          >
            Reset to Manchester
          </button>
        </div>
      );
    }

    if (!weatherData) return null;

    switch (activeTab) {
      case 'dashboard':
        return <DashboardView data={weatherData} unit={unit} />;
      case 'maps':
        return <MapView activeLocation={activeLocation} onLocationSelect={handleLocationSelect} />;
      case 'health':
        return <HealthCenter data={weatherData} />;
      case 'travel':
        return <TravelMode data={weatherData} />;
      case 'farmer':
        return <FarmerMode data={weatherData} />;
      case 'admin':
        return <AdminPanel />;
      case 'chatbot':
        return <ChatbotView activeLocation={activeLocation} />;
      case 'settings':
        return <Settings openAuth={openAuth} />;
      default:
        return <DashboardView data={weatherData} unit={unit} />;
    }
  };

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen atmospheric-bg relative overflow-x-hidden pb-12">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} openAuth={openAuth} />

      <main className="md:ml-64 pt-20 md:pt-8 p-4 md:p-8 min-h-screen">
        <Navbar
          searchQuery={activeLocation ? activeLocation.name : 'Manchester'}
          onSearchSubmit={handleSearchSubmit}
          unit={unit}
          toggleUnit={toggleUnit}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openAuth={openAuth}
        />

        <div className="mt-6 md:mt-0 transition-all duration-300">
          {renderActiveTab()}
        </div>
      </main>

      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal(prev => ({ ...prev, open: false }))}
        defaultMode={authModal.mode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
