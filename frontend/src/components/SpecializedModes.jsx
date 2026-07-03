import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// ==========================================
// HEALTH CENTER
// ==========================================
export function HealthCenter({ data }) {
  const current = data.current;
  const insights = data.insights;

  const pollenGauges = [
    { label: 'Grass Pollen', val: insights.health.pollen_grass, color: 'text-amber-500', icon: 'grass' },
    { label: 'Pine Pollen', val: insights.health.pollen_pinetree, color: 'text-green-500', icon: 'forest' },
    { label: 'Weed Pollen', val: current.temp_c > 20 ? 'Moderate' : 'Low', color: 'text-yellow-500', icon: 'psychology' },
    { label: 'Mold Allergy', val: current.humidity > 70 ? 'High' : 'Low', color: 'text-red-500', icon: 'coronavirus' }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffc42f]">health_and_safety</span>
          Atmospheric Health Report
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Monitor allergen alerts, particulate concentrations, and solar radiation risks for your active location.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pollen Tracker */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Allergen Tracker</h4>
          <div className="grid grid-cols-2 gap-4">
            {pollenGauges.map((p, i) => (
              <div key={i} className="bg-surface-container/50 border border-white/5 p-4 rounded-lg flex items-center gap-3">
                <span className={`material-symbols-outlined ${p.color}`}>{p.icon}</span>
                <div>
                  <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider">{p.label}</span>
                  <strong className="text-xs text-white">{p.val}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Air Quality Index Breakdown */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Air Contaminants Breakdown</h4>
          <div className="space-y-3">
            {[
              { label: 'Carbon Monoxide (CO)', val: `${current.air_quality.co.toFixed(1)} μg/m³`, pct: 15 },
              { label: 'Nitrogen Dioxide (NO2)', val: `${current.air_quality.no2.toFixed(1)} μg/m³`, pct: 25 },
              { label: 'Ozone (O3)', val: `${current.air_quality.o3.toFixed(1)} μg/m³`, pct: 55 },
              { label: 'Sulfur Dioxide (SO2)', val: `${current.air_quality.so2.toFixed(1)} μg/m³`, pct: 8 }
            ].map((cont, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">{cont.label}</span>
                  <span className="text-white">{cont.val}</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${cont.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <span className="material-symbols-outlined text-amber-500 text-sm">info</span>
          Health Recommendations
        </h4>
        <div className="bg-surface-container/30 border border-white/10 p-4 rounded-lg text-xs leading-relaxed text-on-surface-variant space-y-2">
          <p>
            <strong>Allergy Advisory:</strong> Grass pollen levels are currently <strong>{insights.health.pollen_grass}</strong>. 
            {insights.health.pollen_grass === 'High' 
              ? ' Sensitive individuals should minimize outdoor activities during peak hours (mid-day) and keep windows closed.' 
              : ' Risk is minimal for general groups.'}
          </p>
          <p>
            <strong>UV Exposure:</strong> Index rating is <strong>{current.uv} ({insights.health.uv_risk})</strong>. {insights.health.advice}
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TRAVEL MODE
// ==========================================
export function TravelMode({ data }) {
  const current = data.current;
  const forecast = data.forecast;
  const insights = data.insights;

  // Generate dynamic travel list
  const listItems = [
    { text: 'Check flight delays', active: insights.travel.status === 'Caution' },
    { text: 'Pack rain gear & umbrella', active: current.condition.text.toLowerCase().includes('rain') },
    { text: 'Carry sunblock & shades', active: current.uv >= 5 },
    { text: 'Wear heavy layers & gloves', active: current.temp_c < 10 },
    { text: 'Ensure car tire pressure checks', active: current.temp_c < 5 },
    { text: 'Pre-hydrate for hot weather travel', active: current.temp_c > 30 }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">flight</span>
          Smart Travel planner
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Plan trips, check delay risks, and build customized travel packing lists derived directly from active weather metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transit status */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Transit Security Status</h4>
          <div className="p-6 rounded-lg bg-surface-container/30 border border-white/10 flex flex-col items-center justify-center text-center">
            <span className={`material-symbols-outlined text-5xl ${
              insights.travel.status === 'Good' ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {insights.travel.status === 'Good' ? 'check_circle' : 'warning'}
            </span>
            <strong className="text-xl text-white mt-4">{insights.travel.status === 'Good' ? 'All Systems Clear' : 'Transit Caution'}</strong>
            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed max-w-[280px]">
              {insights.travel.advice}
            </p>
          </div>
        </div>

        {/* Smart Checklist */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contextual Packing Checklist</h4>
          <ul className="space-y-2">
            {listItems.map((item, i) => (
              <li 
                key={i} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-xs font-semibold transition ${
                  item.active 
                    ? 'bg-primary/10 border-primary/30 text-white' 
                    : 'bg-white/5 border-white/5 text-on-surface-variant opacity-60'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {item.active ? 'check_box' : 'check_box_outline_blank'}
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FARMER MODE
// ==========================================
export function FarmerMode({ data }) {
  const current = data.current;
  const insights = data.insights;

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#22c55e]">agriculture</span>
          Agricultural Intelligence Dashboard
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Analyze soil metrics, evapotranspiration rates, and severe event warnings for optimized irrigation and crop protection schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Soil Moisture */}
        <div className="glass-panel p-5 rounded-xl text-center space-y-3">
          <span className="material-symbols-outlined text-blue-400 text-3xl">water_drop</span>
          <span className="text-[10px] text-on-surface-variant block uppercase font-semibold">Estimated Soil Moisture</span>
          <strong className="text-2xl text-white block">{insights.farming.soil_moisture}</strong>
          <span className="inline-block text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">
            Optimal Range
          </span>
        </div>

        {/* Evapotranspiration */}
        <div className="glass-panel p-5 rounded-xl text-center space-y-3">
          <span className="material-symbols-outlined text-amber-500 text-3xl">thermostat</span>
          <span className="text-[10px] text-on-surface-variant block uppercase font-semibold">Evapotranspiration (ET)</span>
          <strong className="text-2xl text-white block">{insights.farming.evapotranspiration}</strong>
          <span className="inline-block text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">
            Moderate Loss
          </span>
        </div>

        {/* Irrigation status */}
        <div className="glass-panel p-5 rounded-xl text-center space-y-3">
          <span className="material-symbols-outlined text-[#22c55e] text-3xl">sprinkler</span>
          <span className="text-[10px] text-on-surface-variant block uppercase font-semibold">Irrigation advisory</span>
          <strong className="text-xs text-white block leading-snug">
            {insights.farming.advice}
          </strong>
        </div>
      </div>

      {/* Extreme weather checklist */}
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <span className="material-symbols-outlined text-error text-sm">warning</span>
          Crop Protection Alerts
        </h4>
        <div className="text-xs text-on-surface-variant leading-relaxed">
          {data.alerts?.alert && data.alerts.alert.length > 0 ? (
            <div className="p-4 rounded-lg bg-error-container/20 border border-error-container text-white">
              <strong>{data.alerts.alert[0].event}:</strong> {data.alerts.alert[0].desc}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-surface-container/30 border border-white/5 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-400 text-lg">check_circle</span>
              <span>No crop frost or extreme winds detected. Soil conditions are safe for farming.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ADMIN PANEL / SYSTEM OVERSIGHT
// ==========================================
export function AdminPanel() {
  const [logs, setLogs] = useState([]);
  const [cacheHits, setCacheHits] = useState(128);
  const [cacheMisses, setCacheMisses] = useState(32);

  // Generate simulated logs
  useEffect(() => {
    const defaultLogs = [
      { time: '14:00:05', type: 'INFO', msg: 'System check: OK. App listening on port 3000' },
      { time: '14:00:15', type: 'INFO', msg: 'Cache store loaded: 0 active keys' },
      { time: '14:01:02', type: 'DEBUG', msg: 'WeatherService query received for: Manchester' },
      { time: '14:01:03', type: 'INFO', msg: 'Cache miss. Generated mock weather data fallback.' },
      { time: '14:02:11', type: 'DEBUG', msg: 'WeatherService query received for: London' },
      { time: '14:02:12', type: 'INFO', msg: 'Cache miss. Generated mock weather data fallback.' },
    ];
    setLogs(defaultLogs);

    const interval = setInterval(() => {
      const isHit = Math.random() > 0.3;
      if (isHit) setCacheHits(prev => prev + 1);
      else setCacheMisses(prev => prev + 1);

      const events = [
        'WeatherService query resolved.',
        'Chatbot service session update.',
        'Pruning expired keys from cache.',
        'Incoming websocket connection.',
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      setLogs(prev => [
        { time: timeStr, type: isHit ? 'DEBUG' : 'INFO', msg: `${isHit ? 'Cache Hit' : 'API Fetch'}: ${randomEvent}` },
        ...prev.slice(0, 15)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const total = cacheHits + cacheMisses;
  const hitRatio = total > 0 ? ((cacheHits / total) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">analytics</span>
          Oversight & Analytics
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Monitor server operations, cache metrics, and logs in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-xl space-y-2">
          <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Cache Hit Ratio</span>
          <strong className="text-3xl text-[#22c55e] block">{hitRatio}%</strong>
          <span className="text-[10px] text-on-surface-variant block">Hits: {cacheHits} / Misses: {cacheMisses}</span>
        </div>
        <div className="glass-panel p-5 rounded-xl space-y-2">
          <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Rate Limit Overhead</span>
          <strong className="text-3xl text-white block">0 / 1000</strong>
          <span className="text-[10px] text-on-surface-variant block">Hourly limit overhead</span>
        </div>
        <div className="glass-panel p-5 rounded-xl space-y-2">
          <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Server Response Time</span>
          <strong className="text-3xl text-primary block">14 ms</strong>
          <span className="text-[10px] text-on-surface-variant block">Healthy status response</span>
        </div>
      </div>

      {/* Terminal Log View */}
      <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
        <div className="bg-surface-container/60 px-6 py-3 flex items-center gap-2 border-b border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-xs text-on-surface-variant font-mono ml-2">skysense-core-logs.sh</span>
        </div>
        <div className="p-4 bg-surface-container-lowest/80 font-mono text-[11px] leading-relaxed text-green-400 h-64 overflow-y-auto space-y-1">
          {logs.map((log, i) => (
            <div key={i}>
              <span className="text-on-surface-variant mr-2">[{log.time}]</span>
              <span className={`mr-2 font-bold ${
                log.type === 'ERROR' ? 'text-red-500' : log.type === 'DEBUG' ? 'text-blue-400' : 'text-green-400'
              }`}>{log.type}</span>
              <span className="text-white">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ==========================================
// SETTINGS
// ==========================================
export function Settings({ openAuth }) {
  const { user, updateUser, logout, removeAccount, exportUserData, pinLocation, unpinLocation } = useAuth();

  const [form, setForm] = useState({ name: '', preferences: { unit: 'c', defaultCity: '' } });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        preferences: {
          unit: user.preferences?.unit || 'c',
          defaultCity: user.preferences?.defaultCity || ''
        }
      });
    }
  }, [user]);

  const showStatus = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus({ type: '', msg: '' }), 3500);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser(form);
      showStatus('success', 'Profile updated successfully!');
    } catch (err) {
      showStatus('error', err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const data = await exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `skysense-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showStatus('success', 'Data exported successfully!');
    } catch (err) {
      showStatus('error', err.message || 'Export failed.');
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) return setDeleteConfirm(true);
    try {
      await removeAccount();
    } catch (err) {
      showStatus('error', err.message || 'Account deletion failed.');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">settings</span>
          Account & Settings
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Manage your profile, preferences, and personal data.
        </p>
      </div>

      {/* Status banner */}
      {status.msg && (
        <div className={`px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
          status.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-error/10 border border-error/20 text-error'
        }`}>
          <span className="material-symbols-outlined text-sm">
            {status.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {status.msg}
        </div>
      )}

      {!user ? (
        /* Guest view */
        <div className="glass-panel p-8 rounded-xl text-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant">account_circle</span>
          <h4 className="font-bold text-white text-lg">You're browsing as a guest</h4>
          <p className="text-xs text-on-surface-variant">
            Create an account to save your favourite locations, sync chat history, and personalize your experience.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={() => openAuth('login')} className="px-6 py-2.5 rounded-lg bg-white/5 text-on-surface border border-white/10 text-sm font-semibold hover:bg-white/10 transition">Sign In</button>
            <button onClick={() => openAuth('register')} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-bold hover:bg-primary-fixed transition">Create Account</button>
          </div>
        </div>
      ) : (
        <>
          {/* Profile form */}
          <form onSubmit={handleSave} className="glass-panel p-6 rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Profile</h4>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-1.5">Display Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-surface-container/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1.5">Temperature Unit</label>
                <select
                  value={form.preferences.unit}
                  onChange={e => setForm(prev => ({ ...prev, preferences: { ...prev.preferences, unit: e.target.value } }))}
                  className="w-full bg-surface-container/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition"
                >
                  <option value="c">Celsius (°C)</option>
                  <option value="f">Fahrenheit (°F)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1.5">Default City</label>
                <input
                  type="text"
                  value={form.preferences.defaultCity}
                  onChange={e => setForm(prev => ({ ...prev, preferences: { ...prev.preferences, defaultCity: e.target.value } }))}
                  placeholder="e.g. Manchester"
                  className="w-full bg-surface-container/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-fixed transition disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <div className="w-3 h-3 rounded-full border-2 border-on-primary/30 border-t-on-primary animate-spin" />}
              Save Changes
            </button>
          </form>

          {/* Saved Locations */}
          {user.savedLocations?.length > 0 && (
            <div className="glass-panel p-6 rounded-xl space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Pinned Locations</h4>
              <div className="space-y-2">
                {user.savedLocations.map(loc => (
                  <div key={loc.name} className="flex items-center justify-between bg-surface-container/50 border border-white/5 rounded-lg px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                      <span className="text-xs font-semibold text-on-surface">{loc.name}</span>
                      {loc.country && <span className="text-[10px] text-on-surface-variant">{loc.country}</span>}
                    </div>
                    <button
                      onClick={() => unpinLocation(loc.name)}
                      className="text-on-surface-variant hover:text-error transition"
                    >
                      <span className="material-symbols-outlined text-sm">remove_circle</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data & Privacy */}
          <div className="glass-panel p-6 rounded-xl space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Data & Privacy</h4>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExport}
                disabled={exportLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 text-on-surface border border-white/10 text-xs font-semibold hover:bg-white/10 transition disabled:opacity-60"
              >
                {exportLoading
                  ? <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  : <span className="material-symbols-outlined text-sm">download</span>}
                Export My Data
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 text-on-surface border border-white/10 text-xs font-semibold hover:bg-white/10 transition"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Sign Out
              </button>

              <button
                onClick={handleDeleteAccount}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition ${
                  deleteConfirm
                    ? 'bg-error text-white animate-pulse'
                    : 'bg-error/10 text-error border border-error/20 hover:bg-error/20'
                }`}
              >
                <span className="material-symbols-outlined text-sm">delete_forever</span>
                {deleteConfirm ? 'Confirm — this is irreversible' : 'Delete Account'}
              </button>
            </div>
            {deleteConfirm && (
              <p className="text-[10px] text-error/70">Click again to permanently delete your account and all data.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

