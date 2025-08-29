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
          role="button"
          tabIndex={0}
          aria-label={`Ver categoría ${category.name}`}
          onClick={() => router.push(`/category/${category.slug}`)}
          onKeyDown={(e) =>
            (e.key === 'Enter' || e.key === ' ') &&
            router.push(`/category/${category.slug}`)
          }
          className={`
            group relative overflow-hidden rounded-xl border
            border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            shadow-sm hover:shadow-md transition-all
            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400
            focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900
            cursor-pointer animate-fade-in
          `}
        >
          {/* Imagen */}
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Overlay (debajo) */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

          {/* Contenido (encima) */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 text-white">
            <h3 className="text-lg sm:text-xl font-bold mb-1.5 line-clamp-1 text-white">
              {category.name}
            </h3>

            {category.description ? (
              <p className="text-sm/5 line-clamp-2 mb-3 text-white">
                {category.description}
              </p>
            ) : null}

            <div className="flex items-center justify-between text-sm text-white">
              <span className="text-white">
                {category.productCount} productos
              </span>
              <span className="inline-flex items-center gap-1 transition-transform group-hover:translate-x-1 text-white">
                <span className="underline underline-offset-2 text-white decoration-white/60">
                  Ver más
                </span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
