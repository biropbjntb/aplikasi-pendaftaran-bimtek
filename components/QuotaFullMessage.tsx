import React from 'react';
import { InformationCircleIcon } from './IconComponents';

const QuotaFullMessage: React.FC = () => {
  return (
    <div className="text-center animate-fade-in py-8 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
        <InformationCircleIcon className="w-10 h-10 text-secondary" />
      </div>
      <h2 className="mt-2 text-2xl font-bold text-gray-800">Kuota Pendaftaran Penuh</h2>
      <p className="mt-2 max-w-md mx-auto text-gray-600">
        Mohon maaf, kuota untuk Bimbingan Teknis kali ini telah terpenuhi. Terima kasih atas antusiasme Anda.
      </p>
       <p className="mt-4 text-sm text-gray-500">
        Silakan ikuti informasi selanjutnya untuk jadwal bimbingan teknis di masa mendatang.
      </p>
    </div>
  );
};

export default QuotaFullMessage;
