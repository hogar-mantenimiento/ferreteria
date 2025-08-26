'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  revenue: number;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }
      
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }
      
      fetchStats();
    }
  }, [user, loading, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-readable-muted">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-readable mb-4">
            Acceso Denegado
          </h1>
          <p className="text-readable-muted mb-6">
            Debes iniciar sesión para acceder al panel de administración.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="btn btn-primary"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-yellow-600 text-2xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-readable mb-4">
            Acceso Restringido
          </h1>
          <p className="text-readable-muted mb-4">
            No tienes permisos para acceder al panel de administración.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-readable-muted">
              <strong>Usuario:</strong> {user.email}
            </p>
            <p className="text-sm text-readable-muted">
              <strong>Rol actual:</strong> {user.role}
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="btn btn-primary"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-8 text-gray-900">
          <h1 className="text-3xl font-bold mb-2">
            ¡Bienvenido al Panel de Administración!
          </h1>
          <p className="text-lg opacity-90">
            Hola {user.name}, aquí puedes gestionar tu tienda
          </p>
          <div className="mt-4 text-sm opacity-80">
            <p>Email: {user.email} | Rol: {user.role}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-readable-muted">
                  Total Productos
                </p>
                <p className="text-3xl font-bold text-readable">
                  {stats.totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-readable-muted">
                  Total Usuarios
                </p>
                <p className="text-3xl font-bold text-readable">
                  {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-accent-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-readable-muted">
                  Total Pedidos
                </p>
                <p className="text-3xl font-bold text-readable">
                  {stats.totalOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-readable-muted">
                  Ingresos
                </p>
                <p className="text-3xl font-bold text-readable">
                  ${stats.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-readable mb-6">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/products/new')}
              className="btn btn-primary text-center py-4"
            >
              <Package className="h-6 w-6 mx-auto mb-2" />
              Agregar Producto
            </button>
            <button
              onClick={() => router.push('/admin/products')}
              className="btn btn-secondary text-center py-4"
            >
              <ShoppingCart className="h-6 w-6 mx-auto mb-2" />
              Gestionar Productos
            </button>
            <button
              onClick={() => router.push('/config')}
              className="btn btn-secondary text-center py-4"
            >
              <TrendingUp className="h-6 w-6 mx-auto mb-2" />
              Configuración
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}