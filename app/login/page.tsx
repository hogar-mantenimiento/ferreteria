'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useConfig } from '@/hooks/useConfig';
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { config } = useConfig();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('¡Bienvenido!');
      
      // Redirigir según el rol
      if (data.email === 'admin@test.com') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('¡Bienvenido!');
      
      if (email === 'admin@test.com') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error en el login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a {config.storeName}
          </button>
          
          {config.logo && (
            <img
              className="mx-auto h-16 w-auto mb-6"
              src={config.logo}
              alt={config.storeName}
            />
          )}
          
          <h2 className="text-3xl font-bold text-readable mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-readable-muted">
            Accede a tu cuenta en {config.storeName}
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-readable mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  className="input pl-10"
                  placeholder="tu@email.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-readable mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input pl-10 pr-10"
                  placeholder="Tu contraseña"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Login Buttons */}
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-readable-muted mb-4">Acceso rápido para pruebas:</p>
          </div>
          
          <button
            onClick={() => quickLogin('admin@test.com', 'admin123')}
            disabled={isLoading}
            className="btn btn-secondary w-full disabled:opacity-50"
          >
            👑 Ingresar como Admin
          </button>
          
          <button
            onClick={() => quickLogin('user@test.com', 'user123')}
            disabled={isLoading}
            className="btn btn-secondary w-full disabled:opacity-50"
          >
            👤 Ingresar como Usuario
          </button>
        </div>

        {/* Test Accounts Info */}
        <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
            🧪 Cuentas de Prueba
          </h3>
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-readable">👑 Administrador</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">ADMIN</span>
              </div>
              <div className="text-xs text-readable-muted">
                <p><strong>Email:</strong> admin@test.com</p>
                <p><strong>Contraseña:</strong> admin123</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-readable">👤 Usuario Regular</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">USER</span>
              </div>
              <div className="text-xs text-readable-muted">
                <p><strong>Email:</strong> user@test.com</p>
                <p><strong>Contraseña:</strong> user123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}