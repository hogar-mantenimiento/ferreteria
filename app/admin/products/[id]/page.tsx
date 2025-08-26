'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/AdminLayout';
import ProductForm from '@/components/ProductForm';
import { Product } from '@/types';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
      return;
    }
    
    if (user?.role === 'admin') {
      fetchProduct();
    }
  }, [user, loading, router, params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`);
      const data = await response.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (productData: Omit<Product, 'id'>) => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        throw new Error('Error updating product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  if (loading || !user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return null;
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Producto no encontrado
          </h1>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Editar Producto
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Actualiza la información del producto
          </p>
        </div>

        <ProductForm product={product} onSubmit={handleSubmit} />
      </div>
    </AdminLayout>
  );
}