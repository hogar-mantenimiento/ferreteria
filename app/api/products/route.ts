import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';

// Mock products data - In production, this would come from a database
const products: Product[] = [
  {
    id: '1',
    name: 'Martillo de Acero',
    code: 'MAR001',
    description: 'Martillo de acero forjado con mango ergonómico. Ideal para trabajos de carpintería y construcción.',
    price: 25000,
    stock: 50,
    category: 'Herramientas',
    images: ['https://picsum.photos/400/400?random=1'],
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Destornillador Phillips',
    code: 'DES001',
    description: 'Set de destornilladores Phillips de diferentes tamaños. Mango antideslizante.',
    price: 15000,
    stock: 30,
    category: 'Herramientas',
    images: ['https://picsum.photos/400/400?random=2'],
    featured: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: '3',
    name: 'Taladro Eléctrico',
    code: 'TAL001',
    description: 'Taladro eléctrico de 500W con velocidad variable. Incluye set de brocas.',
    price: 85000,
    stock: 15,
    category: 'Herramientas Eléctricas',
    images: ['https://picsum.photos/400/400?random=3'],
    featured: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: '4',
    name: 'Tornillos Autorroscantes',
    code: 'TOR001',
    description: 'Caja de 100 tornillos autorroscantes de 1 pulgada. Acero galvanizado.',
    price: 8000,
    stock: 100,
    category: 'Ferretería',
    images: ['https://picsum.photos/400/400?random=4'],
    featured: false,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04')
  },
  {
    id: '5',
    name: 'Pintura Látex Blanca',
    code: 'PIN001',
    description: 'Pintura látex blanca de 1 galón. Acabado mate, fácil aplicación.',
    price: 35000,
    stock: 25,
    category: 'Pintura',
    images: ['https://picsum.photos/400/400?random=5'],
    featured: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '6',
    name: 'Llave Inglesa',
    code: 'LLA001',
    description: 'Llave inglesa ajustable de 10 pulgadas. Acero al carbono.',
    price: 22000,
    stock: 40,
    category: 'Herramientas',
    images: ['https://picsum.photos/400/400?random=6'],
    featured: false,
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06')
  },
  {
    id: '7',
    name: 'Sierra Circular',
    code: 'SIE001',
    description: 'Sierra circular de 7 1/4 pulgadas con motor de 1200W. Incluye hoja de corte.',
    price: 150000,
    stock: 8,
    category: 'Herramientas Eléctricas',
    images: ['https://picsum.photos/400/400?random=7'],
    featured: true,
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07')
  },
  {
    id: '8',
    name: 'Clavos de Acero',
    code: 'CLA001',
    description: 'Caja de 500 clavos de acero de 2 pulgadas. Cabeza redonda.',
    price: 12000,
    stock: 80,
    category: 'Ferretería',
    images: ['https://picsum.photos/400/400?random=8'],
    featured: false,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '9',
    name: 'Amoladora Angular',
    code: 'AMO001',
    description: 'Amoladora angular de 4.5 pulgadas con motor de 850W. Ideal para corte y desbaste.',
    price: 95000,
    stock: 12,
    category: 'Herramientas Eléctricas',
    images: ['https://picsum.photos/400/400?random=9'],
    featured: true,
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09')
  },
  {
    id: '10',
    name: 'Set de Llaves Combinadas',
    code: 'SET001',
    description: 'Set de 12 llaves combinadas de 8mm a 19mm. Acero cromo vanadio.',
    price: 45000,
    stock: 20,
    category: 'Herramientas',
    images: ['https://picsum.photos/400/400?random=10'],
    featured: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '11',
    name: 'Soldadora Inverter',
    code: 'SOL001',
    description: 'Soldadora inverter de 200A con display digital. Incluye accesorios.',
    price: 280000,
    stock: 5,
    category: 'Herramientas Eléctricas',
    images: ['https://picsum.photos/400/400?random=11'],
    featured: true,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11')
  },
  {
    id: '12',
    name: 'Escalera de Aluminio',
    code: 'ESC001',
    description: 'Escalera de aluminio de 6 escalones. Capacidad 150kg.',
    price: 120000,
    stock: 8,
    category: 'Seguridad',
    images: ['https://picsum.photos/400/400?random=12'],
    featured: false,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '13',
    name: 'Compresor de Aire',
    code: 'COM001',
    description: 'Compresor de aire de 50L con motor de 2HP. Ideal para herramientas neumáticas.',
    price: 350000,
    stock: 3,
    category: 'Herramientas Eléctricas',
    images: ['https://picsum.photos/400/400?random=13'],
    featured: true,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  },
  {
    id: '14',
    name: 'Casco de Seguridad',
    code: 'CAS001',
    description: 'Casco de seguridad industrial con ajuste de cremallera. Certificado.',
    price: 18000,
    stock: 50,
    category: 'Seguridad',
    images: ['https://picsum.photos/400/400?random=14'],
    featured: false,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '15',
    name: 'Lijadora Orbital',
    code: 'LIJ001',
    description: 'Lijadora orbital de 1/4 de hoja con sistema de aspiración de polvo.',
    price: 75000,
    stock: 15,
    category: 'Herramientas Eléctricas',
    images: ['https://picsum.photos/400/400?random=15'],
    featured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '16',
    name: 'Tubo PVC 110mm',
    code: 'TUB001',
    description: 'Tubo PVC sanitario de 110mm x 3m. Para desagües cloacales.',
    price: 12000,
    stock: 30,
    category: 'Fontanería',
    images: ['https://picsum.photos/400/400?random=16'],
    featured: false,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '17',
    name: 'Cable Eléctrico 2.5mm',
    code: 'CAB001',
    description: 'Cable eléctrico unipolar de 2.5mm x 100m. Certificado IRAM.',
    price: 85000,
    stock: 25,
    category: 'Electricidad',
    images: ['https://picsum.photos/400/400?random=17'],
    featured: false,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: '18',
    name: 'Motosierra',
    code: 'MOT001',
    description: 'Motosierra de 16 pulgadas con motor de 2 tiempos. Ideal para poda.',
    price: 180000,
    stock: 6,
    category: 'Jardín',
    images: ['https://picsum.photos/400/400?random=18'],
    featured: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    let filteredProducts = products;

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by featured
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured);
    }

    // Filter by search
    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      products: filteredProducts,
      total: filteredProducts.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}