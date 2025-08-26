import CategoryPage from './client-page';

interface CategoryServerWrapperProps {
  params: {
    slug: string;
  };
}

export default function CategoryServerWrapper({ params }: CategoryServerWrapperProps) {
  return <CategoryPage params={params} />;
}