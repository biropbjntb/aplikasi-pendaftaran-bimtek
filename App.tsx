import React, { useState, useCallback, useEffect } from 'react';
import { RegistrationData, FormErrors } from './types';
import { STEPS } from './constants';
import Stepper from './components/Stepper';
import Step1CompanyData from './components/Step1CompanyData';
import Step2ParticipantData from './components/Step2ParticipantData';
import Step3Confirmation from './components/Step3Confirmation';
import Step4Success from './components/Step4Success';
import RegisteredListModal from './components/RegisteredListModal';
import InfoModal from './components/InfoModal';
import AdminDashboard from './components/AdminDashboard';
import QuotaFullMessage from './components/QuotaFullMessage';
import { UsersIcon, InformationCircleIcon, Cog6ToothIcon, LoadingSpinnerIcon } from './components/IconComponents';
import HeroSlider from './components/HeroSlider';
import Marquee from './components/Marquee';
import { getRegistrations, addRegistration, getScriptUrl, setScriptUrl } from './googleSheetsService';

const initialFormData: RegistrationData = {
  company: {
    npwp: '',
    companyName: '',
    businessType: '',
    address: '',
    city: '',
    postalCode: '',
  },
  participant: {
    fullName: '',
    position: '',
    email: '',
    phone: '',
  },
};

const REGISTRATION_QUOTA = 100;

