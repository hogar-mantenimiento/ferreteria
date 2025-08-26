// app/category/[slug]/page.tsx
import CategoryServerWrapper from './category-server-wrapper';

// Forzamos render dinámico (evita SSG/ISR y los errores por APIs/cookies en build)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Mientras no tengas una fuente de datos accesible en build, no generamos rutas estáticas.
// Esto evita el fetch a localhost/VERCEL_URL durante el build.
export async function generateStaticParams() {
  return [];
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  return <CategoryServerWrapper params={params} />;
}
