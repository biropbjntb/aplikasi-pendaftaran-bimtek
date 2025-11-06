import React from 'react';
import { ParticipantData, RegistrationData } from '../types';
import TextInput from './TextInput';
import { ArrowLeftIcon, ArrowRightIcon } from './IconComponents';

interface Props {
  data: ParticipantData;
  updateData: (data: Partial<RegistrationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  errors: { [key: string]: string };
}

const Step2ParticipantData: React.FC<Props> = ({ data, updateData, nextStep, prevStep, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({ participant: { ...data, [name]: value } });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Peserta Bimtek</h2>
      <p className="text-gray-500 mb-6">Isi data perwakilan dari perusahaan yang akan mengikuti bimbingan teknis.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <TextInput
          label="Nama Lengkap Peserta"
          name="fullName"
          value={data.fullName}
          onChange={handleChange}
          placeholder="Contoh: Budi Santoso"
          error={errors.fullName}
          colSpan="md:col-span-2"
        />
        <TextInput
          label="Jabatan"
          name="position"
          value={data.position}
          onChange={handleChange}
          placeholder="Contoh: Direktur"
          error={errors.position}
        />
        <TextInput
          label="Email Aktif"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          placeholder="contoh@perusahaan.com"
          error={errors.email}
        />
        <TextInput
          label="Nomor Telepon (WhatsApp)"
          name="phone"
          type="tel"
          value={data.phone}
          onChange={handleChange}
          placeholder="081234567890"
          error={errors.phone}
          colSpan="md:col-span-2"
        />
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={prevStep}
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Kembali
        </button>
        <button
          onClick={nextStep}
          className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors"
        >
          Selanjutnya
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Step2ParticipantData;
