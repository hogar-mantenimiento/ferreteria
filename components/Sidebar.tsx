'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConfig } from '@/hooks/useConfig';
import { 
  ShoppingCart, 
  Percent, 
  Gift, 
  Star, 
  Phone, 
  Mail, 
  MapPin,
  ChevronRight,
  X,
  Menu
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const { config } = useConfig();

  const promotions = [
    {
      title: '20% OFF',
      description: 'En herramientas eléctricas',
      code: 'ELECTRICO20',
      color: 'bg-red-500'
    },
    {
      title: '15% OFF',
      description: 'En compras +$100.000',
      code: 'COMPRA15',
      color: 'bg-green-500'
    },
    {
      title: '3x2',
      description: 'En tornillos y clavos',
      code: '3X2FERRO',
      color: 'bg-blue-500'
    }
  ];

  const quickLinks = [
    { name: 'Ofertas Especiales', path: '/ofertas', icon: Percent },
    { name: 'Productos Destacados', path: '/destacados', icon: Star },
    { name: 'Regalos Corporativos', path: '/regalos', icon: Gift },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-6 w-6 text-gray-900 dark:text-white" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Compra Rápida
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Promociones */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🔥 Promociones Activas
              </h3>
              <div className="space-y-3">
                {promotions.map((promo, index) => (
                  <div key={index} className="card p-4 border-l-4 border-primary-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`inline-block px-2 py-1 rounded text-white text-sm font-bold ${promo.color}`}>
                          {promo.title}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {promo.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Código: <span className="font-mono font-bold">{promo.code}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enlaces Rápidos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Enlaces Rápidos
              </h3>
              <div className="space-y-2">
                {quickLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      router.push(link.path);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <link.icon className="h-5 w-5 text-primary-600" />
                      <span className="text-gray-900 dark:text-white">{link.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Contacto Rápido */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contacto Rápido
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+541112345678"
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Llamanos
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      +54 11 1234-5678
                    </p>
                  </div>
                </a>
                
                <a
                  href="mailto:ventas@ferreteria.com"
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Email
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ventas@ferreteria.com
                    </p>
                  </div>
                </a>

                <div className="flex items-center space-x-3 p-3">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Ubicación
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Av. Corrientes 1234, CABA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Horarios */}
            <div className="card p-4 bg-primary-50 dark:bg-primary-900/20">
              <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
                Horarios de Atención
              </h4>
              <div className="text-sm text-primary-800 dark:text-primary-200 space-y-1">
                <p>Lun - Vie: 8:00 - 18:00</p>
                <p>Sábados: 9:00 - 14:00</p>
                <p>Domingos: Cerrado</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                router.push('/cart');
                onClose();
              }}
              className="btn btn-primary w-full"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Ver Carrito
            </button>
          </div>
        </div>
      </div>
    </>
  );
}