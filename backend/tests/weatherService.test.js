const weatherService = require('../services/weatherService');
const config = require('../config/config');

describe('WeatherService tests', () => {
  beforeEach(() => {
    config.weatherApiKey = ''; // Ensure mock fallback runs
  });

  test('getCacheKey rounds coordinates to 1 decimal place', () => {
    const key1 = weatherService.getCacheKey('51.5284,-0.1245');
    const key2 = weatherService.getCacheKey('51.5456,-0.1111');
    expect(key1).toBe('weather:coords:51.5,-0.1');
    expect(key2).toBe('weather:coords:51.5,-0.1');
  });

  test('getCacheKey treats city names case-insensitively', () => {
    const key1 = weatherService.getCacheKey('London');
    const key2 = weatherService.getCacheKey('london ');
    expect(key1).toBe('weather:city:london');
    expect(key2).toBe('weather:city:london');
  });

  test('getWeather returns fallback mock data when no API key is set', async () => {
    const data = await weatherService.getWeather('London');
    expect(data.location.name).toBe('London');
    expect(data.current.temp_c).toBeDefined();
    expect(data.insights.clothing.advice).toBeDefined();
    expect(data.insights.farming.soil_moisture).toBeDefined();
  });
});
