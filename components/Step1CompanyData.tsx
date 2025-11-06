import React from 'react';
import { CompanyData, RegistrationData } from '../types';
import { BUSINESS_TYPES } from '../constants';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import { ArrowRightIcon } from './IconComponents';

interface Props {
  data: CompanyData;
  updateData: (data: Partial<RegistrationData>) => void;
  nextStep: () => void;
  errors: { [key: string]: string };
}

const Step1CompanyData: React.FC<Props> = ({ data, updateData, nextStep, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateData({ company: { ...data, [name]: value } });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Informasi Perusahaan</h2>
        <p className="text-gray-500 mt-1">Lengkapi data perusahaan Anda sesuai dengan dokumen yang berlaku.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <TextInput
          label="NPWP Perusahaan"
          name="npwp"
          value={data.npwp}
          onChange={handleChange}
          placeholder="00.000.000.0-000.000"
          error={errors.npwp}
          colSpan="md:col-span-2"
        />
        <TextInput
          label="Nama Perusahaan"
          name="companyName"
          value={data.companyName}
          onChange={handleChange}
          placeholder="Contoh: PT. Maju Jaya"
          error={errors.companyName}
          colSpan="md:col-span-2"
        />
        <SelectInput
          label="Bentuk Usaha"
          name="businessType"
          value={data.businessType}
          onChange={handleChange}
          options={BUSINESS_TYPES}
          error={errors.businessType}
        />
        <div className="md:col-span-2">
            <TextInput
                label="Alamat Perusahaan"
                name="address"
                value={data.address}
                onChange={handleChange}
                placeholder="Jl. Pahlawan No. 123"
                error={errors.address}
            />
        </div>
        <TextInput
          label="Kota"
          name="city"
          value={data.city}
          onChange={handleChange}
          placeholder="Contoh: Jakarta"
          error={errors.city}
        />
        <TextInput
          label="Kode Pos"
          name="postalCode"
          value={data.postalCode}
          onChange={handleChange}
          placeholder="Contoh: 12345"
          error={errors.postalCode}
        />
      </div>

      <div className="mt-8 flex justify-end">
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

export default Step1CompanyData;