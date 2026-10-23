import { api } from "./api";

// Generate or retrieve persistent anonymous session ID
function getSessionId() {
  let sid = sessionStorage.getItem("weathercart_sid");
  if (!sid) {
    sid = `sid_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    sessionStorage.setItem("weathercart_sid", sid);
  }
  return sid;
}

export const analytics = {
  track: async (eventType, payload = {}) => {
    try {
      const eventData = {
        eventType,
        sessionId: getSessionId(),
        timestamp: new Date().toISOString(),
        ...payload,
      };

      // Non-blocking network request
      api.trackAnalyticsEvent(eventData).catch(() => {
        // Silently capture any network hiccups without interrupting user
      });
    } catch (e) {
      // Fail safely
    }
  },

  trackView: (product, weather = "all-weather", city = "Default City") => {
    analytics.track("product_view", {
      productId: product?.id || product?._id,
      productName: product?.name,
      category: product?.category,
      orderValue: product?.price,
      weather,
      city,
    });
  },

  trackRecommendationClick: (product, weather = "all-weather", city = "Default City") => {
    analytics.track("recommendation_click", {
      productId: product?.id || product?._id,
      productName: product?.name,
      category: product?.category,
      orderValue: product?.price,
      isRecommendation: true,
      weather,
      city,
    });
  },

  trackCartAdd: (product, quantity = 1, weather = "all-weather", city = "Default City") => {
    analytics.track("cart_add", {
      productId: product?.id || product?._id,
      productName: product?.name,
      category: product?.category,
      orderValue: (product?.price || 0) * quantity,
      quantity,
      weather,
      city,
    });
  },

  trackCheckoutStart: (subtotal = 0, itemCount = 1, weather = "all-weather", city = "Default City") => {
    analytics.track("checkout_start", {
      orderValue: subtotal,
      itemCount,
      weather,
      city,
    });
  },

  trackPurchase: (orderNumber, total = 0, items = [], weather = "all-weather", city = "Default City") => {
    analytics.track("purchase", {
      orderNumber,
      orderValue: total,
      itemCount: items.length,
      productName: items[0]?.name || "Order Items",
      weather,
      city,
    });
  },
};
