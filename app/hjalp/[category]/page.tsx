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
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryId } = await params;
  const category = getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  return <CategoryClient category={category} categoryId={categoryId} />;
}

