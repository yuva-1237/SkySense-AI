import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardView({ data, unit }) {
  const current = data.current;
  const location = data.location;
  const forecast = data.forecast;
  const insights = data.insights;

  // Temperature values
  const temp = unit === 'c' ? current.temp_c : current.temp_f;
  const feelsLike = unit === 'c' ? current.feelslike_c : current.feelslike_f;
  const tempSymbol = unit === 'c' ? '°C' : '°F';

  // Weather state variables for animations
  const condition = current.condition.text.toLowerCase();
  const isRain = condition.includes('rain') || condition.includes('drizzle') || condition.includes('patchy');
  const isSnow = condition.includes('snow') || condition.includes('ice') || condition.includes('blizzard');
  const isCloudy = condition.includes('cloud') || condition.includes('overcast') || condition.includes('mist');
  const isSunny = condition.includes('sunny') || condition.includes('clear');

  // Chart 1: Hourly Forecast (Next 24 hours or next 8 steps of 3h)
  const todayForecast = forecast.forecastday[0];
  const hourlyDataPoints = todayForecast.hour;
  
  const hourlyLabels = hourlyDataPoints.map(h => {
    const timeParts = h.time.split(' ')[1];
    return timeParts; // returns e.g. "06:00"
  });

  const hourlyTemps = hourlyDataPoints.map(h => {
    return unit === 'c' ? h.temp_c : h.temp_f;
  });

  const hourlyChartData = {
    labels: hourlyLabels,
    datasets: [
      {
        label: `Temperature (${tempSymbol})`,
        data: hourlyTemps,
        fill: true,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        tension: 0.4,
        pointBackgroundColor: '#38bdf8',
        pointHoverRadius: 6,
      }
    ]
  };

  const hourlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#171f33',
        titleColor: '#8ed5ff',
        bodyColor: '#dae2fd',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#bdc8d1' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#bdc8d1' }
      }
    }
  };

  // Chart 2: 10-Day Temperature Outlook
  const dailyLabels = forecast.forecastday.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' });
  });

  const dailyMaxTemps = forecast.forecastday.map(d => {
    return unit === 'c' ? d.day.maxtemp_c : d.day.maxtemp_f;
  });

  const dailyMinTemps = forecast.forecastday.map(d => {
    return unit === 'c' ? d.day.mintemp_c : d.day.mintemp_f;
  });

  const outlookChartData = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Max Temp',
        data: dailyMaxTemps,
        borderColor: '#fbbf24',
        backgroundColor: '#fbbf24',
        borderWidth: 2,
        tension: 0.2,
      },
      {
        label: 'Min Temp',
        data: dailyMinTemps,
        borderColor: '#38bdf8',
        backgroundColor: '#38bdf8',
        borderWidth: 2,
        tension: 0.2,
      }
    ]
  };

  const outlookChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#dae2fd' }
      },
      tooltip: {
        backgroundColor: '#171f33',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#bdc8d1' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#bdc8d1' }
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Dynamic Background FX Overlay */}
      <div className="absolute inset-0 -z-10 pointer-events-none rounded-xl overflow-hidden">
        {isSunny && (
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        )}
        {isRain && (
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent">
            {/* Animated raindrops in CSS */}
            <div className="rain-effect opacity-30" />
          </div>
        )}
        {isSnow && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-200/5 to-transparent">
            <div className="snow-effect opacity-40" />
          </div>
        )}
      </div>

      {/* Primary Weather Card */}
      <div className="glass-panel rounded-xl p-6 md:p-8 relative overflow-hidden group">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">location_on</span>
              <h2 className="text-2xl font-bold tracking-tight text-white">{location.name}</h2>
              <span className="text-xs text-on-surface-variant font-medium bg-white/10 px-2 py-0.5 rounded-full">
                {location.country}
              </span>
              {data._cacheHit && (
                <span className="text-[10px] text-[#22c55e] font-semibold bg-[#22c55e]/10 border border-[#22c55e]/20 px-2 py-0.5 rounded-full">
                  CACHED
                </span>
              )}
            </div>
            <p className="text-sm text-on-surface-variant mt-1">Observed at: {location.localtime}</p>
            
            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-6xl md:text-7xl font-extrabold tracking-tighter text-white">
                {temp}{tempSymbol}
              </span>
              <div className="text-sm">
                <p className="text-on-surface-variant font-medium">Feels like: <strong className="text-white">{feelsLike}{tempSymbol}</strong></p>
                <p className="text-on-surface-variant mt-0.5">Humidity: <strong className="text-white">{current.humidity}%</strong></p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <img 
              src={current.condition.icon} 
              alt={current.condition.text} 
              className="w-20 h-20 drop-shadow-[0_4px_12px_rgba(56,189,248,0.4)]"
            />
            <p className="text-lg font-semibold text-primary capitalize mt-2">{current.condition.text}</p>
            <div className="flex gap-4 mt-3 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">air</span>
                Wind: {current.wind_kph} km/h
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">wb_sunny</span>
                UV: {current.uv}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Weather stats & tooltips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* UV Index Card */}
        <div className="glass-panel p-4 rounded-xl relative group">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">UV Index</span>
            <span className="material-symbols-outlined text-amber-500">wb_sunny</span>
          </div>
          <p className="text-2xl font-bold text-white">{current.uv}</p>
          <p className="text-xs text-primary font-medium mt-1">{insights.health.uv_risk} Risk</p>
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-high border border-white/10 rounded p-2 z-20 text-[10px] w-48 shadow-lg">
            <strong>UV Index Guide:</strong>
            <p className="mt-1">0-2: Low. 3-5: Moderate. 6-7: High. 8-10: Very High. 11+: Extreme. Always wear sunscreen during high UV levels.</p>
          </div>
        </div>

        {/* AQI Index Card */}
        <div className="glass-panel p-4 rounded-xl relative group">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Air Quality</span>
            <span className="material-symbols-outlined text-[#22c55e]">compress</span>
          </div>
          <p className="text-2xl font-bold text-white">{current.air_quality.pm2_5} μg/m³</p>
          <p className="text-xs text-primary font-medium mt-1">PM2.5 Level</p>
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-high border border-white/10 rounded p-2 z-20 text-[10px] w-48 shadow-lg">
            <strong>Air Quality Index (AQI):</strong>
            <p className="mt-1">AQI represents concentration of PM2.5. Levels below 12 μg/m³ are good, 12-35 moderate, and 35+ unhealthy.</p>
          </div>
        </div>

        {/* Wind Speed Card */}
        <div className="glass-panel p-4 rounded-xl relative group">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Wind State</span>
            <span className="material-symbols-outlined text-primary">air</span>
          </div>
          <p className="text-2xl font-bold text-white">{current.wind_kph} km/h</p>
          <p className="text-xs text-primary font-medium mt-1">Direction: {current.wind_dir}</p>
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-high border border-white/10 rounded p-2 z-20 text-[10px] w-48 shadow-lg">
            <strong>Wind Speeds:</strong>
            <p className="mt-1">Measured in km/h. High winds (&gt;40km/h) might disrupt lightweight operations and travel.</p>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="glass-panel p-4 rounded-xl relative group">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Humidity</span>
            <span className="material-symbols-outlined text-blue-400">humidity_mid</span>
          </div>
          <p className="text-2xl font-bold text-white">{current.humidity}%</p>
          <p className="text-xs text-primary font-medium mt-1">Relative Humidity</p>
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-high border border-white/10 rounded p-2 z-20 text-[10px] w-48 shadow-lg">
            <strong>Relative Humidity:</strong>
            <p className="mt-1">The amount of water vapor present in air expressed as a percentage of the amount needed for saturation.</p>
          </div>
        </div>
      </div>

      {/* Severe Weather Alerts Banner if exists */}
      {data.alerts?.alert && data.alerts.alert.length > 0 && (
        <div className="bg-error-container/30 border border-error-container rounded-xl p-4 flex items-start gap-3 animate-pulse">
          <span className="material-symbols-outlined text-error text-2xl">warning</span>
          <div>
            <h4 className="text-sm font-bold text-white">{data.alerts.alert[0].event}</h4>
            <p className="text-xs text-on-error-container mt-1">{data.alerts.alert[0].headline}</p>
            <p className="text-[11px] text-on-error-container/80 mt-1">{data.alerts.alert[0].desc}</p>
          </div>
        </div>
      )}

      {/* Forecast Charts and Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-xl p-4 md:p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">schedule</span>
            Hourly outlook (3-Hour Intervals)
          </h3>
          <div className="h-64">
            <Line data={hourlyChartData} options={hourlyChartOptions} />
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 md:p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
            10-Day Temperature outlook
          </h3>
          <div className="h-64">
            <Line data={outlookChartData} options={outlookChartOptions} />
          </div>
        </div>
      </div>

      {/* Derived Insights & Advice panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[#38bdf8]">checkroom</span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Clothing advice</h4>
          </div>
          <span className="inline-block text-[11px] font-bold bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20 px-2 py-0.5 rounded mb-2">
            Style: {insights.clothing.type}
          </span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {insights.clothing.advice}
          </p>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[#ffc42f]">health_and_safety</span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Allergy & Health</h4>
          </div>
          <span className="inline-block text-[11px] font-bold bg-[#ffc42f]/10 text-[#ffc42f] border border-[#ffc42f]/20 px-2 py-0.5 rounded mb-2">
            Pollen level: {insights.health.pollen_grass}
          </span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {insights.health.advice}
          </p>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary">flight</span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Transit & Travel</h4>
          </div>
          <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded mb-2 ${
            insights.travel.status === 'Good' 
              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
          }`}>
            Safety: {insights.travel.status}
          </span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {insights.travel.advice}
          </p>
        </div>
      </div>

      {/* CSS Animation styles injected for Rain and Snow */}
      <style>{`
        .rain-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="40"><line x1="5" y1="0" x2="5" y2="35" stroke="rgba(56,189,248,0.2)" stroke-width="1.5"/></svg>');
          animation: rain-fall 0.8s linear infinite;
        }
        @keyframes rain-fall {
          0% { background-position: 0px 0px; }
          100% { background-position: 10px 400px; }
        }
        
        .snow-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="1.5" fill="rgba(255,255,255,0.4)"/></svg>');
          animation: snow-drift 4s linear infinite;
        }
        @keyframes snow-drift {
          0% { background-position: 0px 0px; }
          100% { background-position: 100px 300px; }
        }
      `}</style>
    </div>
  );
}
