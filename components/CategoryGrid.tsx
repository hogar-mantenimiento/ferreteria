'use client';

import { useRouter } from 'next/navigation';
import { Category } from '@/types';
import { ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="card group hover:shadow-lg transition-shadow cursor-pointer animate-fade-in"
          onClick={() => router.push(`/category/${category.slug}`)}
        >
          <div className="relative overflow-hidden">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              <p className="text-sm opacity-90 mb-3">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {category.productCount} productos
                </span>
                <div className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span className="text-sm">Ver más</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}