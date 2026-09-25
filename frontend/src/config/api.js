const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL?.trim();
const localBackendUrl = "http://localhost:5000";
const deployedBackendUrl = "https://reportbackend.sainikshetkari.org";

export const BACKEND_ROOT_URL = (
  configuredBackendUrl || (import.meta.env.DEV ? localBackendUrl : deployedBackendUrl)
).replace(/\/+$/, "");

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = (
  configuredApiBaseUrl || `${BACKEND_ROOT_URL}/api`
).replace(/\/+$/, "");

export default API_BASE_URL;
