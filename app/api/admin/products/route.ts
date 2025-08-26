import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Product } from '@/types';

// Mock products data - same as in products/route.ts but mutable for admin operations
let products: Product[] = [
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
  }
];

function verifyAdminAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'default-secret') as any;
    return decoded.role === 'admin' ? decoded : null;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      products,
      total: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const productData = await request.json();
    
    const newProduct: Product = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    products.push(newProduct);

    return NextResponse.json({
      product: newProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}