import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, openAuth }) {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'maps', icon: 'map', label: 'Maps' },
    { id: 'health', icon: 'health_and_safety', label: 'Health Center' },
    { id: 'travel', icon: 'flight', label: 'Travel Mode' },
    { id: 'farmer', icon: 'agriculture', label: 'Farmer Mode' },
    { id: 'admin', icon: 'analytics', label: 'System Oversight' },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col z-40 bg-surface-container/60 backdrop-blur-2xl border-r border-white/10 shadow-2xl transition-all duration-300">
      <div className="p-6">
        <h1 className="font-sans text-2xl font-bold tracking-tight text-primary">SkySense AI</h1>
        <p className="text-xs text-on-surface-variant mt-1 font-semibold tracking-wider uppercase">Weather Intelligence</p>
      </div>

      <nav className="flex-1 px-2 mt-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
              activeTab === item.id
                ? 'bg-primary-container/20 text-primary-container border-l-4 border-primary-container font-semibold'
                : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* AI Assistant button */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => setActiveTab('chatbot')}
          className={`w-full py-2.5 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 border ${
            activeTab === 'chatbot'
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
          }`}
        >
          <span className="material-symbols-outlined text-sm">smart_toy</span>
          AI Assistant
        </button>
      </div>

      {/* User profile / Auth section */}
      <div className="px-3 pb-4 space-y-2">
        {user ? (
          <>
            {/* Profile card */}
            <button
              onClick={() => setActiveTab('settings')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition text-left"
            >
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-sm">{user.name?.[0]?.toUpperCase() || '?'}</span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">{user.name}</p>
                <p className="text-[10px] text-on-surface-variant truncate">{user.email}</p>
              </div>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-white/5 hover:text-error transition text-left text-sm"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => openAuth('login')}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-on-surface-variant hover:text-on-surface transition text-sm font-medium"
            >
              <span className="material-symbols-outlined text-base">login</span>
              Sign In
            </button>
            <button
              onClick={() => openAuth('register')}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              Create Account
            </button>
          </>
        )}

        {/* Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'settings'
              ? 'bg-white/10 text-on-surface font-semibold'
              : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
}
