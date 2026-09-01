import { useEffect, useState } from 'react';
import { getCategories, getProducts } from '@/services/productService';
import type { Category } from '@/types';
import CategoryCard from '@/components/CategoryCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const cats = await getCategories();
        setCategories(cats);
        const countPromises = cats.map(async (cat) => {
          const { total } = await getProducts({ categoryId: cat.id, limit: 1 });
          return [cat.id, total] as [string, number];
        });
        const countEntries = await Promise.all(countPromises);
        const countMap: Record<string, number> = {};
        countEntries.forEach(([id, count]) => { countMap[id] = count; });
        setCounts(countMap);
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner size="lg" label="Loading categories..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Categories</h1>
        <p className="text-sm text-gray-500 mt-1">Browse groceries by category</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} productCount={counts[cat.id] ?? 0} />
        ))}
      </div>
    </div>
  );
}
