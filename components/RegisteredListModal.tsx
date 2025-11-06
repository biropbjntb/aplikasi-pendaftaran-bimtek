import React from 'react';
import { RegistrationData } from '../types';
import { XMarkIcon, UsersIcon, DocumentArrowDownIcon, DocumentTextIcon } from './IconComponents';

interface Props {
  registrations: RegistrationData[];
  onClose: () => void;
}

const RegisteredListModal: React.FC<Props> = ({ registrations, onClose }) => {

  const handleExportCSV = () => {
    const headers = [
      "ID Pendaftaran",
      "Nama Peserta",
      "Jabatan",
      "Email",
      "Telepon",
      "Nama Perusahaan",
      "NPWP",
      "Bentuk Usaha",
      "Alamat",
      "Kota",
      "Kode Pos"
    ];

    const rows = registrations.map(reg => [
      `"${reg.registrationId || ''}"`,
      `"${reg.participant.fullName}"`,
      `"${reg.participant.position}"`,
      `"${reg.participant.email}"`,
      `"${reg.participant.phone}"`,
      `"${reg.company.companyName}"`,
      `"${reg.company.npwp}"`,
      `"${reg.company.businessType}"`,
      `"${reg.company.address}"`,
      `"${reg.company.city}"`,
      `"${reg.company.postalCode}"`
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n" 
      + rows.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pendaftar_bimtek_lpse.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportPDF = () => {
    // @ts-ignore
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        console.error("jsPDF is not loaded");
        alert("Gagal memuat pustaka PDF. Silakan coba lagi nanti.");
        return;
    }
    // @ts-ignore
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // @ts-ignore
    if (typeof doc.autoTable !== 'function') {
        console.error("jsPDF-AutoTable is not loaded");
        alert("Gagal memuat pustaka tabel PDF. Silakan coba lagi nanti.");
        return;
    }

    doc.setFontSize(18);
    doc.text("Daftar Peserta Terdaftar - Bimtek LPSE", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Total Pendaftar: ${registrations.length}`, 14, 30);

    const tableColumn = ["No", "Nama Peserta", "Nama Perusahaan", "Kota"];
    const tableRows: (string|number)[][] = [];

    registrations.forEach((reg, index) => {
        const regData = [
            index + 1,
            reg.participant.fullName,
            reg.company.companyName,
            reg.company.city,
        ];
        tableRows.push(regData);
    });

    // @ts-ignore
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [13, 71, 161] }, // primary-dark color
        styles: { font: 'helvetica', fontSize: 10 },
    });
    
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Halaman ${i} dari ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save("pendaftar_bimtek_lpse.pdf");
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
           <div className="flex items-center gap-3">
            <UsersIcon className="w-6 h-6 text-primary" />
            <h2 id="modal-title" className="text-xl font-bold text-gray-800">Daftar Peserta Terdaftar</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-light rounded-full p-1"
            aria-label="Tutup modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {registrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Peserta
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Perusahaan
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kota
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((reg, index) => (
                    <tr key={reg.registrationId || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.participant.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.company.companyName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.company.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Belum ada peserta yang mendaftar.</p>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <button 
                    onClick={handleExportPDF} 
                    disabled={registrations.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    <DocumentTextIcon className="w-5 h-5 text-red-600" />
                    Ekspor ke PDF
                </button>
                <button 
                    onClick={handleExportCSV} 
                    disabled={registrations.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    <DocumentArrowDownIcon className="w-5 h-5 text-green-700" />
                    Ekspor ke CSV
                </button>
            </div>
            <button onClick={onClose} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light">
                Tutup
            </button>
        </div>
      </div>
    </div>
  );
};

export default RegisteredListModal;