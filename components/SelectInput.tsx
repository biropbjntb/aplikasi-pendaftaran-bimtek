import React from 'react';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: string[];
  error?: string;
  colSpan?: string;
}

const SelectInput: React.FC<Props> = ({ label, name, options, error, colSpan = '', ...props }) => {
  const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';
  const normalClasses = 'border-gray-300 focus:border-primary-light focus:ring-primary-light';

  return (
    <div className={colSpan}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm transition-colors ${error ? errorClasses : normalClasses}`}
        {...props}
      >
        <option value="" disabled>-- Pilih Bentuk Usaha --</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default SelectInput;
