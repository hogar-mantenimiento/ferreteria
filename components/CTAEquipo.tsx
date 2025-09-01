'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

export default function CTAEquipo() {
  const router = useRouter();

  return (
    <section
      className="relative py-16 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/fondo-login.png')" }}
    >
      {/* Overlay para oscurecer la imagen */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Card sobre el fondo */}
        <div
          className="
            rounded-2xl border border-gray-200 dark:border-gray-700
            bg-gray-50/90 dark:bg-gray-900/80
            p-8 md:p-12 text-center shadow-lg
          "
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            ¿Querés ser parte de nuestro equipo?
          </h2>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Unite como <span className="font-semibold">vendedor preventista</span> y accedé a
            comisiones competitivas, capacitación continua y el respaldo de una empresa líder.
          </p>

          {/* Beneficios */}
          <ul className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
            <li className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Sin experiencia requerida
            </li>
            <li className="hidden sm:block text-gray-400">•</li>
            <li className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Capacitación incluida
            </li>
          </ul>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push('/vendedor')}
              className="
                w-full sm:w-auto px-8 py-3 text-base md:text-lg font-semibold rounded-lg
                bg-gray-900 text-gray-100 hover:bg-gray-800
                dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200
                focus:outline-none focus:ring-2 focus:ring-indigo-400
                transition-colors
              "
            >
              Aplicar ahora
            </button>

            <button
              onClick={() => router.push('/vendedor#detalles')}
              className="
                w-full sm:w-auto px-8 py-3 text-base md:text-lg font-medium rounded-lg
                bg-white text-gray-900 hover:bg-gray-100
                dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800
                border border-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600
                transition-colors
              "
            >
              Más información
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
