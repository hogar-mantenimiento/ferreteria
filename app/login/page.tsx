'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useConfig } from '@/hooks/useConfig';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
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
  const storeName = configLoading ? 'Cargando...' : config?.storeName ?? 'Inicio';

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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 transition-colors bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Columna Izquierda: Login */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a {storeName}
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
              Accedé a tu cuenta en {config?.storeName ?? 'la tienda'}
            </p>
          </div>

          {/* Card Login */}
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
                  className="btn-primary w-full text-lg py-3.5 rounded-lg font-medium
                  bg-gray-900 hover:bg-gray-800
                  dark:bg-gray-900 dark:text-gray-900 dark:hover:bg-gray-100 dark:hover:text-gray-900
                  border border-gray-200 dark:border-gray-700
                  focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700
                  transition-colors"
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center justify-center">
                      <span className="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Iniciando sesión...
                    </span>
                  ) : (
                    <span className='text-white dark:hover:text-gray-900'>Iniciar Sesión</span>
                  )}
                </button>
              </div>
            </form>

            {/* Accesos rápidos (demo/staging) */}
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

      {/* Columna Derecha: ¿Querés ser vendedor? */}
      <aside
  className="
    relative border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800
    flex bg-cover bg-center
  "
  style={{ backgroundImage: "url('/images/fondo-login.png')" }}
>
  {/* Overlay oscuro */}
  <div className="absolute inset-0 bg-black/60" />

  <div className="relative z-10 mx-auto w-full max-w-xl px-8 py-12 lg:py-0 lg:px-12 flex flex-col justify-center">
    <div
      className="
        rounded-2xl border border-gray-200 dark:border-gray-800
        bg-gray-50/90 dark:bg-gray-900/70
        p-8 shadow-sm
      "
    >
      <h2 className="text-3xl text-center font-bold text-gray-900 dark:text-white mb-3">
        ¿Querés ser vendedor?
      </h2>
      <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
        Sumate a nuestro programa y ofrecé productos de {config?.storeName ?? "nuestra tienda"}.
        Ganá comisiones y crecé con capacitación y herramientas.
      </p>

      <ul className="space-y-3 mb-8">
        <li className="flex items-start gap-3 text-gray-800 dark:text-gray-200">
          <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          Comisiones competitivas por cada venta
        </li>
        <li className="flex items-start gap-3 text-gray-800 dark:text-gray-200">
          <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          Capacitación y material de venta
        </li>
        <li className="flex items-start gap-3 text-gray-800 dark:text-gray-200">
          <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          Panel para seguimiento de pedidos y clientes
        </li>
      </ul>

      <div className="flex flex-col justify-center sm:flex-row gap-3">
        <button
          onClick={() => router.push("/vendedor")}
          className="
            w-full sm:w-auto px-6 py-3 rounded-lg text-base font-semibold
            bg-gray-900 text-gray-50 hover:bg-gray-800
            dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200
            focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          "
        >
          Aplicar ahora
        </button>

        <button
          onClick={() => router.push("/vendedor#detalles")}
          className="
            w-full sm:w-auto px-6 py-3 rounded-lg text-base font-medium
            bg-white text-gray-900 hover:bg-gray-100
            dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900
            border border-gray-200 dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700
            transition-colors
          "
        >
          Ver condiciones
        </button>
      </div>

      {/* Info secundaria */}
      <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        No se requiere experiencia previa. Cupos limitados por zona.
      </p>
    </div>
  </div>
</aside>

    </div>
  );
}
