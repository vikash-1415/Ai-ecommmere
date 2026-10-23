import { API_URL } from "./apiBaseUrl";

async function track(endpoint, productId, metadata = {}) {
  const token = localStorage.getItem("weathercart-token");
  if (!token || !productId) return;

  try {
    const response = await fetch(`${API_URL}/behavior/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, ...metadata }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.message || `Activity tracking failed (${response.status})`);
    }
  } catch (error) {
    console.error("Behavior analytics request failed:", error);
  }
}

export const behaviorApi = {
  viewProduct: (productId) => track("view", productId),
  wishlist: (productId) => track("wishlist", productId),
  cartAdd: (productId) => track("cart", productId),
  recommendationClick: (productId, algorithmVersion) =>
    track("recommendation-click", productId, { algorithmVersion }),
};
