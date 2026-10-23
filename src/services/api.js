const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

async function request(
  endpoint,
  options = {}
) {
  const token =
    localStorage.getItem(
      "weathercart-token"
    );

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),

        ...(options.headers || {}),
      },
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong"
    );
  }

  return data;
}

export const api = {
  getProducts: (params = "") =>
    request(`/products${params}`),

  getSuggestions: (query) =>
    request(`/products/suggestions?q=${encodeURIComponent(query)}`),

  getFilterOptions: () =>
    request("/products/filter-options"),

  getProduct: (id) =>
    request(`/products/${id}`),

  validateCoupon: (code, subtotal) =>
    request("/orders/validate-coupon", {
      method: "POST",
      body: JSON.stringify({ code, subtotal }),
    }),

  createOrder: (order) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    }),

  verifyPayment: (data) =>
    request("/orders/verify-payment", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMyOrders: () =>
    request("/orders/my-orders"),

  getOrder: (id) =>
    request(`/orders/${id}`),

  cancelOrder: (id) =>
    request(
      `/orders/${id}/cancel`,
      {
        method: "PATCH",
      }
    ),

  getProductReviews: (productId, params = "") =>
    request(`/reviews/product/${productId}${params}`),

  submitReview: (productId, reviewData) =>
    request(`/reviews/product/${productId}`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),

  voteReviewHelpful: (reviewId) =>
    request(`/reviews/${reviewId}/helpful`, {
      method: "POST",
    }),

  trackAnalyticsEvent: (eventData) =>
    request("/analytics/event", {
      method: "POST",
      body: JSON.stringify(eventData),
    }),

  getAnalyticsDashboard: () =>
    request("/analytics/dashboard"),
};
