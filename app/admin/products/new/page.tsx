'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/AdminLayout';
import ProductForm from '@/components/ProductForm';
import { Product } from '@/types';

export default function NewProductPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  const handleSubmit = async (productData: Omit<Product, 'id'>) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        throw new Error('Error creating product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Agregar Nuevo Producto
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Completa la información del producto
          </p>
        </div>

        <ProductForm onSubmit={handleSubmit} />
      </div>
    </AdminLayout>
  );
}