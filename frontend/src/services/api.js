
const API_URL = "http://localhost:5000/api";

// =====================================================
// CLÉ ADMINISTRATEUR — AUTHENTIFICATION TEMPORAIRE
// =====================================================

const ADMIN_KEY_STORAGE = "nouroul_admin_key";

export function saveAdminKey(key) {
  localStorage.setItem(ADMIN_KEY_STORAGE, key);
}

export function getAdminKey() {
  return localStorage.getItem(ADMIN_KEY_STORAGE);
}

export function removeAdminKey() {
  localStorage.removeItem(ADMIN_KEY_STORAGE);
}

export function isAdminAuthenticated() {
  return Boolean(getAdminKey());
}

// =====================================================
// FONCTION HTTP COMMUNE
// =====================================================

async function request(url, options = {}) {
  const response = await fetch(url, options);

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error || `Erreur HTTP ${response.status}`
    );
  }

  return data;
}

// =====================================================
// FONCTION HTTP ADMIN
// =====================================================

async function adminRequest(endpoint, options = {}) {
  const key = getAdminKey();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (key) {
    headers["X-Admin-Key"] = key;
  }

  return request(`${API_URL}/admin${endpoint}`, {
    ...options,
    headers,
  });
}

// =====================================================
// SÉRIES — PUBLIC
// =====================================================

export async function getSeries() {
  return request(`${API_URL}/series`);
}

export async function getSerieBySlug(slug) {
  return request(`${API_URL}/series/${slug}`);
}

// =====================================================
// SÉRIES — ADMIN
// =====================================================

export async function createSeries(data) {
  return adminRequest("/series", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSeries(id, data) {
  return adminRequest(`/series/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSeries(id) {
  return adminRequest(`/series/${id}`, {
    method: "DELETE",
  });
}

// =====================================================
// SOIRÉES — PUBLIC
// =====================================================

export async function getSoirees(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.series) {
    searchParams.append("series", params.series);
  }

  if (params.category) {
    searchParams.append("category", params.category);
  }

  const query = searchParams.toString();
  const url = query
    ? `${API_URL}/soirees?${query}`
    : `${API_URL}/soirees`;

  return request(url);
}

export async function getSoireeBySlug(slug) {
  return request(`${API_URL}/soirees/${slug}`);
}

// =====================================================
// SOIRÉES — ADMIN
// =====================================================

export async function createSoiree(data) {
  return adminRequest("/soirees", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSoiree(id, data) {
  return adminRequest(`/soirees/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSoiree(id) {
  return adminRequest(`/soirees/${id}`, {
    method: "DELETE",
  });
}

// =====================================================
// TAFSIRS — PUBLIC
// =====================================================

export async function getTafsirs() {
  return request(`${API_URL}/tafsirs`);
}

export async function getTafsirBySlug(slug) {
  return request(`${API_URL}/tafsirs/${slug}`);
}

// =====================================================
// TAFSIRS — ADMIN
// =====================================================

export async function createTafsir(data) {
  return adminRequest("/tafsirs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTafsir(id, data) {
  return adminRequest(`/tafsirs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteTafsir(id) {
  return adminRequest(`/tafsirs/${id}`, {
    method: "DELETE",
  });
}

// =====================================================
// ÉVÉNEMENTS — PUBLIC
// =====================================================

export async function getEvents() {
  return request(`${API_URL}/events`);
}

export async function getUpcomingEvents() {
  return request(`${API_URL}/events/upcoming`);
}

export async function getEventBySlug(slug) {
  return request(`${API_URL}/events/${slug}`);
}

// =====================================================
// ÉVÉNEMENTS — ADMIN
// =====================================================

export async function createEvent(data) {
  return adminRequest("/events", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateEvent(id, data) {
  return adminRequest(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(id) {
  return adminRequest(`/events/${id}`, {
    method: "DELETE",
  });
}
