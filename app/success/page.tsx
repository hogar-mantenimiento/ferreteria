'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Package, Clock } from 'lucide-react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    
    if (status === 'approved' && paymentId) {
      clearCart();
      fetchPaymentData(paymentId);
    }
  }, [searchParams, clearCart]);

  const fetchPaymentData = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/payment-status?payment_id=${paymentId}`);
      const data = await response.json();
      setPaymentData(data);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center space-y-8">
        <div className="flex justify-center">
          <CheckCircle className="h-24 w-24 text-green-500" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ¡Pago Exitoso!
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Tu pedido ha sido confirmado y procesado correctamente
          </p>
        </div>

        {paymentData && (
          <div className="card p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Detalles del Pago
            </h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">ID de Pago:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {paymentData.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Monto:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${paymentData.transaction_amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Estado:</span>
                <span className="font-medium text-green-600">
                  {paymentData.status}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="card p-6 text-center">
            <Package className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Preparación del Pedido
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Comenzaremos a preparar tu pedido inmediatamente
            </p>
          </div>

          <div className="card p-6 text-center">
            <Clock className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tiempo de Entrega
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Estimamos entregar tu pedido en 3-5 días hábiles
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Te enviaremos un correo con los detalles del pedido y el número de seguimiento
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="btn btn-primary"
            >
              Seguir Comprando
            </button>
            <button
              onClick={() => router.push('/orders')}
              className="btn btn-secondary"
            >
              Ver Mis Pedidos
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <Suspense fallback={<div className="p-8 text-center">Cargando...</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
