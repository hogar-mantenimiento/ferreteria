import CategoryServerWrapper from './category-server-wrapper';

export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/categories`);
    const data = await response.json();
    
    return data.categories?.map((category: any) => ({
      slug: category.slug,
    })) || [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  return <CategoryServerWrapper params={params} />;
}