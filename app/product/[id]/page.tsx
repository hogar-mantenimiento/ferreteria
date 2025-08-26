'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { ShoppingCart, Heart, Share2, Star, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      console.log('Fetching product with ID:', params.id);
      
      const response = await fetch(`/api/products/${params.id}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Product data received:', data);
        setProduct(data.product);
        
        // Fetch related products from the same category
        if (data.product) {
          fetchRelatedProducts(data.product.category, data.product.id);
        }
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        toast.error('Producto no encontrado');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error al cargar el producto');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category: string, currentProductId: string) => {
    try {
      const response = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
      if (response.ok) {
        const data = await response.json();
        // Filter out current product and limit to 4 related products
        const related = (data.products || [])
          .filter((p: Product) => p.id !== currentProductId)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    toast.success(`${quantity} ${product.name} agregado${quantity > 1 ? 's' : ''} al carrito`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
              <div className="bg-gray-300 dark:bg-gray-700 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Producto no encontrado
            </h1>
            <button
              onClick={() => router.push('/')}
              className="mt-4 btn btn-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <button onClick={() => router.push('/')} className="hover:text-primary-600">
            Inicio
          </button>
          <span>/</span>
          <button 
            onClick={() => router.push(`/category/${product.category.toLowerCase()}`)}
            className="hover:text-primary-600"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index 
                        ? 'border-primary-500' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="mt-8 lg:mt-0">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Código: {product.code}
                </p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    (4.0)
                  </span>
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ${product.price.toLocaleString()}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Descripción
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {product.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Categoría
                </h3>
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                  {product.category}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Disponibilidad
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                </span>
              </div>

              {product.stock > 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cantidad
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="btn btn-secondary px-3 py-1"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border border-gray-300 rounded-md">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="btn btn-secondary px-3 py-1"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddToCart}
                      className="btn btn-primary flex-1"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Agregar al Carrito
                    </button>
                    <button className="btn btn-secondary px-4">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="btn btn-secondary px-4">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Productos Relacionados
              </h2>
              <button
                onClick={() => router.push(`/category/${product.category.toLowerCase()}`)}
                className="btn btn-secondary"
              >
                Ver todos en {product.category}
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={() => addToCart(relatedProduct)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}