const ConfigurationScreen: React.FC<{ onSave: (url: string) => void }> = ({ onSave }) => {
  const [url, setUrl] = useState('');

  const handleSave = () => {
    if (url.trim().startsWith('https://script.google.com/macros/s/')) {
      onSave(url.trim());
    } else {
      alert('URL tidak valid. Harap masukkan URL Web App Google Apps Script yang benar.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-slate-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
        <Cog6ToothIcon className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Konfigurasi Aplikasi</h1>
        <p className="mt-2 text-gray-600">
          Untuk menghubungkan aplikasi dengan Google Sheets, harap masukkan URL Web App dari Google Apps Script Anda.
        </p>
        <div className="mt-6 text-left">
          <label htmlFor="scriptUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL Google Apps Script
          </label>
          <input
            id="scriptUrl"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-primary-light focus:ring-primary-light sm:text-sm"
          />
        </div>
        <button
          onClick={handleSave}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors"
        >
          Simpan & Lanjutkan
        </button>
        <p className="mt-4 text-xs text-gray-500">
          URL ini akan disimpan di browser Anda. Aplikasi yang di-deploy ke Netlify akan menggunakan URL dari environment variable.
        </p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState(() => !!getScriptUrl());
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<RegistrationData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<RegistrationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [isRegisteredListModalOpen, setIsRegisteredListModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const quota = REGISTRATION_QUOTA;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRegistrations();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(
        `GAGAL MEMUAT DATA APLIKASI!\n\n` +
        `Pastikan koneksi internet Anda stabil dan coba lagi.\n\n` +
        `Jika masalah berlanjut, pastikan URL Google Apps Script sudah benar dan telah di-deploy dengan akses 'Anyone'.\n\n` +
        `Untuk aplikasi yang sudah di-hosting, pastikan environment variable VITE_APPS_SCRIPT_URL sudah diatur dengan benar.\n\n` +
        `Detail Error Teknis: ${errorMessage}`
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isConfigured) {
      fetchData();
    }
  }, [fetchData, isConfigured]);

  const handleConfigSave = (url: string) => {
    setScriptUrl(url);
    setIsConfigured(true);
  };

  const updateFormData = useCallback((data: Partial<RegistrationData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
      company: { ...prev.company, ...data.company },
      participant: { ...prev.participant, ...data.participant },
    }));
  }, []);

  const validateStep1 = () => {
    const companyErrors: { [key: string]: string } = {};
    if (!/^\d{15,16}$/.test(formData.company.npwp.replace(/[\.\-]/g, ''))) companyErrors.npwp = 'NPWP tidak valid (15 atau 16 digit).';
    if (!formData.company.companyName.trim()) companyErrors.companyName = 'Nama perusahaan wajib diisi.';
    if (!formData.company.businessType) companyErrors.businessType = 'Jenis usaha wajib dipilih.';
    if (!formData.company.address.trim()) companyErrors.address = 'Alamat wajib diisi.';
    if (!formData.company.city.trim()) companyErrors.city = 'Kota wajib diisi.';
    if (!/^\d{5}$/.test(formData.company.postalCode)) companyErrors.postalCode = 'Kode pos tidak valid (5 digit).';
    return companyErrors;
  };

  const validateStep2 = () => {
    const participantErrors: { [key: string]: string } = {};
    if (!formData.participant.fullName.trim()) participantErrors.fullName = 'Nama lengkap wajib diisi.';
    if (!formData.participant.position.trim()) participantErrors.position = 'Jabatan wajib diisi.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.participant.email)) participantErrors.email = 'Format email tidak valid.';
    if (!/^\+?(\d{10,15})$/.test(formData.participant.phone)) participantErrors.phone = 'Nomor telepon tidak valid (10-15 digit).';
    return participantErrors;
  };

  const nextStep = () => {
    let currentErrors: FormErrors = {};
    if (currentStep === 1) {
      const companyErrors = validateStep1();
      if (Object.keys(companyErrors).length > 0) {
        currentErrors = { company: companyErrors };
      }
    }
    if (currentStep === 2) {
      const participantErrors = validateStep2();
      if (Object.keys(participantErrors).length > 0) {
        currentErrors = { participant: participantErrors };
      }
    }

    setErrors(currentErrors);

    if (Object.keys(currentErrors).length === 0) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const generateRegistrationId = () => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BIMTEK-${timestamp}-${randomPart}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const registrationId = generateRegistrationId();
    const finalData = { ...formData, registrationId };

    try {
      await addRegistration(finalData);

      // Optimistically update UI
      setRegistrations(prev => [finalData, ...prev]);
      setSubmittedData(finalData);
      setCurrentStep(4);

    } catch (error) {
      console.error('Submit Error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(
        `GAGAL MENGIRIM DATA!\n\n` +
        `Pastikan koneksi internet Anda stabil dan coba lagi.\n\n` +
        `Detail Error Teknis: ${errorMessage}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setFormData(initialFormData);
    setSubmittedData(null);
    setCurrentStep(1);
    setErrors({});
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1CompanyData data={formData.company} updateData={updateFormData} nextStep={nextStep} errors={errors.company || {}} />;
      case 2:
        return <Step2ParticipantData data={formData.participant} updateData={updateFormData} nextStep={nextStep} prevStep={prevStep} errors={errors.participant || {}} />;
      case 3:
        return <Step3Confirmation data={formData} handleSubmit={handleSubmit} prevStep={prevStep} isSubmitting={isSubmitting} />;
      case 4:
        if (!submittedData) return null;
        return <Step4Success 
                    companyName={submittedData.company.companyName} 
                    participantName={submittedData.participant.fullName} 
                    registrationId={submittedData.registrationId}
                    handleReset={handleReset} 
                />;
      default:
        return null;
    }
  };

  if (!isConfigured) {
    return <ConfigurationScreen onSave={handleConfigSave} />;
  }

  const isQuotaFull = registrations.length >= quota;
  
  if (isLoading && isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinnerIcon className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <img 
              src="https://icenergyinstitute.com/wp-content/uploads/2024/08/Download-Logo-Provinsi-Nusa-Tenggara-Barat-PNG-300x225.webp" 
              alt="Logo Pemerintah Provinsi NTB" 
              className="w-16 h-auto mx-auto mb-4" 
            />
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              Biro Pengadaan Barang dan Jasa
            </h1>
            <p className="text-md text-gray-600 mb-4">
              Sekretariat Daerah Provinsi Nusa Tenggara Barat
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-primary-dark">Pendaftaran Bimtek SPSE</h1>
            <p className="text-slate-600 mt-2">SiKAP, SPSE & E-Katalog v.6</p>
            
            <div className="mt-6 flex justify-center items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                    <UsersIcon className="w-5 h-5"/>
                    <span>Total Pendaftar: <strong>{registrations.length} / {quota}</strong></span>
                </div>
                 <button 
                    onClick={() => setIsInfoModalOpen(true)}
                    className="flex items-center gap-1.5 text-primary hover:text-primary-dark font-medium underline-offset-4 hover:underline"
                >
                    <InformationCircleIcon className="w-5 h-5"/>
                    Informasi Acara
                </button>
                <button 
                    onClick={() => setIsRegisteredListModalOpen(true)}
                    className="text-primary hover:text-primary-dark font-medium underline-offset-4 hover:underline"
                >
                    Lihat Pendaftar
                </button>
                 <button 
                    onClick={() => setIsDashboardOpen(true)}
                    className="flex items-center gap-1.5 text-gray-600 hover:text-primary-dark font-medium underline-offset-4 hover:underline"
                >
                    <Cog6ToothIcon className="w-5 h-5"/>
                    Admin
                </button>
            </div>
          </header>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
             {currentStep === 1 && !isQuotaFull && (
              <>
                <Marquee text="Selamat Datang di Pendaftaran Bimbingan Teknis LPSE! Pastikan data yang Anda masukkan sudah benar dan valid." />
                <HeroSlider />
              </>
            )}
            {currentStep <= 3 && !isQuotaFull && <Stepper steps={STEPS} currentStep={currentStep} />}
            <div className="mt-8">
              {isQuotaFull && currentStep < 4 ? <QuotaFullMessage /> : renderStep()}
            </div>
          </div>
          
          <footer className="text-center text-sm text-slate-500 mt-6">
            <p>&copy; {new Date().getFullYear()} Biro Pengadaan Barang dan Jasa, Setda Provinsi NTB. All rights reserved.</p>
          </footer>
        </div>
      </div>
      
      {isRegisteredListModalOpen && <RegisteredListModal registrations={registrations} onClose={() => setIsRegisteredListModalOpen(false)} />}
      {isInfoModalOpen && <InfoModal onClose={() => setIsInfoModalOpen(false)} />}
      {isDashboardOpen && (
          <AdminDashboard 
              registrations={registrations} 
              onClose={() => setIsDashboardOpen(false)}
              quota={quota}
           />
      )}
    </>
  );
};

export default App;
