const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');
const logger = require('../config/logger');
const weatherService = require('./weatherService');

// ─── In-memory session store (replaces MongoDB Conversation model) ─────────────
// Sessions expire after 2 hours of inactivity to prevent unbounded memory growth
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
const sessions = new Map();

// Model priority list — tried in order until one works
const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-pro'
];

function getOrCreateSession(sessionId) {
  if (sessions.has(sessionId)) {
    const s = sessions.get(sessionId);
    s.lastActive = Date.now();
    return s;
  }
  const s = { messages: [], lastActive: Date.now() };
  sessions.set(sessionId, s);
  return s;
}

// Prune expired sessions every 30 minutes
setInterval(() => {
  const cutoff = Date.now() - SESSION_TTL_MS;
  for (const [id, s] of sessions) {
    if (s.lastActive < cutoff) sessions.delete(id);
  }
}, 30 * 60 * 1000);

// ─── Location extractor ────────────────────────────────────────────────────────
function extractLocation(query, lastLocation) {
  const cleaned = query.replace(/[?!]/g, '').trim();

  const patterns = [
    /\bin\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,2})/i,
    /\bfor\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,2})/i,
    /\bat\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,2})/i,
    /\bweather\s+(?:in|for)?\s*([A-Za-z]+(?:\s+[A-Za-z]+){0,2})/i,
    /\b([A-Za-z]+(?:\s+[A-Za-z]+){0,2})\s+weather/i
  ];

  const noise = new Set([
    'today', 'tomorrow', 'now', 'this', 'week', 'next', 'the', 'my',
    'here', 'what', 'about', 'how', 'is', 'it', 'wind', 'speeds', 'temp',
    'temperature', 'humidity', 'umbrella', 'rain', 'need', 'should', 'i', 'do'
  ]);

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match && match[1]) {
      let candidate = match[1].trim()
        .replace(/\s+(today|tomorrow|now|this week|next week|forecast|current|right now)$/i, '')
        .trim();
      if (candidate.split(' ').length <= 3 && !noise.has(candidate.toLowerCase())) {
        return candidate;
      }
    }
  }

  return lastLocation || 'Manchester';
}

// ─── Build Gemini prompt context from weather data ─────────────────────────────
function buildWeatherContext(weatherData) {
  const { location, current, forecast, insights, alerts } = weatherData;
  const today = forecast?.forecastday?.[0];
  const tomorrow = forecast?.forecastday?.[1];

  return JSON.stringify({
    location: {
      name: location.name,
      region: location.region,
      country: location.country,
      localtime: location.localtime
    },
    current: {
      temp_c: current.temp_c,
      temp_f: current.temp_f,
      feelslike_c: current.feelslike_c,
      condition: current.condition.text,
      humidity: current.humidity,
      wind_kph: current.wind_kph,
      wind_dir: current.wind_dir,
      visibility_km: current.vis_km,
      uv_index: current.uv,
      cloud_cover_pct: current.cloud,
      chance_of_rain_pct: current.chance_of_rain,
      precip_mm: current.precip_mm,
      pressure_mb: current.pressure_mb,
      air_quality: current.air_quality
    },
    forecast_today: today ? {
      date: today.date,
      max_temp_c: today.day?.maxtemp_c,
      min_temp_c: today.day?.mintemp_c,
      avg_temp_c: today.day?.avgtemp_c,
      condition: today.day?.condition?.text,
      chance_of_rain_pct: today.day?.daily_chance_of_rain,
      total_precip_mm: today.day?.totalprecip_mm,
      max_wind_kph: today.day?.maxwind_kph,
      sunrise: today.astro?.sunrise,
      sunset: today.astro?.sunset
    } : null,
    forecast_tomorrow: tomorrow ? {
      date: tomorrow.date,
      max_temp_c: tomorrow.day?.maxtemp_c,
      min_temp_c: tomorrow.day?.mintemp_c,
      condition: tomorrow.day?.condition?.text,
      chance_of_rain_pct: tomorrow.day?.daily_chance_of_rain,
      total_precip_mm: tomorrow.day?.totalprecip_mm
    } : null,
    ai_insights: insights,
    active_alerts: alerts?.alert?.length > 0 ? alerts.alert.map(a => ({
      headline: a.headline,
      severity: a.severity,
      event: a.event
    })) : []
  }, null, 2);
}

