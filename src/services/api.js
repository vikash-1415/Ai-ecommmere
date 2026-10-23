import { API_URL } from "./apiBaseUrl";

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
    const error = new Error(
      data.message ||
        "Something went wrong"
    );
    error.code = data.code;
    throw error;
  }

  return data;
}

export const api = {
  verifyEmail: (email, token) =>
    request("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, token }),
    }),

  resendVerificationEmail: (email) =>
    request("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  forgotPassword: (email) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (email, token, password) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, token, password }),
    }),

  getCart: () =>
    request("/cart"),

  saveCart: (items) =>
    request("/cart", {
      method: "PUT",
      body: JSON.stringify({ items }),
    }),

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
