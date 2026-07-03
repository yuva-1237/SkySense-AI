// ─── Base API helper (Firebase-aware) ─────────────────────────────────────────
// Attaches the Firebase ID token automatically on every request.
// On 401, forces a token refresh and retries once.

import { auth } from '../lib/firebase';

const BASE = '/api';

async function getFirebaseToken() {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken();
  } catch (_) {
    return null;
  }
}

async function request(path, options = {}, retry = true) {
  const token = await getFirebaseToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  // Silent token refresh on 401
  if (res.status === 401 && retry) {
    try {
      const user = auth.currentUser;
      if (user) {
        await user.getIdToken(true); // force refresh
        return request(path, options, false);
      }
    } catch (_) {
      // Refresh failed
    }
  }

  return res;
}

// ─── Weather ─────────────────────────────────────────────────────────────────
export async function fetchWeather(query) {
  const res = await request(`/weather?q=${encodeURIComponent(query)}`);
  const result = await res.json();
  if (!res.ok) throw new Error(result.error?.message || result.message || 'Failed to fetch weather data');
  return result.data;
}

// ─── Chatbot ─────────────────────────────────────────────────────────────────
export async function sendChatMessageStream(message, sessionId = null, activeLocation = '', onChunk, onMeta, signal = null) {
  const body = { message };
  if (sessionId) body.sessionId = sessionId;
  if (activeLocation) body.location = activeLocation;

  const res = await request('/chatbot', {
    method: 'POST',
    body: JSON.stringify(body),
    signal
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || errorData.message || 'Failed to connect to assistant');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep the last partial line in buffer

    for (const line of lines) {
      const cleaned = line.trim();
      if (!cleaned.startsWith('data: ')) continue;
      const dataStr = cleaned.slice(6);
      if (!dataStr) continue;

      try {
        const data = JSON.parse(dataStr);
        if (data.type === 'start') {
          onMeta({ sessionId: data.sessionId });
        } else if (data.type === 'chunk') {
          onChunk(data.text);
        } else if (data.type === 'done') {
          onMeta({ location: data.location, weatherSnapshot: data.weatherSnapshot });
        } else if (data.type === 'error') {
          throw new Error(data.message);
        }
      } catch (e) {
        // Parse error or validation error
      }
    }
  }
}

export async function fetchChatHistory(sessionId) {
  const res = await request(`/chatbot/history/${sessionId}`);
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to load chat history');
  return result.data.messages;
}

// ─── User profile (Firestore-backed via backend) ─────────────────────────────
export async function fetchUserProfile() {
  const res = await request('/users/me');
  if (!res.ok) return null;
  const result = await res.json();
  return result.data?.profile || null;
}

export async function updateUserProfile(updates) {
  const res = await request('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Profile update failed');
  return result.data.profile;
}

export async function saveLocation(location) {
  const res = await request('/users/locations', {
    method: 'POST',
    body: JSON.stringify(location)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Could not save location');
  return result.data.savedLocations;
}

export async function unsaveLocation(name) {
  const res = await request(`/users/locations/${encodeURIComponent(name)}`, { method: 'DELETE' });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Could not remove location');
  return result.data.savedLocations;
}

export async function exportUserData() {
  const res = await request('/users/export');
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Export failed');
  return result.data;
}

export async function deleteUserAccount() {
  const res = await request('/users/account', { method: 'DELETE' });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Account deletion failed');
  return result;
}
