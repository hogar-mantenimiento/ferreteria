'use client';

import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para continuar');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        window.location.href = data.preferenceUrl;
      } else {
        toast.error(data.message || 'Error al procesar el pago');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Error al procesar el pago');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mi Carrito
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Tu carrito está vacío
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Explora nuestros productos y agrega algunos a tu carrito
              </p>
              <button
                onClick={() => router.push('/')}
                className="btn btn-primary"
              >
                Seguir Comprando
              </button>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
              {/* Cart Items */}
              <div className="lg:col-span-8">
                <div className="card">
                  <div className="px-4 py-6 sm:px-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      Productos
                    </h2>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    {items.map((item) => (
                      <div key={item.product.id} className="border-b border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-24 h-24">
                            <img
                              src={item.product.images[0] || '/placeholder-product.jpg'}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="ml-6 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                  {item.product.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Código: {item.product.code}
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                                  ${item.product.price.toLocaleString()}
                                </p>
                              </div>
                              <div className="flex flex-col items-end">
                                <button
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="text-red-500 hover:text-red-700 mb-4"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    className="btn btn-secondary p-1"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="px-3 py-1 text-gray-900 dark:text-white">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    className="btn btn-secondary p-1"
                                    disabled={item.quantity >= item.product.stock}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4 mt-8 lg:mt-0">
                <div className="card p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Resumen del Pedido
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                      <span className="text-gray-900 dark:text-white">
                        ${getTotal().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Envío</span>
                      <span className="text-gray-900 dark:text-white">Gratis</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-gray-900 dark:text-white">
                          ${getTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handleCheckout}
                      className="btn btn-primary w-full"
                    >
                      Proceder al Pago
                    </button>
                    <button
                      onClick={clearCart}
                      className="btn btn-secondary w-full"
                    >
                      Vaciar Carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}