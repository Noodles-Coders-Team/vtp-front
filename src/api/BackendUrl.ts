const explicitUrl = (import.meta.env.VITE_BACKEND_URL as string | undefined)?.trim();
const port = (import.meta.env.VITE_BACKEND_PORT as string | undefined)?.trim() || '8080';

export const BACKEND_URL = explicitUrl
    ? explicitUrl.replace(/\/+$/, '')
    : `${window.location.protocol}//${window.location.hostname}:${port}`;
