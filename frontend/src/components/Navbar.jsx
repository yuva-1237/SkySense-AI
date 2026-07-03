import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({
  searchQuery,
  onSearchSubmit,
  unit,
  toggleUnit,
  activeTab,
  setActiveTab,
  openAuth
}) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inputVal, setInputVal] = useState(searchQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) onSearchSubmit(inputVal.trim());
  };

  const menuItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'maps', icon: 'map', label: 'Maps' },
    { id: 'health', icon: 'health_and_safety', label: 'Health Center' },
    { id: 'travel', icon: 'flight', label: 'Travel Mode' },
    { id: 'farmer', icon: 'agriculture', label: 'Farmer Mode' },
    { id: 'admin', icon: 'analytics', label: 'System Oversight' },
    { id: 'chatbot', icon: 'smart_toy', label: 'AI Assistant' },
    { id: 'settings', icon: 'settings', label: 'Settings' }
  ];

  return (
    <>
      {/* ── Mobile Top NavBar ── */}
      <nav className="md:hidden fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-4 bg-surface/85 backdrop-blur-xl border-b border-white/10 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-primary focus:outline-none"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
          <span className="font-bold text-lg text-primary tracking-tight">SkySense AI</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleUnit}
            className="text-xs font-semibold text-primary px-2 py-1 rounded bg-primary/10 border border-primary/20"
          >
            {unit === 'c' ? '°C' : '°F'}
          </button>
          {user ? (
            <button
              onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
              className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30"
            >
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-primary font-bold text-sm">{user.name?.[0]?.toUpperCase()}</span>
              )}
            </button>
          ) : (
            <button
              onClick={() => openAuth('login')}
              className="text-xs font-semibold text-primary px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* ── Mobile Dropdown Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-surface/95 backdrop-blur-2xl z-40 border-b border-white/10 shadow-lg py-4 max-h-[80vh] overflow-y-auto">
          <div className="px-4 mb-4">
            <form onSubmit={handleSubmit} className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2 text-on-surface-variant">search</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Search location..."
                className="w-full bg-surface-container/50 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary/50"
              />
            </form>
          </div>
          <div className="flex flex-col">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  activeTab === item.id
                    ? 'text-primary bg-primary/10 border-l-4 border-primary font-semibold'
                    : 'text-on-surface-variant hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
            {/* Auth row in mobile menu */}
            <div className="border-t border-white/10 mt-2 pt-2 px-4 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-1">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{user.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-on-surface">{user.name}</p>
                      <p className="text-[10px] text-on-surface-variant">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 px-2 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition">
                    <span className="material-symbols-outlined text-base">logout</span>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { openAuth('login'); setMobileMenuOpen(false); }} className="w-full py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition">Sign In</button>
                  <button onClick={() => { openAuth('register'); setMobileMenuOpen(false); }} className="w-full py-2.5 rounded-lg bg-primary text-on-primary text-sm font-bold hover:bg-primary-fixed transition">Create Account</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop Header ── */}
      <header className="hidden md:flex justify-between items-center mb-8">
        <form onSubmit={handleSubmit} className="relative w-96">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant">search</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search locations (e.g. Manchester, London, coords: 51.5,-0.1)..."
            className="w-full bg-surface-container/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-on-surface focus:outline-none focus:border-primary/50 focus:bg-surface-container transition-all text-sm"
          />
        </form>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleUnit}
            className="text-sm font-semibold text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded-full bg-surface-container border border-white/10 hover:bg-surface-container-high transition-colors"
          >
            Display: {unit === 'c' ? '°C' : '°F'}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveTab('settings')} className="text-sm text-on-surface-variant font-medium hover:text-on-surface transition truncate max-w-[120px]">
                {user.name}
              </button>
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-white/20 object-cover cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveTab('settings')} />
              ) : (
                <button onClick={() => setActiveTab('settings')} className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 hover:bg-primary/30 transition">
                  <span className="text-primary font-bold">{user.name?.[0]?.toUpperCase()}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => openAuth('login')} className="px-4 py-2 rounded-full bg-white/5 text-on-surface-variant hover:bg-white/10 hover:text-on-surface text-sm font-medium transition border border-white/10">
                Sign In
              </button>
              <button onClick={() => openAuth('register')} className="px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-bold hover:bg-primary-fixed transition shadow">
                Get Started
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
