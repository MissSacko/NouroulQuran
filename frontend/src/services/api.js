const API_URL = "http://localhost:5000/api";

// =========================
// SERIES
// =========================

export async function getSeries() {
  const response = await fetch(`${API_URL}/series`);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des séries");
  }

  return response.json();
}

export async function getSerieBySlug(slug) {
  const response = await fetch(`${API_URL}/series/${slug}`);

  if (!response.ok) {
    throw new Error("Série introuvable");
  }

  return response.json();
}


// =========================
// SOIRÉES
// =========================

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

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des soirées");
  }

  return response.json();
}

export async function getSoireeBySlug(slug) {
  const response = await fetch(`${API_URL}/soirees/${slug}`);

  if (!response.ok) {
    throw new Error("Soirée introuvable");
  }

  return response.json();
}


// =========================
// TAFSIR
// =========================

export async function getTafsirs() {
  const response = await fetch(`${API_URL}/tafsirs`);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des tafsirs");
  }

  return response.json();
}

export async function getTafsirBySlug(slug) {
  const response = await fetch(`${API_URL}/tafsirs/${slug}`);

  if (!response.ok) {
    throw new Error("Tafsir introuvable");
  }

  return response.json();
}

//

export async function getEvents() {
  const response = await fetch(`${API_URL}/events`);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des événements");
  }

  return response.json();
}


export async function getUpcomingEvents() {
  const response = await fetch(`${API_URL}/events/upcoming`);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des événements à venir");
  }

  return response.json();
}


export async function getEventBySlug(slug) {
  const response = await fetch(`${API_URL}/events/${slug}`);

  if (!response.ok) {
    throw new Error("Événement introuvable");
  }

  return response.json();
}