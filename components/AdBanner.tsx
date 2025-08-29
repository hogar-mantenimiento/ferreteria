'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  backgroundColor: string;
  textColor: string;
}

const ads: Ad[] = [
  {
    id: '1',
    title: '¡MEGA OFERTA!',
    description: 'Hasta 40% OFF en herramientas eléctricas. Solo por tiempo limitado.',
    image: '',
    link: '/category/herramientas-electricas',
    backgroundColor: 'bg-gradient-to-r from-red-500 to-red-600',
    textColor: 'text-white'
  },
  {
    id: '2',
    title: 'ENVÍO GRATIS',
    description: 'En compras superiores a $50.000. Válido para todo el país.',
    image: '',
    link: '/shipping',
    backgroundColor: 'bg-gradient-to-r from-green-500 to-green-600',
    textColor: 'text-white'
  },
  {
    id: '3',
    title: 'NUEVOS PRODUCTOS',
    description: 'Descubre nuestra nueva línea de herramientas profesionales.',
    image: '',
    link: '/nuevos',
    backgroundColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
    textColor: 'text-white'
  }
];

export default function AdBanner() {
  const [currentAd, setCurrentAd] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const ad = ads[currentAd];

  return (
    <div className={`relative ${ad.backgroundColor} ${ad.textColor} overflow-hidden`}>
      <div className="absolute inset-0 opacity-20">  
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-lg font-bold text-white">{ad.title}</h3>
                <p className="text-sm opacity-90 text-white">{ad.description}</p>
              </div>
              <button className="btn bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-30">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Más
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Indicadores */}
            <div className="flex space-x-2">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAd(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentAd ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}