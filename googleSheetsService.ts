// Manually define types for import.meta.env to resolve TypeScript errors.
// This ensures that 'import.meta.env.VITE_APPS_SCRIPT_URL' is recognized
// without relying on a triple-slash directive that might fail in some environments.
interface ImportMetaEnv {
  readonly VITE_APPS_SCRIPT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { RegistrationData } from './types';

/**
 * Gets the script URL from the VITE_APPS_SCRIPT_URL environment variable.
 * @returns {string} The script URL or an empty string if not set.
 */
const getScriptUrl = (): string => {
  // Vite exposes env variables on import.meta.env.
  // The VITE_ prefix is required for Vite to expose it to the client-side code.
  const scriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
  if (!scriptUrl) {
    // This log is helpful for developers during local testing.
    console.warn("VITE_APPS_SCRIPT_URL environment variable is not set. The application will not be able to connect to Google Sheets.");
  }
  return scriptUrl || '';
};

/**
 * Mengambil semua data pendaftaran dari Google Sheet.
 * @returns {Promise<RegistrationData[]>}
 */
export const getRegistrations = async (): Promise<RegistrationData[]> => {
  const scriptUrl = getScriptUrl();
  if (!scriptUrl) {
    throw new Error("VITE_APPS_SCRIPT_URL is not configured in your environment variables.");
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
    throw new Error("VITE_APPS_SCRIPT_URL is not configured in your environment variables.");
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
