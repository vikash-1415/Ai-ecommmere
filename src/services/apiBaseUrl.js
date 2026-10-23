const DEFAULT_API_URL = "https://ai-ecommmere-backend.vercel.app/api";
const configuredApiUrl =
  import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_URL;
const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, "");

export const API_URL = /\/api$/i.test(normalizedApiUrl)
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;
