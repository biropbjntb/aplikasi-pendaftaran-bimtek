import React from 'react';
import { RegistrationData } from '../types';
import { ArrowLeftIcon, PaperAirplaneIcon, LoadingSpinnerIcon } from './IconComponents';

interface Props {
  data: RegistrationData;
  handleSubmit: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row py-3 border-b border-gray-100">
    <dt className="sm:w-1/3 text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:w-2/3">{value || '-'}</dd>
  </div>
);

const Step3Confirmation: React.FC<Props> = ({ data, handleSubmit, prevStep, isSubmitting }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Konfirmasi Pendaftaran</h2>
      <p className="text-gray-500 mb-6">Harap periksa kembali data yang telah Anda masukkan. Pastikan semua informasi sudah benar sebelum mengirim.</p>
      
      <div className="space-y-6">
        {/* Company Data */}
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-primary-dark mb-4">Data Perusahaan</h3>
          <dl>
            <InfoRow label="NPWP" value={data.company.npwp} />
            <InfoRow label="Nama Perusahaan" value={data.company.companyName} />
            <InfoRow label="Bentuk Usaha" value={data.company.businessType} />
            <InfoRow label="Alamat" value={data.company.address} />
            <InfoRow label="Kota" value={data.company.city} />
            <InfoRow label="Kode Pos" value={data.company.postalCode} />
          </dl>
        </div>

        {/* Participant Data */}
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-primary-dark mb-4">Data Peserta</h3>
          <dl>
            <InfoRow label="Nama Lengkap" value={data.participant.fullName} />
            <InfoRow label="Jabatan" value={data.participant.position} />
            <InfoRow label="Email" value={data.participant.email} />
            <InfoRow label="Nomor Telepon" value={data.participant.phone} />
          </dl>
        </div>
      </div>


      <div className="mt-8 flex justify-between">
        <button
          onClick={prevStep}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors disabled:opacity-50"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Kembali
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-accent hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:bg-green-400"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinnerIcon className="w-5 h-5 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              Kirim Pendaftaran
              <PaperAirplaneIcon className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Step3Confirmation;
