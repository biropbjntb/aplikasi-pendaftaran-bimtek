import React, { useState, useEffect, useCallback } from 'react';
import { PresentationChartLineIcon, CircleStackIcon, ShoppingCartIcon } from './IconComponents';

const slides = [
  {
    Icon: PresentationChartLineIcon,
    title: 'Sistem Informasi Kinerja Penyedia (SiKAP)',
    description: 'Pelajari cara mengelola dan memverifikasi data kualifikasi pelaku usaha/penyedia secara elektronik.',
  },
  {
    Icon: CircleStackIcon,
    title: 'Sistem Pengadaan Secara Elektronik (SPSE)',
    description: 'Kuasai alur pengadaan barang/jasa pemerintah, mulai dari tender hingga pengumuman pemenang.',
  },
  {
    Icon: ShoppingCartIcon,
    title: 'Katalog Elektronik Versi 6',
    description: 'Pahami cara memasukkan produk Anda ke dalam sistem e-katalog terbaru untuk jangkauan pasar yang lebih luas.',
  },
];

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const { Icon, title, description } = slides[currentSlide];

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-primary-dark text-white p-6 md:p-8 mb-8">
      <div className="absolute inset-0 bg-black/20"></div>
       <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/30 rounded-full opacity-50"></div>
      <div className="absolute -top-12 -left-16 w-32 h-32 bg-primary/30 rounded-full opacity-50"></div>
      
      <div className="relative z-10 transition-opacity duration-500 ease-in-out" key={currentSlide}>
        <div className="flex items-center gap-4 mb-3">
          <Icon className="w-8 h-8 text-secondary" />
          <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
        </div>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed h-12">
          {description}
        </p>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
