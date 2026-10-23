const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─────────────────────────────────────────────
// Weather
// ─────────────────────────────────────────────

export async function fetchWeather(latitude, longitude) {
  const response = await fetch(
    `${API_URL}/weather/current?lat=${latitude}&lon=${longitude}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch weather");
  }
  return data.weather;
}

// ─────────────────────────────────────────────
// Public recommendations (no auth needed)
// ─────────────────────────────────────────────

export async function fetchRecommendations(weather) {
  const params = new URLSearchParams({
    temperature: weather.temperature,
    humidity: weather.humidity,
    condition: weather.condition,
  });

  const response = await fetch(`${API_URL}/recommendations?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Recommendation failed");
  }
  return data;
}

// ─────────────────────────────────────────────
// Personalized recommendations (logged-in user)
// ─────────────────────────────────────────────

export async function fetchPersonalizedRecommendations(weather) {
  const token = localStorage.getItem("weathercart-token");

  // Fall back to public endpoint if not logged in
  if (!token) return fetchRecommendations(weather);

  const params = new URLSearchParams({
    temperature: weather.temperature,
    humidity: weather.humidity,
    condition: weather.condition,
  });

  try {
    const response = await fetch(
      `${API_URL}/recommendations/personalized?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Token expired or invalid — fall back to public
      return fetchRecommendations(weather);
    }

    return data;
  } catch {
    // Network issue — fall back to public
    return fetchRecommendations(weather);
  }
}

async function fetchProductRecommendations(productId, type) {
  const response = await fetch(
    `${API_URL}/recommendations/${encodeURIComponent(productId)}/${type}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Unable to load product recommendations");
  }
  return data;
}

export const fetchSimilarProducts = (productId) =>
  fetchProductRecommendations(productId, "similar");

export const fetchFrequentlyBoughtTogether = (productId) =>
  fetchProductRecommendations(productId, "frequently-bought-together");
