'use client';

import { useConfig } from '@/hooks/useConfig';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { config } = useConfig();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {config.logo && (
                <img
                  src={config.logo}
                  alt={config.storeName}
                  className="h-8 w-8 object-contain"
                />
              )}
              <span className="text-xl font-bold">{config.storeName}</span>
            </div>
            <p className="text-gray-400">
              Tu ferretería de confianza con más de 20 años de experiencia 
              ofreciendo productos de calidad para todos tus proyectos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/category/herramientas" className="text-gray-400 hover:text-white transition-colors">
                  Herramientas
                </a>
              </li>
              <li>
                <a href="/category/ferreteria" className="text-gray-400 hover:text-white transition-colors">
                  Ferretería
                </a>
              </li>
              <li>
                <a href="/category/pintura" className="text-gray-400 hover:text-white transition-colors">
                  Pintura
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Sobre Nosotros
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <a href="/category/herramientas-electricas" className="text-gray-400 hover:text-white transition-colors">
                  Herramientas Eléctricas
                </a>
              </li>
              <li>
                <a href="/category/fontaneria" className="text-gray-400 hover:text-white transition-colors">
                  Fontanería
                </a>
              </li>
              <li>
                <a href="/category/electricidad" className="text-gray-400 hover:text-white transition-colors">
                  Electricidad
                </a>
              </li>
              <li>
                <a href="/category/jardin" className="text-gray-400 hover:text-white transition-colors">
                  Jardín
                </a>
              </li>
              <li>
                <a href="/category/seguridad" className="text-gray-400 hover:text-white transition-colors">
                  Seguridad
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">
                  Av. Corrientes 1234, Buenos Aires
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">+54 11 1234-5678</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">info@miferreteria.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                Horarios de atención:
              </p>
              <p className="text-sm text-gray-400">
                Lun - Vie: 8:00 - 18:00
              </p>
              <p className="text-sm text-gray-400">
                Sáb: 9:00 - 14:00
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 {config.storeName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}