'use client';

import { useEffect, useState, useMemo } from 'react';
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
import type { Product, Category } from '@/types';
import { Menu, Zap, Shield, Truck, CreditCard, Star, TrendingUp } from 'lucide-react';
import CTAEquipo from '@/components/CTAEquipo';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { config, loading: configLoading } = useConfig();
  const storeName = configLoading ? 'Cargando...' : config.storeName;

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
      const productsRes = await fetch('/api/products');
      const productsData = await productsRes.json();
      const products: Product[] = productsData.products || [];
      setAllProducts(products);
      setFeaturedProducts(products.filter((p: Product) => (p as any)?.featured));

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
    { icon: Truck, title: 'Envío Gratis', description: 'En compras superiores a $50.000' },
    { icon: Shield, title: 'Garantía Extendida', description: 'Hasta 2 años en productos seleccionados' },
    { icon: CreditCard, title: 'Financiación', description: 'Hasta 12 cuotas sin interés' },
    { icon: Zap, title: 'Entrega Rápida', description: 'Recibí tu pedido en 24-48hs' }
  ];

  // Helpers de productos (memo para no recalcular en cada render)
  const getRandomProducts = (count: number, exclude: string[] = []) => {
    const pool = allProducts.filter(p => !exclude.includes(String((p as any).id)));
    return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
  };

  const bestSellers = useMemo(() => getRandomProducts(4), [allProducts]);
  const newArrivals = useMemo(
    () => getRandomProducts(4, bestSellers.map(p => String((p as any).id))),
    [allProducts, bestSellers]
  );
  const recommendations = useMemo(
    () =>
      getRandomProducts(
        6,
        [...bestSellers, ...newArrivals].map(p => String((p as any).id))
      ),
    [allProducts, bestSellers, newArrivals]
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      {/* Header y Nav respetan tema si internamente usan colores neutrales o `dark:` */}
      <Header />
      <Navbar />

      <AdBanner />

      {/* Botón flotante para abrir Sidebar */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Abrir menú lateral"
        className="fixed top-1/2 right-0 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors z-30"
      >
        <Menu className="h-6 w-6" />
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main>
        {/* Hero */}
        <section
  className="relative overflow-hidden bg-white dark:bg-gray-900 transition-colors min-h-screen flex items-center bg-cover bg-center"
  style={{ backgroundImage: "url('/images/fondo.png')" }}
>
  {/* Overlay oscuro que cubre toda la vista */}
  <div className="absolute inset-0 bg-black/60" />

  {/* Contenido */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
        Bienvenido a {storeName || "Nuestra Tienda"}
      </h1>
      <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto">
        Encuentra todo lo que necesitas para tus proyectos
      </p>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button
          className="px-8 py-3 rounded-lg font-medium border border-gray-300 text-white hover:bg-white/10 
          focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onClick={() => router.push("/productos")}
        >
          Explorar Productos
        </button>

        <button
          className="px-8 py-3 rounded-lg font-medium border border-gray-300 text-white hover:bg-white/10 
          focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onClick={() => router.push("/vendedor")}
        >
         Unite a nuestro equipo
        </button>
      </div>
    </div>
  </div>
</section>





        {/* Features */}
        <section className="py-12 bg-white dark:bg-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                >
                  <div className="mx-auto mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promociones */}
        <section className="py-16 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">🔥 Promociones Especiales</h2>
              <p className="text-gray-600 dark:text-gray-300">
                No te pierdas estas increíbles ofertas por tiempo limitado
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {promotions.map(promo => (
                <PromotionCard key={promo.id} promotion={promo} />
              ))}
            </div>
          </div>
        </section>

        {/* Categorías */}
        <section className="py-16 bg-white dark:bg-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Nuestras Categorías</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Explora nuestra amplia gama de productos organizados por categorías
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
                  />
                ))}
              </div>
            ) : (
              <CategoryGrid categories={categories} />
            )}
          </div>
        </section>

        {/* Más vendidos */}
        <section className="py-16 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h2 className="text-3xl font-bold">Más Vendidos</h2>
              </div>
              <button
                onClick={() => router.push('/mas-vendidos')}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Ver Todos
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSellers.map(product => (
                  <ProductCard
                    key={String((product as any).id)}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Destacados */}
        <section className="py-16 bg-white dark:bg-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
                <h2 className="text-3xl font-bold">Productos Destacados</h2>
              </div>
              <button
                onClick={() => router.push('/destacados')}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Ver Todos
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 8).map(product => (
                  <ProductCard
                    key={String((product as any).id)}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Nuevos */}
        <section className="py-16 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">✨ Nuevos Productos</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Descubre las últimas incorporaciones a nuestro catálogo
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newArrivals.map(product => (
                  <ProductCard
                    key={String((product as any).id)}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recomendaciones */}
        <section className="py-16 bg-white dark:bg-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Recomendados para Ti</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Productos seleccionados especialmente para tus proyectos
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map(product => (
                  <ProductCard
                    key={String((product as any).id)}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">¡No te pierdas nuestras ofertas!</h2>
            <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
              Suscríbete a nuestro newsletter y recibe descuentos exclusivos
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Tu email"
                className="
          flex-1 px-4 py-3 rounded-lg
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500
        "
              />
              <button
                onClick={() => router.push('/newsletter')}
                className="
        w-full rounded-lg px-3 py-2 text-sm font-medium
        bg-gray-900 text-gray-50 hover:bg-gray-800
        dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-200
        disabled:cursor-not-allowed disabled:opacity-50
        transition-colors
        "
              >
                Suscribirse
              </button>
            </div>
          </div>
        </section>


        {/* CTA Vendedor */}
        <CTAEquipo />
      </main>

      <Footer />
    </div>
  );
}
