export interface CompanyData {
  npwp: string;
  companyName: string;
  businessType: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface ParticipantData {
  fullName: string;
  position: string;
  email: string;
  phone: string;
}

export interface RegistrationData {
  registrationId?: string;
  timestamp?: string;
  company: CompanyData;
  participant: ParticipantData;
}

export interface Step {
  id: number;
  name: string;
}

export type FormErrors = {
  company?: { [K in keyof CompanyData]?: string };
  participant?: { [K in keyof ParticipantData]?: string };
};
