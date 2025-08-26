'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function FailurePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <XCircle className="h-24 w-24 text-red-500" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Error en el Pago
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Hubo un problema al procesar tu pago. Por favor, inténtalo de nuevo.
            </p>
          </div>

          <div className="card p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Posibles Causas
            </h2>
            <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Fondos insuficientes en la tarjeta</li>
              <li>• Datos de la tarjeta incorrectos</li>
              <li>• Problemas temporales del sistema</li>
              <li>• Límite de transacciones excedido</li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Tu carrito se mantiene guardado. Puedes intentar realizar el pago nuevamente.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/cart')}
                className="btn btn-primary"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Intentar de Nuevo
              </button>
              <button
                onClick={() => router.push('/')}
                className="btn btn-secondary"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}