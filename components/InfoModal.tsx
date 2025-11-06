import React from 'react';
// FIX: Import `UsersIcon` to be used in the component.
import { XMarkIcon, InformationCircleIcon, CalendarDaysIcon, MapPinIcon, PhoneIcon, UsersIcon } from './IconComponents';

interface Props {
  onClose: () => void;
}

const InfoItem: React.FC<{ icon: React.ElementType; label: string; children: React.ReactNode }> = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-4">
    <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
    <div>
      <h4 className="font-semibold text-gray-700">{label}</h4>
      <div className="text-gray-600">{children}</div>
    </div>
  </div>
);

const InfoModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <InformationCircleIcon className="w-6 h-6 text-primary" />
            <h2 id="modal-title" className="text-xl font-bold text-gray-800">Informasi Bimbingan Teknis</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-light rounded-full p-1"
            aria-label="Tutup modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
          <InfoItem icon={CalendarDaysIcon} label="Tanggal & Waktu">
            <p>Kamis, 28 November 2024</p>
            <p>08:30 - 16:00 WITA</p>
          </InfoItem>

          <InfoItem icon={MapPinIcon} label="Lokasi">
            <p>Aula Kantor Gubernur NTB</p>
            <p>Jl. Pejanggik No.12, Mataram, NTB</p>
            <a 
                href="https://maps.app.goo.gl/your-google-maps-link" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-primary hover:underline mt-1 inline-block"
            >
                Lihat di Google Maps
            </a>
          </InfoItem>

          <InfoItem icon={UsersIcon} label="Narasumber">
            <p>Tim Ahli dari LKPP dan LPSE Provinsi NTB.</p>
          </InfoItem>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Agenda Utama</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Pengenalan dan Optimalisasi Sistem Informasi Kinerja Penyedia (SiKAP).</li>
                <li>Panduan Lengkap Penggunaan Sistem Pengadaan Secara Elektronik (SPSE 4.5).</li>
                <li>Strategi Pemasaran Produk melalui E-Katalog v.6.</li>
                <li>Sesi Tanya Jawab dan Diskusi Interaktif.</li>
            </ul>
          </div>

          <InfoItem icon={PhoneIcon} label="Kontak Panitia">
            <p>Jika ada pertanyaan, silakan hubungi:</p>
            <p>Email: <a href="mailto:lpse@ntbprov.go.id" className="text-primary hover:underline">biropbj@ntbprov.go.id</a></p>
            <p>Telp/WA: <a href="https://wa.me/6281139011909" className="text-primary hover:underline">+62 811-3901-1909</a> (Helpdesk)</p>
          </InfoItem>
        </div>
        <div className="p-4 border-t border-gray-200 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light">
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