// ─── Rule-based fallback (used when Gemini quota is exhausted) ────────────────
function generateFallbackReply(query, weatherData) {
  const q = query.toLowerCase().trim();
  const { current, forecast, insights, location } = weatherData;
  const today = forecast?.forecastday?.[0];
  const tomorrow = forecast?.forecastday?.[1];
  const chanceOfRain = today?.day?.daily_chance_of_rain ?? current.chance_of_rain ?? 0;
  const isRaining = chanceOfRain > 40 || current.precip_mm > 0 || current.condition.text.toLowerCase().includes('rain');
  const loc = location.name;
  const country = location.country;
  const tempC = current.temp_c;
  const feelsC = current.feelslike_c;
  const cond = current.condition.text;

  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|greetings)/.test(q)) {
    return `👋 **Hello! I'm SkySense AI.** I'm currently tracking live weather for **${loc}, ${country}**. It's **${tempC}°C** right now with *${cond}*. What would you like to know — forecasts, clothing advice, air quality, or UV levels?`;
  }

  // Generic "what's the weather" / "how's the weather"
  if (q.includes('weather') && (q.includes('what') || q.includes('how') || q.includes('current') || q.includes('today') || q.length < 30)) {
    const rainNote = chanceOfRain > 30 ? `There's a **${chanceOfRain}% chance of rain** today.` : 'No significant rain is expected today.';
    return `🌤️ **Current weather in ${loc}**: **${tempC}°C** (feels like ${feelsC}°C), *${cond}*.\n\n💧 Humidity: **${current.humidity}%** | 💨 Wind: **${current.wind_kph} km/h ${current.wind_dir}**\n\n📅 Today's range: **${today?.day?.mintemp_c ?? '--'}°C – ${today?.day?.maxtemp_c ?? '--'}°C**. ${rainNote}`;
  }

  // Umbrella / rain
  if (q.includes('umbrella') || (q.includes('rain') && !q.includes('rainbow'))) {
    if (isRaining) {
      return `🌧️ **Yes, carry an umbrella!** In ${loc}, there's a **${chanceOfRain}% chance of rain** today with ${current.precip_mm > 0 ? `${current.precip_mm}mm precipitation already recorded` : 'rain possible'}. Current condition: *${cond}*.\n\n💡 **Tip:** Keep a light rain jacket handy if you're heading out.`;
    }
    return `☀️ **No umbrella needed** in ${loc} today. The chance of rain is only **${chanceOfRain}%** and conditions are *${cond}*.\n\n💡 **Tip:** Still check again if you're out for the full day — weather can shift.`;
  }

  // Temperature / hot / cold / warm / cool
  if (q.includes('temp') || q.includes('hot') || q.includes('cold') || q.includes('warm') || q.includes('cool') || q.includes('degree')) {
    const feel = feelsC > 35 ? 'quite hot' : feelsC > 28 ? 'warm' : feelsC > 18 ? 'comfortable' : feelsC > 10 ? 'cool' : 'cold';
    return `🌡️ **${loc} is currently ${tempC}°C** (feels ${feel} at ${feelsC}°C).\n\n📅 **Today's range:** ${today?.day?.mintemp_c ?? '--'}°C – ${today?.day?.maxtemp_c ?? '--'}°C\n📅 **Tomorrow:** ${tomorrow?.day?.mintemp_c ?? '--'}°C – ${tomorrow?.day?.maxtemp_c ?? '--'}°C, *${tomorrow?.day?.condition?.text ?? 'similar conditions'}*.\n\n💡 Condition: *${cond}*`;
  }

  // Wind
  if (q.includes('wind') || q.includes('gust') || q.includes('breeze')) {
    const risk = current.wind_kph > 60 ? '⚠️ Strong winds — secure loose objects and use caution outdoors.' : current.wind_kph > 40 ? 'Moderate wind — may feel blustery.' : 'Calm to light wind conditions.';
    return `💨 **Wind in ${loc}: ${current.wind_kph} km/h** from the **${current.wind_dir}**.\n\n${risk}\n\n📅 Max gusts expected today: **${today?.day?.maxwind_kph ?? current.wind_kph} km/h**.`;
  }

  // Humidity
  if (q.includes('humid') || q.includes('muggy') || q.includes('sticky') || q.includes('dry')) {
    const feel = current.humidity > 80 ? '😓 Very humid — expect a muggy, sticky feel.' : current.humidity > 60 ? '☁️ Moderately humid.' : current.humidity < 30 ? '💧 Quite dry — stay hydrated and use moisturizer.' : '✅ Comfortable humidity levels.';
    return `💧 **Humidity in ${loc}: ${current.humidity}%**\n\n${feel}\n\nHigher humidity can make ${tempC}°C feel warmer than it actually is.`;
  }

  // Clothing / outfit / what to wear
  if (q.includes('wear') || q.includes('cloth') || q.includes('dress') || q.includes('outfit') || q.includes('jacket') || q.includes('coat')) {
    const advice = insights?.clothing;
    return `👔 **Clothing advice for ${loc} today** (${tempC}°C, *${cond}*):\n\n**${advice?.type || 'Casual'}** — ${advice?.advice || `With ${tempC}°C and ${cond.toLowerCase()}, dress in ${tempC > 30 ? 'light, breathable fabrics' : tempC < 15 ? 'warm layers — coat, sweater or jacket' : 'comfortable layers — t-shirt with a light jacket'}.`}\n\n${chanceOfRain > 30 ? '☔ Rain likely — bring a waterproof layer.' : ''}`;
  }

  // Air quality
  if (q.includes('aqi') || q.includes('air quality') || q.includes('pollution') || q.includes('pm2') || q.includes('pm10')) {
    const aqi = current.air_quality;
    const index = aqi?.['us-epa-index'] ?? 1;
    const labels = ['', '✅ Good', '🟡 Moderate', '🟠 Unhealthy for Sensitive Groups', '🔴 Unhealthy', '🟣 Very Unhealthy', '⚫ Hazardous'];
    const advices = ['', 'Great air quality — ideal for outdoor activities.', 'Acceptable, but unusually sensitive people should limit prolonged outdoor exposure.', 'Children and people with lung disease should limit outdoor activity.', 'Avoid prolonged outdoor exertion. Wear a mask if needed.', 'Stay indoors if possible. N95 mask recommended.', 'Hazardous! Avoid all outdoor activity.'];
    return `🌫️ **Air Quality in ${loc}**: ${labels[index] || '🟡 Moderate'} (US EPA AQI: ${index}/6)\n\nPM2.5: **${aqi?.pm2_5?.toFixed(1) ?? '--'} µg/m³** | PM10: **${aqi?.pm10?.toFixed(1) ?? '--'} µg/m³**\n\n${advices[index] || 'Standard precautions apply.'}`;
  }

  // UV / sunscreen / sun protection
  if (q.includes('uv') || q.includes('sunscreen') || q.includes('sunburn') || q.includes('spf')) {
    const uv = current.uv;
    const risk = uv <= 2 ? 'Low' : uv <= 5 ? 'Moderate' : uv <= 7 ? 'High' : uv <= 10 ? 'Very High' : 'Extreme';
    const tip = uv > 7 ? 'Apply SPF 50+, seek shade 10am–4pm, wear a hat and UV-blocking sunglasses.' : uv > 5 ? 'Apply SPF 30+, especially if outdoors for extended periods.' : uv > 2 ? 'SPF 15+ recommended for extended outdoor time.' : 'No special sun protection needed today.';
    return `☀️ **UV Index in ${loc}: ${uv} (${risk})**\n\n💡 ${tip}`;
  }

  // Forecast / tomorrow / this week
  if (q.includes('forecast') || q.includes('tomorrow') || q.includes('week') || q.includes('next') || q.includes('upcoming')) {
    if (q.includes('tomorrow')) {
      if (!tomorrow) return `📅 Tomorrow's data is not yet available. Current conditions in ${loc}: ${tempC}°C, *${cond}*, ${chanceOfRain}% rain chance.`;
      return `📅 **Tomorrow in ${loc}** (${tomorrow.date}):\n\n🌡️ **${tomorrow.day?.mintemp_c}°C – ${tomorrow.day?.maxtemp_c}°C** | *${tomorrow.day?.condition?.text}*\n💧 Rain chance: **${tomorrow.day?.daily_chance_of_rain}%** | 💧 Total rain: **${tomorrow.day?.totalprecip_mm}mm**\n\n💡 ${tomorrow.day?.daily_chance_of_rain > 40 ? 'Bring an umbrella tomorrow.' : 'No significant rain expected tomorrow.'}`;
    }
    // Weekly overview
    const days = forecast?.forecastday?.slice(0, 5) || [];
    if (days.length > 0) {
      const rows = days.map(d => `• **${d.date}**: ${d.day?.mintemp_c}–${d.day?.maxtemp_c}°C, *${d.day?.condition?.text}*, ${d.day?.daily_chance_of_rain}% rain`).join('\n');
      return `📅 **5-Day Forecast for ${loc}:**\n\n${rows}`;
    }
    return `📅 Current conditions in ${loc}: **${tempC}°C**, *${cond}*, ${chanceOfRain}% chance of rain today.`;
  }

  // Sunrise / sunset
  if (q.includes('sunrise') || q.includes('sunset') || q.includes('dawn') || q.includes('dusk')) {
    const astro = today?.astro;
    return `🌅 **${loc}** — Sunrise: **${astro?.sunrise ?? 'N/A'}** | Sunset: **${astro?.sunset ?? 'N/A'}**\n\n🌙 Moon: ${astro?.moon_phase ?? 'N/A'} (Illumination: ${astro?.moon_illumination ?? '--'}%)`;
  }

  // Pressure
  if (q.includes('pressure') || q.includes('barometric') || q.includes('barometer')) {
    const p = current.pressure_mb;
    const trend = p > 1015 ? 'High pressure — generally stable, fair weather.' : p < 1000 ? 'Low pressure — unsettled conditions likely.' : 'Near-average pressure — moderate conditions.';
    return `📊 **Barometric Pressure in ${loc}: ${p} hPa (mb)**\n\n${trend}`;
  }

  // Visibility / fog / mist
  if (q.includes('visib') || q.includes('fog') || q.includes('mist') || q.includes('haze')) {
    const vis = current.vis_km;
    const risk = vis < 1 ? '⚠️ Very poor visibility — drive with fog lights and extreme caution.' : vis < 5 ? '⚠️ Reduced visibility — allow extra travel time.' : '✅ Good visibility for driving and outdoor activities.';
    return `👁️ **Visibility in ${loc}: ${vis} km**\n\n${risk}\n\nCurrent condition: *${cond}*`;
  }

  // Outdoor activities / exercise / running / hiking
  if (q.includes('outdoor') || q.includes('exercise') || q.includes('run') || q.includes('walk') || q.includes('hike') || q.includes('sport') || q.includes('jog')) {
    const ok = !isRaining && current.wind_kph < 50 && tempC > 5 && tempC < 38;
    return `🏃 **Outdoor Activity Check for ${loc}:**\n\n${ok ? '✅ Conditions look **good for outdoor activities**!' : '⚠️ Conditions may **not be ideal** today.'}\n\n🌡️ ${tempC}°C (feels ${feelsC}°C) | 💨 Wind: ${current.wind_kph} km/h | 🌧️ Rain chance: ${chanceOfRain}%\n\n💡 ${insights?.health?.advice || (ok ? 'Enjoy your outdoor time!' : 'Consider indoor alternatives or check later today.')}`;
  }

  // Storm / thunderstorm / lightning
  if (q.includes('storm') || q.includes('thunder') || q.includes('lightning')) {
    const hasStorm = cond.toLowerCase().includes('thunder') || cond.toLowerCase().includes('storm');
    return `⛈️ **Storm conditions in ${loc}:**\n\n${hasStorm ? `🚨 **Active storm detected!** Current: *${cond}*. Avoid open areas, tall trees, and seek shelter indoors immediately.` : `No active storms right now — current condition is *${cond}*. Rain chance: ${chanceOfRain}%. Monitor updates if storms are in the forecast.`}`;
  }

  // Snow / ice / frost / freeze
  if (q.includes('snow') || q.includes('ice') || q.includes('frost') || q.includes('freez') || q.includes('sleet')) {
    const hasSnow = cond.toLowerCase().includes('snow') || cond.toLowerCase().includes('sleet') || cond.toLowerCase().includes('ice') || tempC < 2;
    return `❄️ **Winter conditions in ${loc}:**\n\n${hasSnow ? `🌨️ **Snow/icy conditions detected!** Current: *${cond}* at ${tempC}°C. Roads may be hazardous — drive carefully and dress warmly.` : `No snow currently — it's ${tempC}°C with *${cond}*. ${tempC < 5 ? 'Overnight frost is possible — cover sensitive plants.' : 'Temperatures are above freezing.'}`}`;
  }

  // Generic current conditions fallback
  const rainLine = chanceOfRain > 0 ? ` Rain probability: **${chanceOfRain}%**.` : '';
  return `🌤️ **Current conditions in ${loc}, ${country}:**\n\n🌡️ **${tempC}°C** (feels like ${feelsC}°C) | *${cond}*\n💧 Humidity: **${current.humidity}%** | 💨 Wind: **${current.wind_kph} km/h ${current.wind_dir}**${rainLine}\n\n📅 Today: **${today?.day?.mintemp_c ?? '--'}°C – ${today?.day?.maxtemp_c ?? '--'}°C**\n\n💡 Ask me about forecasts, clothing, air quality, UV, or activities!`;
}


