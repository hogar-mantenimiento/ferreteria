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
}

export default function PromotionCard({ promotion }: PromotionCardProps) {
  const getTypeIcon = () => {
    switch (promotion.type) {
      case 'discount':
        return <Tag className="h-5 w-5" />;
      case 'offer':
        return <Star className="h-5 w-5" />;
      case 'new':
        return <Clock className="h-5 w-5" />;
      default:
        return <Tag className="h-5 w-5" />;
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
    <div className="card group hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden">
        <img
          src={promotion.image}
          alt={promotion.title}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className={`absolute top-2 left-2 ${getTypeColor()} text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1`}>
          {getTypeIcon()}
          <span>{promotion.discount}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          {promotion.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {promotion.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span>Válido hasta: {promotion.validUntil}</span>
          {promotion.code && (
            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {promotion.code}
            </span>
          )}
        </div>
        
        <button className="btn btn-primary w-full text-sm">
          Aprovechar Oferta
        </button>
      </div>
    </div>
  );
}