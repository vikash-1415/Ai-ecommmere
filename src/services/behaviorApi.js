const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Generic tracker — silently ignores failures so shopping
 * flow is never interrupted by analytics errors.
 */
async function track(endpoint, productId) {
  const token = localStorage.getItem("weathercart-token");

  // Only track for logged-in users
  if (!token) return;

  try {
    await fetch(`${API_URL}/behavior/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
  } catch {
    // Analytics failure must never break the shopping experience
  }
}

export const behaviorApi = {
  /**
   * Track when a user views a product detail page.
   * Increments view count + category preference score by +1.
   */
  viewProduct: (productId) => track("view", productId),

  /**
   * Track when a user wishlists a product.
   * Increments category preference score by +3.
   */
  wishlist: (productId) => track("wishlist", productId),
};
