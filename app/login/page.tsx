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
  const { config, loading: configLoading } = useConfig();
  const storeName = configLoading ? 'Cargando...' : config.storeName;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('¡Bienvenido!');
      router.push(data.email === 'admin@test.com' ? '/admin' : '/');
    } catch (error: any) {
      toast.error(error?.message || 'Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('¡Bienvenido!');
      router.push(email === 'admin@test.com' ? '/admin' : '/');
    } catch (error: any) {
      toast.error(error?.message || 'Error en el login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a {storeName || 'Inicio'}
          </button>

          {config?.logo && (
            <img
              className="mx-auto h-16 w-auto mb-6"
              src={config.logo}
              alt={storeName || 'Logo'}
            />
          )}

          <h2 className="text-3xl font-bold mb-2">Iniciar Sesión</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Accede a tu cuenta en {storeName || 'la tienda'}
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  placeholder="tu@email.com"
                  {...register('email')}
                  className="input pl-10 pr-4 py-2.5"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  disabled={isLoading}
                  placeholder="Tu contraseña"
                  {...register('password')}
                  className="input pl-10 pr-10 py-2.5"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full text-lg py-3.5"
              >
                {isLoading ? (
                  <span className="inline-flex items-center justify-center">
                    <span className="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>
          </form>

          {/* Opcional: accesos rápidos para staging/demo */}
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => quickLogin('admin@test.com', 'admin')}
              disabled={isLoading}
              className="btn-outline w-full"
            >
              Entrar como Admin
            </button>
            <button
              onClick={() => quickLogin('user@test.com', 'user')}
              disabled={isLoading}
              className="btn-outline w-full"
            >
              Entrar como Usuario
            </button>
          </div>
         
        </div>
      </div>
    </div>
  );
}