// ─── Main service ──────────────────────────────────────────────────────────────
class ChatbotService {
  async sendMessage(sessionId, query, userId = null, defaultLocation = 'Manchester', onChunk = null) {
    logger.info(`Chatbot [${sessionId}] query: "${query}"`);

    const session = getOrCreateSession(sessionId);

    // Determine location from history or extract from query
    let lastLocation = '';
    for (let i = session.messages.length - 1; i >= 0; i--) {
      const parts = session.messages[i]?.parts;
      if (parts?.[0]?.location) { lastLocation = parts[0].location; break; }
    }

    const location = extractLocation(query, lastLocation || defaultLocation);

    // Fetch live weather
    let weatherData;
    try {
      weatherData = await weatherService.getWeather(location);
    } catch (err) {
      logger.error(`Weather fetch failed for chatbot: ${err.message}`);
      const errReply = `⚠️ I couldn't retrieve weather data for **${location}**. ${err.message.includes('not found') ? 'Please check the location spelling.' : 'The weather service may be temporarily unavailable.'}`;
      if (onChunk) {
        onChunk(errReply);
      }
      return {
        reply: errReply,
        location,
        weatherSnapshot: null
      };
    }

    const resolvedLocation = weatherData.location?.name || location;

    // Add user message to history
    session.messages.push({ role: 'user', parts: [{ text: query }] });

    let reply = '';

    if (config.geminiApiKey) {
      let geminiSuccess = false;

      // Try each model in priority order
      for (const modelName of GEMINI_MODELS) {
        if (geminiSuccess) break;
        try {
          const genAI = new GoogleGenerativeAI(config.geminiApiKey);
          const model = genAI.getGenerativeModel({ model: modelName });

          const weatherContext = buildWeatherContext(weatherData);

          const promptPreamble = `You are SkySense AI, a professional weather intelligence assistant powered by live meteorological data.
You are grounded EXCLUSIVELY in the real-time weather data provided below. Never hallucinate, invent, or estimate conditions beyond this data.

LIVE WEATHER DATA (${new Date().toUTCString()}):
---
${weatherContext}
---

RULES:
- Answer in clear, helpful markdown (max 5–6 sentences)
- Always cite specific numbers from the data (temp, humidity, wind speed, rain probability, etc.)
- For umbrella/rain questions: use chance_of_rain_pct, precip_mm, and condition text
- For clothing/outfit advice: use temp_c, feelslike_c, and condition
- For air quality: reference the air_quality block values
- For UV/sun: use uv_index
- Be conversational and helpful, not robotic
- End with a short practical tip when relevant

USER QUERY: ${query}`;

          // Build history array (all except the last user message we just pushed)
          const history = session.messages.slice(0, -1)
            .filter(m => m.role === 'user' || m.role === 'model')
            .map(m => ({
              role: m.role,
              parts: m.parts.map(p => ({ text: p.text || '' })).filter(p => p.text)
            }))
            .filter(m => m.parts.length > 0);

          const chat = model.startChat({ history });
          const result = await chat.sendMessageStream(promptPreamble);

          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            reply += chunkText;
            if (onChunk) {
              onChunk(chunkText);
            }
          }

          geminiSuccess = true;
          logger.info(`Gemini [${modelName}] response streamed for session ${sessionId}`);
        } catch (err) {
          const msg = err.message || '';
          const isModelNotFound = msg.includes('404') || msg.includes('not found') || msg.includes('not supported');
          const isRateLimit = msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');

          if (isModelNotFound) {
            logger.warn(`Model ${modelName} not available, trying next...`);
            continue; // try next model
          }
          if (isRateLimit) {
            logger.warn(`Rate limit on model ${modelName}, trying next...`);
            continue; // try next model
          }
          // Other error — log and fall through to rule-based
          logger.error(`Gemini [${modelName}] error: ${msg}`);
          break;
        }
      }

      if (!geminiSuccess) {
        logger.warn('All Gemini models failed — using intelligent rule-based fallback');
        const fallbackText = generateFallbackReply(query, weatherData);
        const words = fallbackText.split(' ');
        for (let i = 0; i < words.length; i++) {
          const word = words[i] + (i === words.length - 1 ? '' : ' ');
          reply += word;
          if (onChunk) {
            onChunk(word);
            await new Promise(resolve => setTimeout(resolve, 25));
          }
        }
      }
    } else {
      logger.warn('No GEMINI_API_KEY — using rule-based chatbot');
      const fallbackText = generateFallbackReply(query, weatherData);
      const words = fallbackText.split(' ');
      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i === words.length - 1 ? '' : ' ');
        reply += word;
        if (onChunk) {
          onChunk(word);
          await new Promise(resolve => setTimeout(resolve, 25));
        }
      }
    }

    // Add model reply to history (cap at 40 messages)
    session.messages.push({ role: 'model', parts: [{ text: reply, location: resolvedLocation }] });
    if (session.messages.length > 40) {
      session.messages = session.messages.slice(-40);
    }

    return {
      reply,
      location: resolvedLocation,
      weatherSnapshot: {
        temp_c: weatherData.current.temp_c,
        condition: weatherData.current.condition.text,
        humidity: weatherData.current.humidity,
        wind_kph: weatherData.current.wind_kph,
        chance_of_rain: weatherData.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain
          ?? weatherData.current.chance_of_rain ?? 0,
        insights: weatherData.insights
      }
    };
  }

  // Used by history endpoint — returns in-memory messages
  getSessionMessages(sessionId) {
    return sessions.get(sessionId)?.messages || [];
  }
}

module.exports = new ChatbotService();
