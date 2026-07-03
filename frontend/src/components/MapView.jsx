import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';

export default function MapView({ activeLocation, onLocationSelect }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerClusterRef = useRef(null);
  const canvasLayerRef = useRef(null);
  
  const [mapError, setMapError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState('rain'); // 'rain', 'clouds', 'wind'
  const [timeSliderVal, setTimeSliderVal] = useState(0); // 0h to 24h
  
  // Geolocation states
  const [geoState, setGeoState] = useState('idle'); // 'idle', 'requesting', 'granted', 'denied'
  const [manualCoords, setManualCoords] = useState('');

  // Initial map setup
  useEffect(() => {
    if (!mapContainerRef.current) return;

    setLoading(true);
    setMapError(null);

    try {
      // 1. Initialize map with Canvas renderer for maximum performance
      const map = L.map(mapContainerRef.current, {
        center: [activeLocation.lat, activeLocation.lon],
        zoom: 7,
        renderer: L.canvas(),
        fadeAnimation: true,
        markerZoomAnimation: true
      });
      mapRef.current = map;

      // 2. Base tile layer with caching/preloading
      const baseTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
        className: 'map-tiles-darken' // custom style to match glassmorphism
      });
      baseTiles.addTo(map);

      // Handle tile load success
      baseTiles.on('tileload', () => {
        setLoading(false);
      });

      // Handle tile load error
      baseTiles.on('tileerror', (err) => {
        console.error('Tile load error', err);
        // We do not crash the map, but notify of connection issue
      });

      // 3. Setup marker clustering group
      const markerCluster = L.markerClusterGroup({
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 40
      });
      markerClusterRef.current = markerCluster;
      map.addLayer(markerCluster);

      // 4. Add initial marker for active location
      updateActiveMarker(activeLocation.lat, activeLocation.lon, activeLocation.name);

      // 5. Setup custom canvas weather overlay
      setupWeatherOverlay(map);

      // Map load finished
      setLoading(false);
    } catch (err) {
      console.error('Failed to initialize Leaflet Map:', err);
      setMapError('Could not initialize map view. Please check your internet connection or reload.');
      setLoading(false);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update marker when activeLocation changes
  useEffect(() => {
    if (mapRef.current && activeLocation) {
      mapRef.current.setView([activeLocation.lat, activeLocation.lon], 7);
      updateActiveMarker(activeLocation.lat, activeLocation.lon, activeLocation.name);
      // Redraw custom canvas layer
      if (canvasLayerRef.current) {
        canvasLayerRef.current.redraw();
      }
    }
  }, [activeLocation]);

  // Update marker cluster
  const updateActiveMarker = (lat, lon, name) => {
    const markerCluster = markerClusterRef.current;
    if (!markerCluster) return;

    markerCluster.clearLayers();
    
    // Create custom pin icon
    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-pulse"><div class="w-3 h-3 rounded-full bg-primary"></div></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([lat, lon], { icon: customIcon });
    marker.bindPopup(`<strong>${name}</strong><br/>Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`).openPopup();
    markerCluster.addLayer(marker);
  };

  // Setup custom canvas weather overlay
  const setupWeatherOverlay = (map) => {
    const canvasLayer = L.gridLayer({
      opacity: 0.55
    });

    canvasLayer.createTile = function (coords) {
      const tile = document.createElement('canvas');
      const size = this.getTileSize();
      tile.width = size.x;
      tile.height = size.y;
      
      const ctx = tile.getContext('2d');
      const seed = (coords.x + coords.y + coords.z) * 10;
      
      // Request redraw callback in gridLayer
      tile.draw = () => {
        ctx.clearRect(0, 0, size.x, size.y);
        
        // Draw weather grids depending on selectedLayer
        if (selectedLayer === 'rain') {
          // Draw cells simulating precipitation
          ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.beginPath();
          ctx.arc(size.x / 2 + Math.sin(seed + timeSliderVal) * 30, size.y / 2 + Math.cos(seed) * 20, 45, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = 'rgba(14, 165, 233, 0.3)';
          ctx.beginPath();
          ctx.arc(size.x / 3 + Math.cos(seed) * 15, size.y / 3 + Math.sin(seed + timeSliderVal) * 30, 30, 0, 2 * Math.PI);
          ctx.fill();
        } else if (selectedLayer === 'clouds') {
          // Draw soft clouds
          ctx.fillStyle = 'rgba(218, 226, 253, 0.35)';
          ctx.beginPath();
          ctx.arc(size.x / 2 + Math.cos(seed + timeSliderVal * 0.5) * 50, size.y / 2, 70, 0, 2 * Math.PI);
          ctx.fill();
        } else if (selectedLayer === 'wind') {
          // Draw streamlines
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < size.y; i += 40) {
            ctx.moveTo(0, i);
            ctx.bezierCurveTo(
              size.x / 3, i + Math.sin(seed + timeSliderVal + i) * 20,
              (size.x * 2) / 3, i - Math.sin(seed + timeSliderVal + i) * 20,
              size.x, i
            );
          }
          ctx.stroke();
        }
      };

      // Initial draw
      tile.draw();
      tile.dataset.tileSeed = seed;
      
      return tile;
    };

    canvasLayer.addTo(map);
    canvasLayerRef.current = canvasLayer;
  };

  // Re-render layer on parameters change
  useEffect(() => {
    if (mapRef.current && canvasLayerRef.current) {
      canvasLayerRef.current.redraw();
    }
  }, [selectedLayer, timeSliderVal]);

  // Request user geolocation
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGeoState('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoState('granted');
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        onLocationSelect(`${lat},${lon}`);
      },
      (error) => {
        console.warn('Geolocation denied or failed:', error.message);
        setGeoState('denied');
      },
      { timeout: 8000 }
    );
  };

  // Handle manual coordinate input fallback
  const handleManualCoordsSubmit = (e) => {
    e.preventDefault();
    const coordRegex = /^(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)$/;
    if (coordRegex.test(manualCoords.trim())) {
      onLocationSelect(manualCoords.trim());
      setManualCoords('');
    } else {
      alert('Invalid coordinate format. Please use: latitude,longitude (e.g. 51.5,-0.12)');
    }
  };

  const handleRetryMap = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Map Control Board */}
      <div className="glass-panel p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {/* Layer toggles */}
          <button
            onClick={() => setSelectedLayer('rain')}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition flex items-center gap-1.5 ${
              selectedLayer === 'rain' ? 'bg-primary text-on-primary' : 'bg-white/5 text-on-surface-variant hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-sm">rainy</span>
            Precipitation Radar
          </button>
          <button
            onClick={() => setSelectedLayer('clouds')}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition flex items-center gap-1.5 ${
              selectedLayer === 'clouds' ? 'bg-primary text-on-primary' : 'bg-white/5 text-on-surface-variant hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-sm">cloud</span>
            Cloud Cover
          </button>
          <button
            onClick={() => setSelectedLayer('wind')}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition flex items-center gap-1.5 ${
              selectedLayer === 'wind' ? 'bg-primary text-on-primary' : 'bg-white/5 text-on-surface-variant hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-sm">air</span>
            Wind Streamlines
          </button>
        </div>

        {/* Geolocation trigger */}
        <div className="flex gap-2 items-center">
          {geoState === 'denied' ? (
            <form onSubmit={handleManualCoordsSubmit} className="flex gap-2 items-center">
              <input
                type="text"
                value={manualCoords}
                onChange={(e) => setManualCoords(e.target.value)}
                placeholder="coords: lat,lon"
                className="bg-surface-container/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none w-36"
              />
              <button type="submit" className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30 text-xs font-bold hover:bg-primary/30">
                Go
              </button>
            </form>
          ) : (
            <button
              onClick={handleGeolocation}
              disabled={geoState === 'requesting'}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-semibold hover:bg-primary/20 transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">my_location</span>
              {geoState === 'requesting' ? 'Locating...' : 'Use My Geolocation'}
            </button>
          )}
        </div>
      </div>

      {/* Map display */}
      <div className="relative h-[550px] w-full rounded-xl overflow-hidden glass-panel border border-white/10">
        {loading && (
          <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-xs text-on-surface-variant font-medium">Loading weather maps & overlays...</p>
          </div>
        )}

        {mapError ? (
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-md z-30 flex flex-col items-center justify-center gap-4 text-center p-6">
            <span className="material-symbols-outlined text-error text-5xl">error</span>
            <p className="text-sm text-white font-bold">{mapError}</p>
            <button
              onClick={handleRetryMap}
              className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-fixed transition shadow-lg"
            >
              Retry Loading Map
            </button>
          </div>
        ) : (
          <div ref={mapContainerRef} className="h-full w-full" />
        )}
      </div>

      {/* Interactive Time Slider */}
      <div className="glass-panel p-4 rounded-xl space-y-2">
        <div className="flex justify-between items-center text-xs text-on-surface-variant font-medium">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Radar Observation Forecast Slider
          </span>
          <span className="text-primary font-bold">+{timeSliderVal * 2} Hours (Simulated Forecast)</span>
        </div>
        <input
          type="range"
          min="0"
          max="12"
          value={timeSliderVal}
          onChange={(e) => setTimeSliderVal(parseInt(e.target.value))}
          className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
        />
        <div className="flex justify-between text-[10px] text-on-surface-variant uppercase font-semibold">
          <span>Live Radar</span>
          <span>+6 Hours</span>
          <span>+12 Hours</span>
          <span>+18 Hours</span>
          <span>+24 Hours</span>
        </div>
      </div>

      <style>{`
        /* Map Customization to Dark theme */
        .map-tiles-darken {
          filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(85%);
        }
        .leaflet-container {
          background-color: #0b1326 !important;
          font-family: inherit;
        }
        .leaflet-bar a {
          background-color: #171f33 !important;
          color: #dae2fd !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .leaflet-bar a:hover {
          background-color: #222a3d !important;
          color: #white !important;
        }
        .leaflet-popup-content-wrapper {
          background-color: #171f33 !important;
          color: #dae2fd !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 8px !important;
          backdrop-filter: blur(12px) !important;
        }
        .leaflet-popup-tip {
          background-color: #171f33 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .custom-div-icon {
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
