'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { ShoppingCart, Eye, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, onAddToCart, viewMode = 'grid' }: ProductCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    onAddToCart();
    setTimeout(() => setIsLoading(false), 300);
  };

  if (viewMode === 'list') {
    return (
      <div className="card p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0 w-24 h-24">
            <img
              src={product.images[0] || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Código: {product.code}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${product.price.toLocaleString()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? 'En stock' : 'Sin stock'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="btn btn-secondary px-3 py-2"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isLoading}
                  className="btn btn-primary px-3 py-2 disabled:opacity-50"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-card group animate-fade-in-up">
      <div className="relative overflow-hidden">
        <img
          src={product.images[0] || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <button
              onClick={() => router.push(`/product/${product.id}`)}
              className="btn btn-secondary p-2"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button className="btn btn-secondary p-2">
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
        {product.featured && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
            Destacado
          </span>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-readable hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
            <button
              onClick={() => router.push(`/product/${product.id}`)}
              className="text-left"
            >
              {product.name}
            </button>
          </h3>
          <p className="text-sm text-readable-light">
            Código: {product.code}
          </p>
        </div>
        
        <p className="text-readable-muted text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="price-current">
            ${product.price.toLocaleString()}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            product.stock > 0 
              ? 'bg-green-100 text-green-800 dark:bg-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isLoading}
          className="ml-button-primary bg-gray-900 dark:bg-slate-100 w-full disabled:opacity-50 disabled:cursor-not-allowed text-gray-50 dark:text-gray-900 hover:bg-gray-700"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isLoading ? 'Agregando...' : 'Agregar al Carrito'}
        </button>
      </div>
    </div>
  );
}