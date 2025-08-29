'use client';

import { Clock, Tag, Star } from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  code?: string;
  image: string;
  type: 'discount' | 'offer' | 'new';
}

interface PromotionCardProps {
  promotion: Promotion;
  /** Opcional: relación de aspecto del banner. Por defecto 16/9 */
  aspectRatio?: `${number}/${number}`;
}

export default function PromotionCard({ promotion, aspectRatio = '16/9' }: PromotionCardProps) {
  const getTypeIcon = () => {
    switch (promotion.type) {
      case 'discount':
        return <Tag className="h-4 w-4" />;
      case 'offer':
        return <Star className="h-4 w-4" />;
      case 'new':
        return <Clock className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (promotion.type) {
      case 'discount':
        return 'bg-red-500';
      case 'offer':
        return 'bg-yellow-500';
      case 'new':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div
      className="
        group h-full flex flex-col overflow-hidden rounded-xl
        border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-800
        shadow-sm transition-shadow hover:shadow-md
      "
      role="article"
      aria-label={promotion.title}
    >
      {/* Imagen con relación de aspecto fija para evitar saltos */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio }}>
        <img
          src={promotion.image}
          alt={promotion.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className={`
            absolute left-2 top-2 inline-flex items-center gap-1
            ${getTypeColor()} text-white
            rounded-full px-2 py-1 text-[11px] font-semibold shadow
          `}
          aria-label={`Tipo: ${promotion.type}`}
        >
          {getTypeIcon()}
          <span>{promotion.discount}</span>
        </div>
      </div>

      {/* Contenido - se expande para empujar el botón abajo */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-2 text-base font-semibold text-gray-900 dark:text-white">
          {promotion.title}
        </h3>

        {/* Descripción: permitimos 3-4 líneas; si no usás el plugin line-clamp, igual funciona,
            solo que no cortará con puntos suspensivos */}
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {promotion.description}
        </p>

        <div className="mb-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Válido hasta: {promotion.validUntil}</span>
          {promotion.code && (
            <span
              className="
                rounded bg-gray-100 px-2 py-1 font-mono
                text-gray-700 dark:bg-gray-800 dark:text-gray-200
              "
              aria-label="Código de promoción"
              title="Código de promoción"
            >
              {promotion.code}
            </span>
          )}
        </div>

        {/* Spacer automático: esto empuja el botón al fondo */}
        <div className="mt-auto">
          <button
            className="
              w-full rounded-lg px-3 py-2 text-sm font-medium
              bg-gray-900 text-gray-50 hover:bg-gray-800
              dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-200
              disabled:cursor-not-allowed disabled:opacity-50
              transition-colors
            "
          >
            Aprovechar oferta
          </button>
        </div>
      </div>
    </div>
  );
}
