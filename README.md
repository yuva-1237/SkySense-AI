<div align="center">

<!-- PROJECT LOGO / BANNER -->
<img src="assets/banner.png" alt="SkySense AI Banner" width="100%" style="border-radius:12px;" />

<br /><br />

# 🌤️ SkySense AI

### Next-Generation AI Weather Intelligence Platform

**Real-time meteorological intelligence, powered by Gemini AI — grounded in live data, never hallucinated.**

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Auth+Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.0_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![WeatherAPI](https://img.shields.io/badge/WeatherAPI.com-Live_Data-00B4D8?style=for-the-badge)](https://weatherapi.com)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br />

[![Stars](https://img.shields.io/github/stars/yuva-1237/SkySense-AI?style=social)](https://github.com/yuva-1237/SkySense-AI)
[![Forks](https://img.shields.io/github/forks/yuva-1237/SkySense-AI?style=social)](https://github.com/yuva-1237/SkySense-AI/fork)
[![Issues](https://img.shields.io/github/issues/yuva-1237/SkySense-AI?style=flat-square)](https://github.com/yuva-1237/SkySense-AI/issues)
[![Contributors](https://img.shields.io/github/contributors/yuva-1237/SkySense-AI?style=flat-square)](https://github.com/yuva-1237/SkySense-AI/graphs/contributors)

<br />

[📖 Documentation](#api-documentation) · [🐛 Report Bug](https://github.com/yuva-1237/SkySense-AI/issues) · [💡 Request Feature](https://github.com/yuva-1237/SkySense-AI/issues)

</div>

---

## 📋 Table of Contents

- [🌤️ SkySense AI](#️-skysense-ai)
- [📖 About The Project](#-about-the-project)
- [✨ Features](#-features)
- [🛠️ Technologies Used](#️-technologies-used)
- [🏗️ Architecture](#️-architecture)
- [📁 Folder Structure](#-folder-structure)
- [⚙️ Installation Guide](#️-installation-guide)
- [🔐 Environment Variables](#-environment-variables)
- [📖 Usage Guide](#-usage-guide)
- [📸 Screenshots](#-screenshots)
- [📡 API Documentation](#-api-documentation)
- [🤖 AI Assistant](#-ai-assistant)
- [🌦️ Weather Data Pipeline](#️-weather-data-pipeline)
- [📱 Responsive Design](#-responsive-design)
- [⚡ Performance](#-performance)
- [🔒 Security](#-security)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🗺️ Roadmap](#️-roadmap)
- [⚠️ Known Issues](#️-known-issues)
- [❓ FAQ](#-faq)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👤 Author](#-author)
- [🙏 Acknowledgements](#-acknowledgements)

---

## 📖 About The Project

### The Problem

Traditional weather applications present data as static, hard-to-interpret numbers — temperature, humidity, precipitation probability — without context or actionable insight. Users must mentally translate raw meteorological data into practical decisions: *Should I carry an umbrella? Is it safe to drive? What should I wear? Is today good for farming?*

Moreover, existing apps force users to navigate multiple screens, lack conversational interfaces, and completely fail non-technical audiences who just want a simple, intelligent answer.

### The Solution — SkySense AI

**SkySense AI** is a full-stack, AI-powered weather intelligence platform that combines:

- 🌍 **Live global weather data** from WeatherAPI.com (200,000+ locations worldwide)
- 🤖 **Google Gemini AI** to answer natural-language weather questions grounded in real-time data
- 📊 **Interactive dashboards** with Chart.js visualizations (hourly & 7-day forecasts)
- 🗺️ **Interactive weather maps** with Leaflet.js + satellite overlays
- 🏥 **Specialized intelligence modes** — Health Center, Travel Mode, Farmer Mode, and System Oversight
- 🔐 **Firebase Authentication** — Email/Password and Google Sign-In
- 💾 **Firestore database** — persistent conversation history and saved locations

### Target Users

| User Type | Use Case |
|---|---|
| 👤 **General Public** | "Do I need an umbrella today?" |
| 🏥 **Health-Conscious** | "Is the air quality safe to go jogging?" |
| ✈️ **Travelers** | "Is it safe to fly tomorrow?" |
| 🌾 **Farmers** | "What's the irrigation recommendation this week?" |
| 📸 **Photographers** | "When is the golden hour today?" |
| 🏗️ **Construction Managers** | "Will wind speeds be safe for scaffolding?" |
| 🎓 **Students / Researchers** | Full-stack AI + weather project reference |

### Future Scope

- 📡 Satellite imagery integration
- 🔔 Push notification weather alerts
- 📱 Progressive Web App (PWA) with offline support
- 🌐 Multi-language support (i18n)
- 🤝 Social features — share weather forecasts
- 🏢 Enterprise API tier for B2B customers

---

## ✨ Features

<details>
<summary><strong>🔐 Authentication & User Management</strong></summary>

- Firebase Authentication with Email/Password
- Google OAuth 2.0 Single Sign-In (one-click)
- Persistent user sessions via Firebase ID tokens
- Secure backend token verification (production: full cryptographic, dev: JWT decode)
- User profile management (name, avatar, preferences)
- Account deletion with full data wipe
- Data export (JSON)

</details>

<details>
<summary><strong>🌡️ Weather Intelligence</strong></summary>

- Real-time current conditions (temperature, feels like, humidity, UV, pressure, visibility)
- Hourly forecast — 24 data points per day
- 10-day extended forecast with temperature ranges
- Temperature unit toggle (°C / °F)
- Condition-aware animated weather icons
- Precipitation probability and accumulation (mm)
- Wind speed and direction
- Sunrise / Sunset / Moon phase astronomy data

</details>

<details>
<summary><strong>🤖 AI Assistant</strong></summary>

- Natural language weather Q&A powered by Google Gemini
- Real-time Server-Sent Events (SSE) streaming responses
- Weather-grounded responses — no hallucination
- Conversation history with session memory (2-hour TTL)
- Per-session chat history stored in Firestore (authenticated users)
- Guest mode — full AI access without account
- Conversation import / export (JSON)
- Voice input (Web Speech API)
- Text-to-Speech playback
- Conversation pinning, renaming, and deletion
- Model priority waterfall: gemini-2.0-flash → gemini-1.5-flash-latest → rule-based fallback
- 15+ rule-based handlers for quota-free operation

</details>

<details>
<summary><strong>🗺️ Interactive Weather Map</strong></summary>

- Leaflet.js interactive map with OpenStreetMap tiles
- Weather layer overlays: Rain, Clouds, Wind
- Marker clustering for multiple saved locations
- GPS geolocation detection
- Click-to-search on any map coordinate
- Time slider (0–24h forecast visualization)
- Canvas renderer for high-performance rendering

</details>

<details>
<summary><strong>📊 Dashboard & Charts</strong></summary>

- Real-time weather header card with live data
- Hourly temperature line chart (Chart.js)
- 7-day forecast bar chart
- Air Quality Index breakdown (CO, NO₂, O₃, SO₂, PM2.5, PM10)
- UV Index gauge with risk classification
- Wind compass
- Precipitation chart

</details>

<details>
<summary><strong>🏥 Health Center</strong></summary>

- Allergen tracker: Grass pollen, Tree pollen, Weed pollen, Mold
- Air contaminants breakdown with progress bars
- UV radiation risk classification (Low → Extreme)
- Health advice tailored to current conditions

</details>

<details>
<summary><strong>✈️ Travel Mode</strong></summary>

- Flight safety conditions assessment
- Travel advisory based on wind/visibility/temperature
- Location-aware travel risk score

</details>

<details>
<summary><strong>🌾 Farmer Mode</strong></summary>

- Soil moisture estimation
- Evapotranspiration rate (mm/day)
- Irrigation recommendations
- Crop-specific weather advisories

</details>

<details>
<summary><strong>📈 System Oversight (Admin)</strong></summary>

- Platform analytics dashboard
- API usage visualization
- Backend health monitoring

</details>

<details>
<summary><strong>🎨 Design & UX</strong></summary>

- Glassmorphism dark theme design
- Fully responsive: Desktop, Tablet, Mobile
- Tailwind CSS utility-first styling
- Material Symbols Outlined icon set
- Smooth transitions and micro-animations
- Accessible keyboard navigation

</details>

---

## 🛠️ Technologies Used

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 18.3 | UI framework |
| [Vite](https://vitejs.dev) | 5.x | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) | 3.4 | Utility-first styling |
| [Chart.js](https://www.chartjs.org) | 4.4 | Weather data visualization |
| [react-chartjs-2](https://react-chartjs-2.js.org) | 5.2 | React Chart.js bindings |
| [Leaflet.js](https://leafletjs.com) | 1.9 | Interactive weather maps |
| [leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) | 1.5 | Map marker clustering |
| [Firebase SDK](https://firebase.google.com/docs/web/setup) | 12.x | Auth, Firestore, Analytics |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org) | 20+ | Runtime environment |
| [Express.js](https://expressjs.com) | 4.19 | REST API framework |
| [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) | 13.x | Server-side token verification |
| [Helmet](https://helmetjs.github.io) | 7.x | HTTP security headers |
| [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | 8.x | API rate limiting |
| [Winston](https://github.com/winstonjs/winston) | 3.x | Structured logging |
| [Joi](https://joi.dev) | 17.x | Request body validation |
| [node-cache](https://github.com/node-cache/node-cache) | 5.x | In-memory weather caching |
| [Axios](https://axios-http.com) | 1.7 | HTTP client for weather API |

### AI & Data
| Technology | Purpose |
|---|---|
| [Google Gemini AI](https://ai.google.dev) | Natural language weather responses |
| [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) | Gemini SDK |
| [WeatherAPI.com](https://weatherapi.com) | Real-time weather data source |

### Database & Auth
| Technology | Purpose |
|---|---|
| [Firebase Firestore](https://firebase.google.com/docs/firestore) | NoSQL database (user profiles, conversations) |
| [Firebase Authentication](https://firebase.google.com/docs/auth) | Email/Password + Google OAuth |
| [MongoDB + Mongoose](https://mongoosejs.com) | Legacy data model layer (optional) |

### DevOps & Testing
| Technology | Purpose |
|---|---|
| [Jest](https://jestjs.io) | Unit & integration testing |
| [Supertest](https://github.com/ladjs/supertest) | HTTP API testing |
| [Nodemon](https://nodemon.io) | Development auto-reload |
| [Docker](https://docker.com) | Containerized deployment |

---

## 🏗️ Architecture

### System Overview

```mermaid
graph TB
    User["👤 User<br/>(Browser)"]

    subgraph Frontend["Frontend — React + Vite"]
        UI["UI Components<br/>Dashboard · Map · Chatbot · Health · Travel · Farmer"]
        FirebaseSDK["Firebase SDK<br/>Auth · Firestore · Analytics"]
        APIService["API Service Layer<br/>services/api.js"]
    end

    subgraph Backend["Backend — Node.js + Express"]
        Router["Express Router<br/>/api/weather · /api/chatbot · /api/users"]
        Auth["Auth Middleware<br/>Firebase Token Verification"]
        WeatherCtrl["Weather Controller"]
        ChatCtrl["Chatbot Controller"]
        UserCtrl["User Controller"]
        WeatherSvc["Weather Service<br/>node-cache TTL 10min"]
        ChatSvc["Chatbot Service<br/>In-memory sessions + SSE streaming"]
    end

    subgraph ExternalAPIs["External Services"]
        WeatherAPI["☁️ WeatherAPI.com<br/>Forecast · AQI · Alerts · Astronomy"]
        GeminiAI["🤖 Google Gemini AI<br/>gemini-2.0-flash"]
        FirebaseAuth["🔐 Firebase Auth<br/>Token Verification"]
        Firestore["💾 Cloud Firestore<br/>Users · Conversations"]
        OSM["🗺️ OpenStreetMap<br/>Map Tiles"]
    end

    User -->|"HTTPS"| Frontend
    Frontend -->|"REST + SSE"| Backend
    APIService -->|"Bearer Token"| Router
    Router --> Auth
    Auth -->|"Verify"| FirebaseAuth
    Router --> WeatherCtrl
    Router --> ChatCtrl
    Router --> UserCtrl
    WeatherCtrl --> WeatherSvc
    WeatherSvc -->|"Cache miss"| WeatherAPI
    ChatSvc -->|"Live data"| WeatherSvc
    ChatSvc -->|"Grounded prompt"| GeminiAI
    ChatCtrl --> ChatSvc
    FirebaseSDK -->|"Read/Write"| Firestore
    Frontend -->|"Tiles"| OSM
```

### Data Flow — AI Assistant

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant FE as ⚛️ Frontend
    participant BE as 🖥️ Backend
    participant WS as ☁️ WeatherAPI
    participant AI as 🤖 Gemini AI

    U->>FE: "Do I need an umbrella in Ooty?"
    FE->>BE: POST /api/chatbot {message, location, sessionId}
    BE->>WS: GET forecast.json?q=Ooty&days=10&aqi=yes
    WS-->>BE: Live weather JSON (temp, rain%, conditions...)
    BE->>BE: Build grounded prompt with weather context
    BE->>AI: streamGenerateContent(prompt + weather data)
    AI-->>BE: Streaming tokens...
    BE-->>FE: SSE: {type:"chunk", text:"🌧️ Yes, carry an umbrella!..."}
    FE-->>U: Live typing animation in chat
    BE-->>FE: SSE: {type:"done", weatherSnapshot:{...}}
    FE-->>U: Shows grounded observation card
```

---

## 📁 Folder Structure

```
SkySense-AI/
│
├── 📁 backend/                     # Node.js + Express API server
│   ├── 📁 config/
│   │   ├── config.js               # Environment configuration
│   │   ├── db.js                   # MongoDB connection (optional)
│   │   ├── firebaseAdmin.js        # Firebase Admin SDK init
│   │   └── logger.js               # Winston logger setup
│   ├── 📁 controllers/
│   │   ├── authController.js       # Legacy auth endpoints
│   │   ├── chatbotController.js    # AI chatbot SSE handler
│   │   ├── userController.js       # User profile CRUD
│   │   └── weatherController.js   # Weather data endpoint
│   ├── 📁 middleware/
│   │   ├── authMiddleware.js       # Firebase token verification
│   │   ├── errorHandler.js         # Centralized error handling
│   │   └── requestValidator.js     # Joi schema validation
│   ├── 📁 models/
│   │   ├── Conversation.js         # Mongoose conversation schema
│   │   ├── Notification.js         # Mongoose notification schema
│   │   ├── User.js                 # Mongoose user schema
│   │   └── validationSchemas.js   # Joi validation schemas
│   ├── 📁 routes/
│   │   ├── authRoutes.js           # /api/auth/* routes
│   │   ├── chatbotRoutes.js        # /api/chatbot/* routes
│   │   ├── userRoutes.js           # /api/users/* routes
│   │   └── weatherRoutes.js        # /api/weather/* routes
│   ├── 📁 services/
│   │   ├── chatbotService.js       # Gemini AI + rule-based fallback
│   │   └── weatherService.js       # WeatherAPI.com + caching
│   ├── 📁 tests/
│   │   ├── api.test.js             # API integration tests
│   │   ├── chatbotService.test.js  # AI service unit tests
│   │   └── weatherService.test.js  # Weather service unit tests
│   ├── 📁 logs/                    # Winston log output files
│   ├── app.js                      # Express app configuration
│   ├── server.js                   # HTTP server entry point
│   ├── .env                        # Environment variables (⚠️ gitignored)
│   └── package.json
│
├── 📁 frontend/                    # React + Vite SPA
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── AuthModal.jsx        # Login/Register modal
│   │   │   ├── ChatbotView.jsx      # AI assistant interface
│   │   │   ├── DashboardView.jsx   # Weather dashboard + charts
│   │   │   ├── MapView.jsx          # Leaflet interactive map
│   │   │   ├── Navbar.jsx           # Search bar + nav controls
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   └── SpecializedModes.jsx # Health / Travel / Farmer / Admin
│   │   ├── 📁 contexts/
│   │   │   └── AuthContext.jsx      # Firebase auth state + actions
│   │   ├── 📁 lib/
│   │   │   └── firebase.js          # Firebase SDK initialization
│   │   ├── 📁 services/
│   │   │   └── api.js               # Centralized API client
│   │   ├── App.jsx                  # Root component + routing
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── 📁 assets/                      # Static assets
│   └── banner.png                  # Project banner
│
├── 📁 docs/                        # Documentation assets
│   └── 📁 screenshots/             # App screenshots
│       ├── weather.png             # Live weather dashboard
│       ├── charts.png              # Hourly & 10-day forecast charts
│       ├── dashboard.png           # Main dashboard overview
│       ├── home.png                # Home / weather detail
│       ├── map.png                 # Interactive weather map
│       ├── chat.png                # AI Assistant chat
│       ├── farmer.png              # Farmer mode / agricultural AI
│       ├── oversight.png           # System oversight & analytics
│       ├── settings.png            # Account & settings
│       ├── login.png               # Sign-in screen
│       └── register.png            # Registration screen
│
├── Dockerfile                      # Docker container definition
├── docker-compose.yml              # Multi-service orchestration
├── playwright.config.js            # E2E test configuration
├── .gitignore
└── README.md
```

---

## ⚙️ Installation Guide

### Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download |
|---|---|---|
| Node.js | 18.0+ | [nodejs.org](https://nodejs.org) |
| npm | 9.0+ | Included with Node.js |
| Git | Any | [git-scm.com](https://git-scm.com) |

You will also need accounts on:
- [Firebase Console](https://console.firebase.google.com) — for Auth + Firestore
- [WeatherAPI.com](https://weatherapi.com) — for weather data (free tier available)
- [Google AI Studio](https://aistudio.google.com) — for Gemini API key (free tier available)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/yourusername/SkySense-AI.git
cd SkySense-AI
```

---

### Step 2 — Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# Copy the example environment file
cp .env.example .env
```

Now open `.env` and fill in all required values (see [Environment Variables](#-environment-variables) section).

---

### Step 3 — Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → **Create Project** → name it `skysense-0000` (or any name)
2. **Enable Authentication:**
   - Firebase Console → Authentication → Sign-in method
   - Enable **Email/Password**
   - Enable **Google** (add your support email)
3. **Create Firestore Database:**
   - Firebase Console → Firestore Database → Create database
   - Choose **Start in test mode** → select a region → Done
4. **Get Web Config** (for frontend):
   - Firebase Console → Project Settings → Your apps → Add web app
   - Copy the `firebaseConfig` object into `frontend/src/lib/firebase.js`
5. **Get Service Account** (for backend production):
   - Firebase Console → Project Settings → Service Accounts → Generate New Private Key
   - Download the JSON file and fill in `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY` in `backend/.env`

---

### Step 4 — Start the Backend

```bash
# From the backend/ directory
npm run dev          # Development mode (nodemon auto-reload)
# or
npm start            # Production mode
```

The API will be available at `http://localhost:3000`

Verify it's running:
```bash
curl http://localhost:3000/health
# → {"status":"OK","timestamp":"...","firebase":"dev-mode"}
```

---

### Step 5 — Frontend Setup

```bash
# Open a new terminal, navigate to frontend/
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will open at **`http://localhost:5173`**

---

### Step 6 — Build for Production (optional)

```bash
# Build frontend
cd frontend && npm run build

# The built files will be in frontend/dist/
# The backend auto-serves this directory in production
```

---

### Docker Setup (alternative)

```bash
# Build and start all services
docker-compose up --build

# Services started:
# - Backend:  http://localhost:3000
# - Frontend: http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `backend/.env` file with the following variables:

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | Express server port |
| `NODE_ENV` | No | `development` | Environment (`development` / `production`) |
| `WEATHER_API_KEY` | **Yes** | — | WeatherAPI.com API key — [get it here](https://www.weatherapi.com/my/) |
| `GEMINI_API_KEY` | **Yes** | — | Google Gemini API key — [get it here](https://aistudio.google.com/app/apikey) |
| `CACHE_TTL` | No | `600` | Weather cache lifetime in seconds (default 10 minutes) |
| `FRONTEND_URL` | No | `http://localhost:5173` | Frontend URL for CORS whitelist |
| `FIREBASE_PROJECT_ID` | **Yes** | — | Firebase project ID (e.g. `skysense-0000`) |
| `FIREBASE_CLIENT_EMAIL` | Prod | — | Firebase service account client email |
| `FIREBASE_PRIVATE_KEY` | Prod | — | Firebase service account private key (PEM format) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Alt | — | Path to Firebase service account JSON file (alternative to above) |
| `MONGODB_URI` | No | `mongodb://localhost:27017/skysense-ai` | MongoDB connection string (optional/legacy) |

**Example `backend/.env`:**

```env
# ── Server ──────────────────────────────────────────────────────
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# ── Weather ─────────────────────────────────────────────────────
WEATHER_API_KEY=your_weatherapi_key_here
CACHE_TTL=600

# ── AI ──────────────────────────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key_here

# ── Firebase ─────────────────────────────────────────────────────
FIREBASE_PROJECT_ID=your-project-id
# Production only (download from Firebase Console → Service Accounts):
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
```

> ⚠️ **Never commit `.env` to Git.** It is already in `.gitignore`.

---

## 📖 Usage Guide

### Create an Account

1. Open the app at `http://localhost:5173`
2. Click **"Create Account"** in the sidebar
3. Enter your name, email, and password — or click **"Continue with Google"**
4. Your profile is automatically created in Firestore

### Search for Weather

- Use the **search bar** in the top Navbar
- Type any city, landmark, or GPS coordinates (e.g. `13.08,80.27`)
- Press **Enter** or click the search icon
- The entire dashboard updates with live data for that location

### Use the AI Assistant

1. Click **"AI Assistant"** in the sidebar
2. Click **"New Chat"** to start a fresh conversation
3. Type any natural language question:
   - *"Do I need an umbrella today?"*
   - *"What should I wear for a 5km run in Bangalore?"*
   - *"Is the air quality safe for outdoor activities?"*
   - *"Show me the 5-day forecast for Mumbai"*
4. Watch the AI stream its answer in real-time, grounded in live weather data

### Use the Interactive Map

1. Click **"Maps"** in the sidebar
2. Use the layer toggle to switch between: **Rain**, **Cloud**, **Wind** overlays
3. Click any point on the map to load weather for those coordinates
4. Use the **GPS button** to detect your current location
5. Drag the **time slider** to see 24-hour forecast animations

### Save Locations

1. Log in to your account
2. Search for a location
3. Click the **bookmark icon** in the Navbar
4. Saved locations appear in your profile for quick access

### Health Center

1. Click **"Health Center"** in the sidebar
2. Review allergen levels, air contaminants, and UV radiation risk
3. Get personalized health advice for current conditions

## 📸 Screenshots

> All screenshots below are taken directly from the live SkySense AI application — dark glassmorphism UI, real weather data, zero placeholders.

---

### 📊 Live Weather Dashboard

*Real-time weather for Poonamallee, India — 34.2°C, Partly Cloudy. Shows UV Index, Air Quality (PM2.5), Wind State, and Humidity at a glance:*

![Live Weather Dashboard](docs/screenshots/weather.png)

---

### 📈 Hourly & 10-Day Forecast Charts

*Interactive Chart.js visualizations — Hourly Outlook (3-hour intervals) and 10-Day Max/Min Temperature Outlook, with Clothing Advice, Allergy & Health, and Transit & Travel insights:*

![Forecast Charts](docs/screenshots/charts.png)

---

### 🏠 Home — Full Weather Detail View

*Scrollable weather detail view with temperature trends, wind gauges, UV index, and precipitation breakdown:*

![Home View](docs/screenshots/home.png)

---

### 🌐 Extended Dashboard Overview

*Dashboard overview showing live weather observations, air quality parameters, allergen levels, and farming insights:*

![Dashboard Overview](docs/screenshots/dashboard.png)

---

### 🤖 AI Assistant

*Conversational AI chatbot powered by Google Gemini — grounded in live weather data with streaming SSE responses and voice input:*

![AI Chatbot](docs/screenshots/chat.png)

---

### 🗺️ Interactive Weather Map

*Leaflet.js interactive map with real-time Rain, Cloud, and Wind overlay layers, GPS detection, and click-to-search:*

![Interactive Map](docs/screenshots/map.png)

---

### 🌾 Farmer Mode — Agricultural Intelligence Dashboard

*AI-powered agricultural dashboard showing Estimated Soil Moisture (70%), Evapotranspiration Rate (4.5 mm/day), Irrigation Advisory, and real-time Crop Protection Alerts:*

![Farmer Mode](docs/screenshots/farmer.png)

---

### 🖥️ System Oversight & Analytics

*Real-time server monitoring panel — Cache Hit Ratio (79.5%), Rate Limit Overhead, Server Response Time (14 ms), and live log stream:*

![System Oversight](docs/screenshots/oversight.png)

---

### ⚙️ Account & Settings

*User profile management — Display Name, Temperature Unit preference, Default City, Data Export, and Account Deletion:*

![Account & Settings](docs/screenshots/settings.png)

---

### 🔐 Authentication — Sign In

*Secure email/password and Google OAuth sign-in with Firebase Authentication:*

![Sign In](docs/screenshots/login.png)

---

### 👤 Authentication — Register

*User registration with name, email, and password strength validation:*

![Registration](docs/screenshots/register.png)

---

## 📡 API Documentation

Base URL: `http://localhost:3000/api`

All protected endpoints require an `Authorization: Bearer <firebase-id-token>` header.

---

### 🌦️ Weather

#### `GET /api/weather`

Fetches current conditions + 10-day forecast + AQI + alerts for any location.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `q` | `string` | Yes | City name, ZIP code, or `lat,lon` coordinates |

**Request:**
```bash
curl "http://localhost:3000/api/weather?q=Mumbai"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "location": {
      "name": "Mumbai",
      "region": "Maharashtra",
      "country": "India",
      "lat": 19.07,
      "lon": 72.88,
      "localtime": "2026-07-03 20:15"
    },
    "current": {
      "temp_c": 29.4,
      "temp_f": 84.9,
      "feelslike_c": 35.1,
      "condition": { "text": "Partly cloudy", "icon": "//cdn.icon.png" },
      "humidity": 78,
      "wind_kph": 22.0,
      "wind_dir": "SW",
      "uv": 6,
      "precip_mm": 0.0,
      "pressure_mb": 1009,
      "vis_km": 10,
      "air_quality": {
        "co": 298.4,
        "no2": 14.3,
        "o3": 62.1,
        "pm2_5": 18.5,
        "pm10": 24.0,
        "us-epa-index": 2
      }
    },
    "forecast": {
      "forecastday": [ /* 10 days of hourly + daily data */ ]
    },
    "insights": {
      "clothing": { "type": "Summer Light", "advice": "Light breathable fabrics recommended." },
      "health": { "uv_risk": "High", "allergy_threat": "Moderate" },
      "travel": { "status": "Good", "advice": "Weather favorable for travel." },
      "farming": { "soil_moisture": "72%", "evapotranspiration": "4.2 mm/day" }
    },
    "alerts": { "alert": [] },
    "_cacheHit": false
  }
}
```

---

### 🤖 Chatbot

#### `POST /api/chatbot`

Sends a message to the AI assistant. Returns a **Server-Sent Events (SSE)** stream.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>   (optional — guests allowed)
```

**Request Body:**
```json
{
  "message": "Do I need an umbrella today?",
  "location": "Ooty",
  "sessionId": "abc-123-optional"
}
```

**SSE Response Stream:**
```
data: {"type":"start","sessionId":"e1e2a5c6-41cb-472b-8e9a-dd5c4604466b"}

data: {"type":"chunk","text":"🌧️ **Yes"}
data: {"type":"chunk","text":", carry"}
data: {"type":"chunk","text":" an umbrella!"}
...

data: {"type":"done","location":"Ooty","weatherSnapshot":{"temp_c":19.1,"condition":"Overcast","humidity":88,"wind_kph":12,"chance_of_rain":85}}
```

**Error Event:**
```
data: {"type":"error","message":"Weather service unavailable"}
```

#### `GET /api/chatbot/history/:sessionId`

Retrieves in-memory conversation history for a session.

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      { "role": "user", "parts": [{ "text": "Do I need an umbrella?" }] },
      { "role": "model", "parts": [{ "text": "🌧️ Yes, carry an umbrella!..." }] }
    ]
  }
}
```

---

### 👤 User Profile

All user routes require Firebase authentication.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/me` | Get current user profile |
| `PUT` | `/api/users/profile` | Update name / avatar / preferences |
| `POST` | `/api/users/locations` | Save a new location |
| `DELETE` | `/api/users/locations/:name` | Remove a saved location |
| `GET` | `/api/users/export` | Export all user data as JSON |
| `DELETE` | `/api/users/account` | Delete account + all data |

**`GET /api/users/me` Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "uid": "firebase-uid-abc123",
      "email": "user@example.com",
      "name": "Yuvan",
      "avatar": "",
      "savedLocations": [
        { "name": "Chennai", "lat": 13.08, "lon": 80.27, "country": "India" }
      ],
      "preferences": {
        "unit": "c",
        "defaultCity": "Chennai",
        "notifications": true
      }
    }
  }
}
```

**`PUT /api/users/profile` Request:**
```json
{
  "name": "Yuvan Shankar",
  "preferences": { "unit": "f", "defaultCity": "Mumbai" }
}
```

---

### 🔍 Health Check

#### `GET /health`

No authentication required.

```json
{
  "status": "OK",
  "timestamp": "2026-07-03T14:36:14.024Z",
  "firebase": "production"
}
```

---

## 🤖 AI Assistant

### How It Works

SkySense AI's assistant is built on three layers:

```
User Query
    ↓
Location Extraction (regex NLP)
    ↓
Live Weather Fetch (WeatherAPI.com)
    ↓
Grounded Prompt Construction
    ↓
Google Gemini AI (gemini-2.0-flash)  ←── Primary
    ↓ (on 404/429 — model waterfall)
gemini-1.5-flash-latest              ←── Secondary
    ↓ (on failure)
Rule-Based Fallback Engine           ←── Always available
    ↓
SSE Streaming Response
```

### Hallucination Prevention

The AI assistant **never hallucinates weather data**. Every Gemini prompt is built with this structure:

```
You are SkySense AI, a professional weather intelligence assistant.
You are grounded EXCLUSIVELY in the real-time weather data provided below.
Never hallucinate, invent, or estimate conditions beyond this data.

LIVE WEATHER DATA (Thu, 03 Jul 2026 14:36:14 GMT):
---
{
  "location": { "name": "Ooty", "country": "India", ... },
  "current": { "temp_c": 19.1, "humidity": 88, "chance_of_rain_pct": 85, ... },
  "forecast_today": { "max_temp_c": 22, "min_temp_c": 15, ... },
  ...
}
---

RULES:
- Answer in clear, helpful markdown (max 5–6 sentences)
- Always cite specific numbers from the data
- Be conversational and helpful, not robotic
- End with a short practical tip

USER QUERY: Do I need an umbrella today?
```

### Session Memory

- Sessions are stored **in-memory** (no database dependency)
- 2-hour TTL with automatic garbage collection every 30 minutes
- Up to 40 messages per session (oldest pruned automatically)
- Authenticated users: conversations synced to **Cloud Firestore**
- Guest users: conversations stored in **localStorage**

### Model Priority Waterfall

```javascript
const GEMINI_MODELS = [
  'gemini-2.0-flash',        // Primary — latest, fastest
  'gemini-1.5-flash-latest', // Secondary fallback
  'gemini-1.5-flash',        // Tertiary fallback
  'gemini-pro'               // Legacy fallback
];
// → Intelligent rule-based engine (15+ handlers) if all models fail
```

### Rule-Based Handlers (Quota-Free Mode)

When Gemini quota is exhausted, the following question types are handled natively with real weather data:

| Query Type | Example |
|---|---|
| Greetings | "Hello", "Hi" |
| Current weather | "What's the weather?" |
| Umbrella / Rain | "Do I need an umbrella?" |
| Temperature | "How hot is it?" |
| Wind | "Is it windy?" |
| Humidity | "How humid is it?" |
| Clothing advice | "What should I wear?" |
| Air quality | "Is the air quality good?" |
| UV / Sunscreen | "Do I need sunscreen?" |
| Forecast | "What's the 5-day forecast?" |
| Tomorrow | "What's tomorrow's weather?" |
| Sunrise/Sunset | "When does the sun set?" |
| Pressure | "What's the barometric pressure?" |
| Visibility / Fog | "Is there fog today?" |
| Outdoor activities | "Is it good for running?" |
| Storms | "Any thunderstorms expected?" |
| Snow / Ice | "Will it snow?" |

---

## 🌦️ Weather Data Pipeline

### Data Source

All weather data is sourced from **[WeatherAPI.com](https://weatherapi.com)**:

- **200,000+ locations** worldwide
- **Real-time** current conditions
- **Hourly** data (24 points/day)
- **10-day** extended forecast
- **Air Quality Index** (AQI) — CO, NO₂, O₃, SO₂, PM2.5, PM10
- **Severe Weather Alerts**
- **Astronomy** — Sunrise, Sunset, Moon phase

### Caching Strategy

```
Request → Cache Key (city name / rounded coordinates)
              ↓
        node-cache TTL: 10 minutes
              ↓
    Cache HIT → return instantly (0ms)
    Cache MISS → fetch from WeatherAPI → cache → return
```

This dramatically reduces API calls and latency. Cache keys use rounded coordinates (1 decimal place) to group nearby location queries.

### Forecast Padding

WeatherAPI's free tier returns 3 days. The `padForecastDays()` method extrapolates up to 10 days using the last day's data with subtle temperature variance (±1.2°C randomization) to fill the extended forecast.

### Rate Limiting

| Limit | Value |
|---|---|
| Global rate limit | 200 requests / 15 minutes |
| WeatherAPI free tier | 1,000,000 calls/month |
| Gemini free tier | Varies by model |

---

## 📱 Responsive Design

SkySense AI is fully responsive across all device types:

| Breakpoint | Screen Width | Layout |
|---|---|---|
| **Mobile** | 375px – 767px | Single column, bottom nav, collapsible sidebar |
| **Tablet** | 768px – 1023px | Two-column grid, partial sidebar |
| **Laptop** | 1024px – 1279px | Full sidebar + main content |
| **Desktop** | 1280px+ | Wide dashboard with multi-column cards |

### Mobile Optimizations
- Touch-friendly tap targets (44px minimum)
- Swipe gesture support on map
- Collapsible navigation
- Optimized chart sizes for small screens
- Voice input (Web Speech API) for hands-free queries

---

## ⚡ Performance

| Optimization | Implementation |
|---|---|
| **Weather Caching** | `node-cache` with 10-minute TTL — eliminates redundant API calls |
| **Bundle Splitting** | Vite automatic code splitting by route |
| **SSE Streaming** | AI responses stream token-by-token — no waiting |
| **Canvas Map Renderer** | Leaflet Canvas renderer for smooth 60fps map animations |
| **React Memoization** | `useCallback` and `useMemo` on expensive computations |
| **Debounced Search** | 300ms debounce on search input to prevent API spam |
| **Lazy Loading** | Components loaded on-demand (maps, charts) |
| **Asset Optimization** | Vite minification, tree-shaking, and Rollup bundling |

---

## 🔒 Security

| Layer | Implementation |
|---|---|
| **HTTP Headers** | Helmet.js — sets `X-Content-Type-Options`, `X-Frame-Options`, `HSTS`, CSP |
| **CORS** | Strict origin whitelist — only configured frontend URLs allowed |
| **Rate Limiting** | 200 requests / 15-minute window per IP |
| **Auth Tokens** | Firebase ID tokens (RS256 signed, 1-hour expiry, auto-refresh) |
| **Input Validation** | Joi schema validation on all request bodies |
| **Env Variables** | All secrets in `.env` — never in code or Git |
| **Password Hashing** | bcryptjs (salt rounds: 12) for legacy auth flow |
| **Dev Mode Guard** | Backend clearly warns when running without service account credentials |

---

## 🧪 Testing

### Running Tests

```bash
# Backend unit + integration tests
cd backend
npm test

# Run with coverage report
npm test -- --coverage

# Watch mode for development
npm test -- --watch
```

### Test Coverage

| Test File | What It Tests |
|---|---|
| `tests/api.test.js` | End-to-end API integration (weather, chatbot, health endpoints) |
| `tests/weatherService.test.js` | Weather data fetching, caching, error handling |
| `tests/chatbotService.test.js` | AI service, session management, fallback logic |

### Manual Testing Checklist

- [ ] Register with email + password
- [ ] Register with Google OAuth
- [ ] Search for 5 different global cities
- [ ] Ask AI: "Do I need an umbrella?" with location
- [ ] Ask AI: "What should I wear?"
- [ ] Switch temperature unit °C ↔ °F
- [ ] Open map and click a location
- [ ] Export conversation history (JSON)
- [ ] Save a location to profile
- [ ] Delete account

---

## 🚀 Deployment

### Frontend — Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend/
cd frontend
npm run build
vercel deploy --prod
```

**Vercel Environment Variables:**
No backend env vars are needed in the frontend — Firebase config is embedded in `src/lib/firebase.js`.

---

### Backend — Render / Railway

1. Push your code to GitHub
2. Connect the `backend/` folder as the root directory
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `node server.js`
5. Add all environment variables from your `.env` file

---

### Full Stack — Docker Compose

```bash
# Build and run all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

### Firebase / Firestore

Firestore is managed entirely through the Firebase Console. For production:

1. Go to Firestore → **Rules**
2. Set appropriate security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /conversations/{conversationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

## 🗺️ Roadmap

### ✅ Completed

- [x] Real-time weather dashboard (current + hourly + 10-day)
- [x] AI assistant with Gemini streaming + SSE
- [x] Firebase Authentication (Email + Google)
- [x] Firestore conversation persistence
- [x] Interactive Leaflet weather map
- [x] Health Center (allergens, AQI, UV)
- [x] Travel Mode weather advisory
- [x] Farmer Mode (soil moisture, evapotranspiration)
- [x] Chart.js hourly + 7-day visualizations
- [x] Responsive design (mobile + desktop)
- [x] Voice input (Web Speech API)
- [x] Text-to-speech output
- [x] Conversation import/export
- [x] Model priority waterfall (4 Gemini models)
- [x] Rule-based fallback with 15+ handlers
- [x] Rate limiting + Helmet security

### 🔄 In Progress

- [ ] E2E Playwright test suite
- [ ] Admin dashboard with real analytics
- [ ] Weather alert push notifications

### 🔜 Upcoming

- [ ] Progressive Web App (PWA) with offline support
- [ ] Multi-language support (Hindi, Tamil, Spanish)
- [ ] 15-day extended forecast
- [ ] Weather radar animations
- [ ] Customizable widget dashboard (drag & drop)
- [ ] Share weather cards (social media)
- [ ] Historical weather data
- [ ] Weather comparison between two cities
- [ ] API rate limit dashboard for admins
- [ ] Native mobile apps (React Native)

---

## ⚠️ Known Issues

| Issue | Status | Workaround |
|---|---|---|
| Gemini free-tier quota exhausted | ⚠️ Expected | Rule-based fallback activates automatically |
| Firebase offline mode warning in console | 🔍 Cosmetic | Handled gracefully with localStorage fallback |
| Map tiles CORS error on some networks | 🔍 Known | Use VPN or switch to HTTPS |
| Speech recognition not available in Firefox | 🔍 Browser limitation | Use Chrome or Edge |
| `gemini-1.5-flash` returning 404 | ✅ Fixed | Model waterfall skips unavailable models |

---

## ❓ FAQ

<details>
<summary><strong>1. Is SkySense AI free to use?</strong></summary>

Yes! The app is open source and free. However, you need your own API keys:
- **WeatherAPI.com** free tier: 1,000,000 calls/month
- **Google Gemini** free tier: Limited daily quota (resets midnight Pacific Time)

</details>

<details>
<summary><strong>2. Why is the AI Assistant not responding with Gemini?</strong></summary>

The Gemini free-tier API key has a daily quota limit. When exhausted, the intelligent rule-based fallback activates automatically. Your questions are still answered using real live weather data — just without the LLM layer. The quota resets at midnight Pacific Time (~12:30 PM IST).

</details>

<details>
<summary><strong>3. Can I use SkySense AI without creating an account?</strong></summary>

Yes! Guest mode gives full access to weather data, the AI assistant, and the interactive map. Creating an account unlocks: persistent conversation history across devices, saved locations, and profile preferences.

</details>

<details>
<summary><strong>4. How accurate is the weather data?</strong></summary>

All data comes directly from WeatherAPI.com, which sources from national meteorological agencies and weather station networks. Accuracy is comparable to major weather services like Weather.com.

</details>

<details>
<summary><strong>5. Does the AI ever make up weather data?</strong></summary>

No. Every AI response is grounded exclusively in live WeatherAPI.com data that is injected into the Gemini prompt. The system prompt explicitly prohibits hallucination, and the rule-based fallback only uses data from the API response.

</details>

<details>
<summary><strong>6. How do I get my own Gemini API key?</strong></summary>

1. Visit [aistudio.google.com](https://aistudio.google.com)
2. Sign in with a Google account
3. Click **Get API Key** → Create API Key
4. Copy the key into `backend/.env` as `GEMINI_API_KEY`

</details>

<details>
<summary><strong>7. What happens if WeatherAPI.com is down?</strong></summary>

The backend returns a descriptive error message. The frontend displays the error gracefully with a retry button. The weather cache will serve the last known data if available.

</details>

<details>
<summary><strong>8. How is user data stored?</strong></summary>

- **Authenticated users:** Profile and conversations in Cloud Firestore (Google's servers)
- **Guest users:** Conversation history in browser `localStorage` (device only)
- **Backend sessions:** In-memory (not persisted across server restarts)

</details>

<details>
<summary><strong>9. Can I self-host SkySense AI?</strong></summary>

Yes! The entire stack can be self-hosted using Docker Compose. You'll need your own API keys for WeatherAPI.com, Gemini AI, and Firebase.

</details>

<details>
<summary><strong>10. Does SkySense AI support multiple languages?</strong></summary>

The UI is currently English-only. Multi-language support (Hindi, Tamil, Spanish) is on the roadmap.

</details>

<details>
<summary><strong>11. Why does the map not load on some networks?</strong></summary>

The map uses OpenStreetMap tiles, which may be blocked by some corporate firewalls or require HTTPS. Try accessing the app over HTTPS or use a VPN.

</details>

<details>
<summary><strong>12. How does the Farmer Mode calculate soil moisture?</strong></summary>

Soil moisture is estimated using a formula based on current humidity, precipitation data, and temperature: `max(30, min(95, round(100 - humidity * 0.5 + (precip > 0 ? 20 : 0))))`. It's an approximation, not a sensor reading.

</details>

<details>
<summary><strong>13. Can I contribute to SkySense AI?</strong></summary>

Absolutely! See the [Contributing](#-contributing) section below.

</details>

<details>
<summary><strong>14. Why does the 10-day forecast show repeated data after day 3?</strong></summary>

WeatherAPI.com's free tier provides 3 days of forecast. SkySense AI extrapolates the remaining days using the last available day's data with slight temperature variance. Upgrade to a paid WeatherAPI plan for full 10-day accuracy.

</details>

<details>
<summary><strong>15. Does SkySense AI work offline?</strong></summary>

Not currently. PWA with offline support is on the roadmap. For now, an internet connection is required for weather data and AI responses.

</details>

---

## 🤝 Contributing

Contributions are welcome and greatly appreciated! Every contribution — code, design, bug reports, or documentation — helps make SkySense AI better.

### Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/SkySense-AI.git
   ```
3. **Create a branch** following the naming convention:
   ```bash
   git checkout -b feature/add-weather-alerts
   # or
   git checkout -b fix/chatbot-streaming-bug
   # or
   git checkout -b docs/update-api-docs
   ```

### Branch Naming Convention

| Prefix | Use For |
|---|---|
| `feature/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation updates |
| `refactor/` | Code refactoring (no feature change) |
| `test/` | Adding or updating tests |
| `chore/` | Build process, config changes |

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

Examples:
feat(chatbot): add voice input support
fix(weather): handle missing air quality data gracefully
docs(readme): add deployment guide for Railway
refactor(auth): simplify Firebase token refresh logic
test(weather-service): add cache invalidation tests
```

### Pull Request Process

1. Ensure all tests pass: `npm test`
2. Update `README.md` if you added new features or changed setup steps
3. Add a clear PR description explaining **what**, **why**, and **how**
4. Link any related issues: `Fixes #42`
5. Request a review from the maintainer

### Code Style

- **JavaScript:** Use ES2022+ features, async/await, optional chaining
- **React:** Functional components + hooks only (no class components)
- **CSS:** Tailwind utility classes; avoid custom CSS unless necessary
- **Comments:** Document complex logic, not obvious code
- **Variables:** Clear, descriptive names — no single-letter variables outside loops

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full text.

```
MIT License

Copyright (c) 2026 Yuvathilagan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👤 Author

<div align="center">

<img src="https://avatars.githubusercontent.com/yuva-1237" width="100px" style="border-radius:50%" alt="Author Avatar" />

### **Yuvathilagan**
*Full Stack Developer · AI Engineer · Open Source Contributor*

[![GitHub](https://img.shields.io/badge/GitHub-@yuva--1237-181717?style=for-the-badge&logo=github)](https://github.com/yuva-1237)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/yuvathilagan-%E2%80%8C-806681308/)
[![Email](https://img.shields.io/badge/Email-yuvathilagan@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:yuvathilagan@gmail.com)

> *"Building intelligent systems that make sense of the world — one API call at a time."*

</div>

---

## 🙏 Acknowledgements

This project was made possible by the following incredible technologies and teams:

| Technology | Contribution |
|---|---|
| [WeatherAPI.com](https://weatherapi.com) | Real-time global weather data |
| [Google Gemini AI](https://ai.google.dev) | Natural language intelligence |
| [Firebase / Google Cloud](https://firebase.google.com) | Auth, Firestore, hosting |
| [OpenStreetMap](https://openstreetmap.org) | Open map tiles |
| [Leaflet.js](https://leafletjs.com) | Interactive map library |
| [Chart.js](https://chartjs.org) | Beautiful data visualizations |
| [Vite](https://vitejs.dev) | Lightning-fast build tooling |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS framework |
| [React Team](https://react.dev) | UI framework |
| [Express.js](https://expressjs.com) | Minimal Node.js web framework |
| [Winston](https://github.com/winstonjs/winston) | Production-grade logging |
| [Helmet.js](https://helmetjs.github.io) | HTTP security hardening |
| [Material Symbols](https://fonts.google.com/icons) | Icon library |

---

<div align="center">

**⭐ If SkySense AI helped you or inspired you, please give it a star! ⭐**

[![Star this repo](https://img.shields.io/github/stars/yuva-1237/SkySense-AI?style=social)](https://github.com/yuva-1237/SkySense-AI)

*Made with ❤️ and ☁️ weather data*

</div>
