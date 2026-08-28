// =====================================================
// API CONFIGURATION
// Auto-detects Localhost vs Production backend
// =====================================================

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

export const BACKEND_ROOT_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (isLocalhost
    ? "http://localhost:5000"
    : "https://reportbackend.sainikshetkari.org");

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `${BACKEND_ROOT_URL}/api`;

export default API_BASE_URL;
