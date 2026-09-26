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

  getProduct: (id) =>
    request(`/products/${id}`),

  createOrder: (order) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(order),
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
};
