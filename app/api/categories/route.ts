import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/types';

// Mock categories data - In production, this would come from a database
const categories: Category[] = [
  {
    id: '1',
    name: 'Herramientas',
    slug: 'herramientas',
    description: 'Herramientas manuales y básicas para todo tipo de trabajos',
    image: 'https://picsum.photos/300/200?random=tools',
    productCount: 25
  },
  {
    id: '2',
    name: 'Herramientas Eléctricas',
    slug: 'herramientas-electricas',
    description: 'Herramientas eléctricas para trabajos profesionales',
    image: 'https://picsum.photos/300/200?random=electric',
    productCount: 15
  },
  {
    id: '3',
    name: 'Ferretería',
    slug: 'ferreteria',
    description: 'Tornillos, clavos, tuercas y elementos de ferretería',
    image: 'https://picsum.photos/300/200?random=hardware',
    productCount: 45
  },
  {
    id: '4',
    name: 'Pintura',
    slug: 'pintura',
    description: 'Pinturas, barnices y accesorios para pintura',
    image: 'https://picsum.photos/300/200?random=paint',
    productCount: 30
  },
  {
    id: '5',
    name: 'Fontanería',
    slug: 'fontaneria',
    description: 'Tuberías, llaves, accesorios y herramientas de fontanería',
    image: 'https://picsum.photos/300/200?random=plumbing',
    productCount: 20
  },
  {
    id: '6',
    name: 'Electricidad',
    slug: 'electricidad',
    description: 'Cables, enchufes, interruptores y material eléctrico',
    image: 'https://picsum.photos/300/200?random=electrical',
    productCount: 35
  }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      categories,
      total: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}