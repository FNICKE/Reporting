export const BACKEND_ROOT_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `${BACKEND_ROOT_URL}/api`;

export default API_BASE_URL;
