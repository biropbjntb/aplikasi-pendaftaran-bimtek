import React from 'react';
import { CheckCircleIcon } from './IconComponents';

interface Props {
  companyName: string;
  participantName: string;
  registrationId: string | undefined;
  handleReset: () => void;
}

const Step4Success: React.FC<Props> = ({ companyName, participantName, registrationId, handleReset }) => {
  return (
    <div className="text-center animate-fade-in-up py-8">
      <CheckCircleIcon className="w-20 h-20 text-accent mx-auto" />
      <h2 className="mt-4 text-3xl font-bold text-gray-800">Pendaftaran Berhasil!</h2>
      <p className="mt-2 text-gray-600">
        Terima kasih, <strong>{participantName}</strong> dari <strong>{companyName}</strong>.
      </p>

      {registrationId && (
        <div className="mt-6 bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg max-w-md mx-auto">
            <p className="font-medium text-primary-dark">ID Pendaftaran Anda:</p>
            <p className="text-lg font-bold text-primary tracking-wider select-all">{registrationId}</p>
            <p className="text-xs text-primary-dark mt-2">Harap simpan ID ini untuk referensi di masa mendatang.</p>
        </div>
      )}

      <p className="mt-6 max-w-lg mx-auto text-gray-500">
        Data pendaftaran Anda telah kami terima. Informasi lebih lanjut mengenai jadwal dan teknis pelaksanaan Bimbingan Teknis akan kami kirimkan ke alamat email yang terdaftar.
      </p>
      <div className="mt-8">
        <button
          onClick={handleReset}
          className="px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors"
        >
          Daftarkan Peserta Lain
        </button>
      </div>
    </div>
  );
};

export default Step4Success;
