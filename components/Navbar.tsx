import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Package, Wrench, Zap, Paintbrush, Droplets, Plug, Leaf, Shield } from 'lucide-react';

const categories = [
  { name: 'Herramientas', slug: 'herramientas', icon: Wrench },
  { name: 'Herramientas Eléctricas', slug: 'herramientas-electricas', icon: Zap },
  { name: 'Ferretería', slug: 'ferreteria', icon: Package },
  { name: 'Pintura', slug: 'pintura', icon: Paintbrush },
  { name: 'Fontanería', slug: 'fontaneria', icon: Droplets },
  { name: 'Electricidad', slug: 'electricidad', icon: Plug },
  { name: 'Jardín', slug: 'jardin', icon: Leaf },
  { name: 'Seguridad', slug: 'seguridad', icon: Shield },
];

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Package className="h-4 w-4" />
              <span className="font-medium">Categorías</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="py-2">
                  {categories.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => {
                        router.push(`/category/${category.slug}`);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <category.icon className="h-5 w-5 text-primary-600" />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => router.push('/ofertas')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              🔥 Ofertas
            </button>
            <button
              onClick={() => router.push('/destacados')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              ⭐ Destacados
            </button>
            <button
              onClick={() => router.push('/nuevos')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              ✨ Nuevos
            </button>
            <button
              onClick={() => router.push('/marcas')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Marcas
            </button>
            <button
              onClick={() => router.push('/contacto')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Contacto
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Menú
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isDropdownOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            <div className="space-y-1">
              <button
                onClick={() => {
                  router.push('/ofertas');
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                🔥 Ofertas
              </button>
              <button
                onClick={() => {
                  router.push('/destacados');
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                ⭐ Destacados
              </button>
              <button
                onClick={() => {
                  router.push('/nuevos');
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                ✨ Nuevos
              </button>
              <button
                onClick={() => {
                  router.push('/vendedor');
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                💼 Ser Vendedor
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </nav>
  );
}