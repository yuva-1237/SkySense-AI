import React from 'react';
import ReactDOM from 'react-dom/client';
import L from 'leaflet';
window.L = L;
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js')
      .then((reg) => console.log('Service worker registered:', reg))
      .catch((err) => console.error('Service worker registration failed:', err));
  });
}
