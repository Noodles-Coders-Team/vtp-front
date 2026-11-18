const port = (import.meta.env.VITE_BACKEND_PORT as string | undefined)?.trim() || '8080';

export const BACKEND_URL = `${window.location.protocol}//${window.location.hostname}:${port}`;
