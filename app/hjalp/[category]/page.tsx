import { Container } from '@/components/ui/Container';
import { faqCategories, getCategoryById } from '@/lib/data/faqData';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CategoryClient } from './CategoryClient';

// Generate static params for all categories
export function generateStaticParams() {
  return faqCategories.map((category) => ({
    category: category.id,
  }));
}

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryById(params.category);

  if (!category) {
    notFound();
  }

  return <CategoryClient category={category} categoryId={params.category} />;
}

