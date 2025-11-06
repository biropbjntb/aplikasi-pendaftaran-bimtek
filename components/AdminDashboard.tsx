import React, { useState, useMemo } from 'react';
import { RegistrationData } from '../types';
import { ADMIN_PASSWORD } from '../constants';
import { XMarkIcon, Cog6ToothIcon, MagnifyingGlassIcon } from './IconComponents';

interface Props {
  registrations: RegistrationData[];
  onClose: () => void;
  quota: number;
}

const AdminDashboard: React.FC<Props> = ({ registrations, onClose, quota }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const totalRegistrations = registrations.length;
  const remainingQuota = quota - totalRegistrations;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Kata sandi salah.');
    }
  };

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(reg => 
      reg.participant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [registrations, searchTerm]);

  if (!isLoggedIn) {
    return (
       <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm transform transition-all p-8">
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Akses Admin</h2>
             <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
           </div>
          <form onSubmit={handleLogin}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition-colors ${error ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <button type="submit" className="w-full mt-4 px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary-dark focus:outline-none">
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col transform transition-all">
        <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-white rounded-t-2xl">
           <div className="flex items-center gap-3">
            <Cog6ToothIcon className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-800">Dashboard Admin</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
        </header>

        {/* Main Content */}
        <main className="p-6 overflow-y-auto space-y-6">
            {/* Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">Total Pendaftar</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{totalRegistrations}</p>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">Total Kuota</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{quota}</p>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">Sisa Kuota</h3>
                    <p className={`mt-1 text-3xl font-semibold ${remainingQuota < 10 ? 'text-red-600' : 'text-green-600'}`}>{remainingQuota > 0 ? remainingQuota : 0}</p>
                </div>
            </section>
            
            {/* Management Section */}
            <section className="bg-white p-4 rounded-lg shadow-sm border">
                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Manajemen Data</h3>
                 <p className="text-sm text-gray-600 mb-4">Untuk menghapus pendaftar atau mengubah data, silakan lakukan langsung dari Google Sheet yang terhubung.</p>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        id="search"
                        type="text"
                        placeholder="Cari nama atau perusahaan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                    />
                </div>
            </section>
            
             {/* Table */}
            <section className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Daftar Pendaftar</h3>
                    <span className="text-sm text-gray-500">
                        {searchTerm 
                            ? `${filteredRegistrations.length} hasil ditemukan`
                            : `${registrations.length} total pendaftar`
                        }
                    </span>
                </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Peserta</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Perusahaan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telepon</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRegistrations.map((reg) => (
                            <tr key={reg.registrationId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.participant.fullName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.company.companyName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.participant.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.participant.phone}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                     {filteredRegistrations.length === 0 && (
                        <p className="text-center text-gray-500 py-8">
                            {registrations.length > 0 ? 'Tidak ada hasil yang cocok.' : 'Belum ada peserta yang mendaftar.'}
                        </p>
                    )}
                </div>
            </section>
        </main>
        
        <footer className="p-4 border-t border-gray-200 text-right bg-white rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark focus:outline-none">
            Tutup
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
