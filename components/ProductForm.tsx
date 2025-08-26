'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '@/types';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  code: z.string().min(1, 'El código es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  stock: z.number().min(0, 'El stock debe ser mayor o igual a 0'),
  category: z.string().min(1, 'La categoría es requerida'),
  featured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Omit<Product, 'id'>) => Promise<void>;
}

export default function ProductForm({ product, onSubmit }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      code: product.code,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      featured: product.featured,
    } : undefined,
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setImages([...images, imageUrl]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      await onSubmit({
        ...data,
        images,
        createdAt: product?.createdAt || new Date(),
        updatedAt: new Date(),
      });
      toast.success(product ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
    } catch (error) {
      toast.error('Error al guardar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    'Herramientas',
    'Herramientas Eléctricas',
    'Ferretería',
    'Pintura',
    'Fontanería',
    'Electricidad',
    'Jardín',
    'Seguridad',
  ];

  return (
    <div className="card p-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
              Nombre del Producto
            </label>
            <input
              {...register('name')}
              className="input"
              placeholder="Martillo de Acero"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
              Código del Producto
            </label>
            <input
              {...register('code')}
              className="input"
              placeholder="MAR001"
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="input"
            placeholder="Descripción detallada del producto..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
           <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
              Precio
            </label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              className="input"
              placeholder="25000"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
           <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
              Stock
            </label>
            <input
              {...register('stock', { valueAsNumber: true })}
              type="number"
              className="input"
              placeholder="50"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
            )}
          </div>

          <div>
           <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
              Categoría
            </label>
            <select {...register('category')} className="input">
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* Featured */}
        <div className="flex items-center space-x-2">
          <input
            {...register('featured')}
            type="checkbox"
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label className="text-sm font-medium text-gray-800 dark:text-gray-300">
            Producto destacado
          </label>
        </div>

        {/* Images */}
        <div>
        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
            Imágenes
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Producto ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-8 w-8 mb-3 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Haz clic para subir imagen
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : product ? 'Actualizar Producto' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}