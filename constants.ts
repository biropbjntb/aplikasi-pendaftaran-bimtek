// FIX: Import the 'Step' type to resolve the "Cannot find name 'Step'" error.
import { Step } from './types';

export const STEPS: Step[] = [
  { id: 1, name: 'Data Perusahaan' },
  { id: 2, name: 'Data Peserta' },
  { id: 3, name: 'Konfirmasi & Kirim' },
];

export const BUSINESS_TYPES: string[] = [
  "Perseroan Terbatas (PT)",
  "Commanditaire Vennootschap (CV)",
  "Firma",
  "Perorangan",
  "Koperasi",
  "Lainnya"
];

export const REGISTRATION_QUOTA = 100;
export const ADMIN_PASSWORD = 'admin123';
