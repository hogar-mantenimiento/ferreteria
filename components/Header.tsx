'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useConfig } from '@/hooks/useConfig';
import { useCart } from '@/hooks/useCart';
import { useTheme } from 'next-themes';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  Settings,
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { config } = useConfig();
  const { getItemCount } = useCart();
  const { theme, setTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    const handleRoute = () => {
      setIsMenuOpen(false);
      setIsUserMenuOpen(false);
    };
    // next/navigation no emite events, pero al hacer push aquí cerramos manualmente en handlers.
    // Si migras a next/router (pages), puedes suscribirte a routeChangeStart.
    return () => {
      // nada que limpiar aquí por ahora
    };
  }, []);

  // Cerrar menús con click afuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  // Cerrar con tecla Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      setIsMenuOpen(false);
      setIsUserMenuOpen(false);
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const handleAdminClick = () => {
    setIsUserMenuOpen(false);
    router.push('/admin');
  };

  const itemCount = getItemCount();

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y marca */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsUserMenuOpen(false);
                router.push('/');
              }}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              aria-label="Ir al inicio"
            >
              {config?.logo && (
                // Mantengo <img> para no requerir domain config de next/image
                <img
                  src={config.logo}
                  alt={config?.storeName ?? 'Tienda'}
                  className="h-8 w-8 object-contain"
                />
              )}
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {config?.storeName ?? 'Mi Tienda'}
              </span>
            </button>
          </div>

          {/* Barra de búsqueda estilo ML */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="flex w-full search-bar">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar productos, marcas y más..."
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-0 rounded-l-md"
                  aria-label="Buscar"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 border-l border-gray-300 rounded-r-md transition-colors"
                aria-label="Enviar búsqueda"
              >
                <Search className="h-5 w-5 text-gray-600" />
              </button>
            </form>
          </div>

          {/* Acciones */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => mounted && setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
              disabled={!mounted}
              aria-label="Cambiar tema"
            >
              {mounted ? (
                theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Carrito */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsUserMenuOpen(false);
                router.push('/cart');
              }}
              className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Ver carrito"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-gray-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Menú de usuario */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen((v) => !v)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                aria-label="Menú de usuario"
              >
                <User className="h-6 w-6" />
                {user && (
                  <span className="hidden sm:block text-sm font-medium text-readable">
                    {user?.name ?? 'Usuario'}
                  </span>
                )}
              </button>

              {isUserMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-medium text-readable">
                          {user?.name ?? 'Usuario'}
                        </p>
                        <p className="text-sm text-readable-muted">
                          {user?.email ?? ''}
                        </p>
                        <p className="text-xs text-readable-light mt-1">
                          Rol: {user?.role ?? '—'}
                        </p>
                      </div>

                      {user?.role === 'admin' && (
                        <button
                          onClick={handleAdminClick}
                          className="flex items-center w-full px-4 py-2 text-sm text-readable hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          role="menuitem"
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Panel Admin
                        </button>
                      )}

                      <button
                        onClick={() => {
                          router.push('/orders');
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-readable hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        role="menuitem"
                      >
                        <ShoppingCart className="h-4 w-4 mr-3" />
                        Mis Pedidos
                      </button>

                      <hr className="my-2 border-gray-200 dark:border-gray-600" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        router.push('/login');
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-readable hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      role="menuitem"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Iniciar Sesión
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Toggle menú móvil */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="search-bar">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar productos..."
                  className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-0 rounded-l-md"
                  aria-label="Buscar en móvil"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 border-l border-gray-300 rounded-r-md"
                  aria-label="Enviar búsqueda móvil"
                >
                  <Search className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
