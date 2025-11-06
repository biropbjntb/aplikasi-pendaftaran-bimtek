// FIX: Add type definitions for Vite's `import.meta.env` to resolve TypeScript errors.
// This ensures that the TypeScript compiler recognizes the `env` property on `import.meta`.
interface ImportMetaEnv {
  readonly VITE_APPS_SCRIPT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { RegistrationData } from './types';

const SCRIPT_URL_LOCAL_STORAGE_KEY = 'googleScriptUrl';

/**
 * Sets the script URL in local storage. This is useful for development or
 * when an environment variable is not available.
 * @param {string} url - The Google Apps Script URL.
 */
export const setScriptUrl = (url: string): void => {
  localStorage.setItem(SCRIPT_URL_LOCAL_STORAGE_KEY, url);
};

/**
 * Gets the script URL from the VITE_APPS_SCRIPT_URL environment variable as the first priority.
 * If not found, it falls back to checking local storage.
 * @returns {string} The script URL or an empty string if not set in either location.
 */
// FIX: Export `getScriptUrl` so it can be imported and used in other modules like App.tsx.
export const getScriptUrl = (): string => {
  // Vite exposes env variables on import.meta.env. This is the primary method for production.
  // The check for `import.meta.env` prevents runtime errors in environments where it's not defined.
  const scriptUrlFromEnv = (typeof import.meta !== 'undefined' && import.meta.env) 
    ? import.meta.env.VITE_APPS_SCRIPT_URL 
    : undefined;

  if (scriptUrlFromEnv) {
    return scriptUrlFromEnv;
  }
  
  // Fallback to local storage for local development or manual configuration.
  const scriptUrlFromStorage = localStorage.getItem(SCRIPT_URL_LOCAL_STORAGE_KEY);
  if (scriptUrlFromStorage) {
    return scriptUrlFromStorage;
  }

  // If neither is found, we warn the developer. The app UI should handle this state.
  console.warn("Google Apps Script URL is not configured. Set the VITE_APPS_SCRIPT_URL environment variable or configure the URL in the application UI.");
  return '';
};


/**
 * Mengambil semua data pendaftaran dari Google Sheet.
 * @returns {Promise<RegistrationData[]>}
 */
export const getRegistrations = async (): Promise<RegistrationData[]> => {
  const scriptUrl = getScriptUrl();
  if (!scriptUrl) {
    throw new Error("Google Apps Script URL is not configured. Please set it up in the app or via environment variables.");
  }

  const response = await fetch(scriptUrl);
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(`Apps Script Error: ${result.message}`);
  }

  // Rekonstruksi struktur data yang diharapkan oleh frontend
  const formattedData: RegistrationData[] = result.data.map((item: any) => ({
    registrationId: item.registrationId,
    timestamp: item.timestamp, // Keep timestamp for sorting
    company: {
      npwp: item.npwp,
      companyName: item.companyName,
      businessType: item.businessType,
      address: item.address,
      city: item.city,
      postalCode: item.postalCode,
    },
    participant: {
      fullName: item.fullName,
      position: item.position,
      email: item.email,
      phone: item.phone,
    }
  }));

  // Urutkan berdasarkan timestamp (data terbaru di atas)
  return formattedData.sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  });
};

/**
 * Menambahkan data pendaftaran baru ke Google Sheet.
 * @param {RegistrationData} data - Data pendaftaran untuk dikirim.
 * @returns {Promise<any>}
 */
export const addRegistration = async (data: RegistrationData): Promise<any> => {
  const scriptUrl = getScriptUrl();
  if (!scriptUrl) {
    throw new Error("Google Apps Script URL is not configured. Please set it up in the app or via environment variables.");
  }

  const response = await fetch(scriptUrl, {
    method: 'POST',
    mode: 'no-cors', // Changed to 'no-cors' to prevent CORS errors on redirect.
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // When using 'no-cors', the response will be of type 'opaque'. We can't read
  // the status or body, so we assume the request was sent successfully if fetch
  // itself doesn't throw a network error.
  if (response.type === 'opaque' || response.ok) {
     return { success: true };
  } else {
    throw new Error(`Failed to submit registration. Status: ${response.status}`);
  }
};
