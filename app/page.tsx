'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useConfig } from '@/hooks/useConfig';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import CategoryGrid from '@/components/CategoryGrid';
import Sidebar from '@/components/Sidebar';
import AdBanner from '@/components/AdBanner';
import PromotionCard from '@/components/PromotionCard';
import { Product, Category } from '@/types';
import { Menu, Zap, Shield, Truck, CreditCard, Star, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { config } = useConfig();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch all products
      const productsRes = await fetch('/api/products');
      const productsData = await productsRes.json();
      const products = productsData.products || [];
      setAllProducts(products);
      setFeaturedProducts(products.filter((p: Product) => p.featured));

      // Fetch categories
      const categoriesRes = await fetch('/api/categories');
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const promotions = [
    {
      id: '1',
      title: 'Super Descuento Herramientas',
      description: 'Hasta 30% OFF en toda la línea de herramientas manuales',
      discount: '30% OFF',
      validUntil: '31/12/2024',
      code: 'HERRAMIENTAS30',
      image: 'https://picsum.photos/300/200?random=promo1',
      type: 'discount' as const
    },
    {
      id: '2',
      title: 'Oferta Especial Pintura',
      description: '2x1 en pinturas seleccionadas para interior y exterior',
      discount: '2x1',
      validUntil: '15/01/2025',
      image: 'https://picsum.photos/300/200?random=promo2',
      type: 'offer' as const
    },
    {
      id: '3',
      title: 'Nuevos Productos',
      description: 'Descubre nuestra nueva línea de herramientas profesionales',
      discount: 'NUEVO',
      validUntil: '28/02/2025',
      image: 'https://picsum.photos/300/200?random=promo3',
      type: 'new' as const
    }
  ];

  const features = [
    {
      icon: Truck,
      title: 'Envío Gratis',
      description: 'En compras superiores a $50.000'
    },
    {
      icon: Shield,
      title: 'Garantía Extendida',
      description: 'Hasta 2 años en productos seleccionados'
    },
    {
      icon: CreditCard,
      title: 'Financiación',
      description: 'Hasta 12 cuotas sin interés'
    },
    {
      icon: Zap,
      title: 'Entrega Rápida',
      description: 'Recibí tu pedido en 24-48hs'
    }
  ];

  // Get random products for different sections
  const getRandomProducts = (count: number, exclude: string[] = []) => {
    return allProducts
      .filter(p => !exclude.includes(p.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  };

  const bestSellers = getRandomProducts(4);
  const newArrivals = getRandomProducts(4, bestSellers.map(p => p.id));
  const recommendations = getRandomProducts(6, [...bestSellers.map(p => p.id), ...newArrivals.map(p => p.id)]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Ad Banner */}
      <AdBanner />
      
      {/* Floating Sidebar Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-primary-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-primary-700 transition-colors z-30"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main>
        {/* Hero Section */}
        <section className="hero-section relative overflow-hidden">
          {/* Background overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="relative z-10 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Bienvenido a {config.storeName}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 text-white">
                Encuentra todo lo que necesitas para tus proyectos
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn btn-accent text-lg px-8 py-3 text-white bg-accent-600 hover:bg-accent-700">
                  Explorar Productos
                </button>
                <button className="btn bg-white bg-opacity-20 hover:bg-opacity-30 border-white border-opacity-30 text-lg px-8 py-3 text-white border-2">
                  Ver Ofertas
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-readable mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-readable-muted">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promotions */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-readable mb-4">
                🔥 Promociones Especiales
              </h2>
              <p className="text-readable-muted max-w-2xl mx-auto">
                No te pierdas estas increíbles ofertas por tiempo limitado
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {promotions.map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Nuestras Categorías
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explora nuestra amplia gama de productos organizados por categorías
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card h-48 animate-pulse bg-gray-200 dark:bg-gray-700" />
                ))}
              </div>
            ) : (
              <CategoryGrid categories={categories} />
            )}
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-primary-600" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Más Vendidos
                </h2>
              </div>
              <button className="btn btn-secondary">Ver Todos</button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card h-80 animate-pulse bg-gray-200 dark:bg-gray-700" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSellers.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Star className="h-8 w-8 text-yellow-500" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Productos Destacados
                </h2>
              </div>
              <button className="btn btn-secondary">Ver Todos</button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card h-80 animate-pulse bg-gray-200 dark:bg-gray-700" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 8).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                ✨ Nuevos Productos
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Descubre las últimas incorporaciones a nuestro catálogo
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card h-80 animate-pulse bg-gray-200 dark:bg-gray-700" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newArrivals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recommendations */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Recomendados para Ti
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Productos seleccionados especialmente para tus proyectos
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card h-80 animate-pulse bg-gray-200 dark:bg-gray-700" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¡No te pierdas nuestras ofertas!
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Suscríbete a nuestro newsletter y recibe descuentos exclusivos
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="btn btn-accent px-8 py-3">
                Suscribirse
              </button>
            </div>
          </div>
        </section>

        {/* Seller CTA Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Querés ser parte de nuestro equipo?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Únete como vendedor preventista y accede a comisiones atractivas, 
                capacitación continua y el respaldo de una empresa líder.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => router.push('/vendedor')}
                  className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                >
                  💼 Aplicar Ahora
                </button>
                <div className="text-sm opacity-80">
                  ✅ Sin experiencia requerida • ✅ Capacitación incluida
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}